# Live Shipment Tracking — Requirements & Implementation Guide

> **Audience:** primarily the **backend developer** (§1–§9, §11–§12), plus a
> **frontend plan** (§10) for finishing the shipper/transporter live view. You
> are **not assumed to know the feature or the plan** — this document explains
> the idea, the data to store, the exact REST and Socket.io contracts the mobile
> app already speaks, the business rules to enforce, and the remaining frontend
> work that consumes the same contract.
>
> **Source of truth:** the React Native app is already wired to these endpoints
> and socket events. The payload shapes below are taken directly from the app
> code (`src/presentation/driver/screens/LiveTrackingScreen.tsx`,
> `src/domain/constants/socketEvents.ts`). **Match them exactly** — field names,
> casing, and coordinate order all matter.

---

## 1. The feature in plain words

A shipment is carried by **one driver** and watched by a **shipper** and a
**transporter**. We want everyone to see the truck move on a map in real time.

The flow:

1. A driver opens a shipment and drives toward the **pickup** location.
   - The app shows a route line from the driver to the pickup.
   - The shipper and transporter see the **planned route** (pickup → delivery)
     on their map, but **no live truck yet**.
2. When the driver reaches the pickup, they tap **"Start Ride"**.
   - The ride is now **live**.
   - From this moment the shipper and transporter see the **driver's live
     location** moving on the map, plus the **path the truck has already
     driven** (a trail).
   - The driver continues to see the road/route they should follow.
3. A driver can have **only one ride live at a time**. They cannot start a second
   ride until the current one is completed.
4. When the driver taps **"Arrival at Destination" / completes the ride**:
   - The ride is finished.
   - The **driven path disappears** from the map on that shipment's details for
     everyone. The shipment goes back to showing just the static info.

Your job on the backend is to: store the driver's positions, relay them live to
the shipper/transporter, compute trip progress, enforce the "one live ride"
rule, and clear the path when the ride completes.

---

## 2. Roles & who sees what

| Role | Emits location? | Sees live truck? | Sees driven path? |
|---|---|---|---|
| **DRIVER** | ✅ yes (their own GPS) | ✅ (their own) | ✅ (during ride) |
| **SHIPPER** | ❌ no | ✅ (read-only) | ✅ (during ride) |
| **TRANSPORTER** | ❌ no | ✅ (read-only) | ✅ (during ride) |

There is **no admin** in the mobile app. The driver account is created by the
transporter.

---

## 3. Shipment lifecycle (status)

The app uses these exact status strings (see `ShipmentStatus` in
`src/data/services/shipmentService.ts`):

```
PENDING  →  IN_PROGRESS  →  IN_TRANSIT  →  COMPLETED
```

| Status | Meaning | Live tracking? |
|---|---|---|
| `PENDING` | Created, not yet assigned | No |
| `IN_PROGRESS` | Assigned to a driver; driver heading to pickup | No (planned route only) |
| `IN_TRANSIT` | **Ride started** — driver is carrying the load | **YES — live** |
| `COMPLETED` | Delivered — ride finished | No (path cleared) |

The transition that **starts** live tracking is `IN_PROGRESS → IN_TRANSIT`.
The transition that **ends** it is `IN_TRANSIT → COMPLETED`.

---

## 4. Data model (what to store on the Shipment)

The app reads GeoJSON, so store coordinates as GeoJSON. **GeoJSON order is
`[longitude, latitude]`** — not lat/lng. The app already swaps them; if you swap
them too, pins land in the ocean.

Add/confirm these fields on the shipment document:

```jsonc
{
  "_id": "…",
  "shipper_id": "…",
  "transporter_id": "…",
  "driver_id": "…",
  "status": "IN_TRANSIT",          // see lifecycle above

  // RECOMMENDED — store pickup/delivery coords at shipment creation
  // (lets the shipper/transporter maps stop geocoding free-text addresses).
  "pickup_coord":   { "type": "Point", "coordinates": [90.4125, 23.8103] },
  "delivery_coord": { "type": "Point", "coordinates": [91.7832, 22.3569] },

  // LIVE TRACKING — written while the ride is IN_TRANSIT
  "current_location": {
    "type": "Point",
    "coordinates": [90.4200, 23.8150]      // latest driver position [lng, lat]
  },
  "location_history": {
    "type": "LineString",
    "coordinates": [                        // ordered trail of driven points
      [90.4125, 23.8103],
      [90.4160, 23.8120],
      [90.4200, 23.8150]
    ]
  }
}
```

Notes:
- `current_location` = the **last known** driver position.
- `location_history.coordinates` = the **ordered list** of points the driver has
  travelled, oldest → newest. The app draws this as the "driven path" trail.
- A `2dsphere` index on `current_location` is recommended if you ever query by
  proximity (not required for this feature, but cheap to add).

---

## 5. Socket.io contract

### 5.1 Connection & auth

The app connects to `SOCKET_URL` over the **websocket** transport and passes the
JWT **access token** in the handshake auth (see
`src/data/socket/socketClient.ts`):

```js
io(SOCKET_URL, { auth: { token }, transports: ["websocket"] })
```

On the server you must:
1. Read the token from `socket.handshake.auth.token`.
2. Verify it (same secret/logic as the REST `axiosClient` access token).
3. Attach the authenticated user id + role to the socket (e.g. `socket.data.user`).
4. Reject the connection if the token is missing/invalid.

### 5.2 Event names

These constants are defined in `src/domain/constants/socketEvents.ts` and must
match **byte-for-byte**:

| Constant | Event string | Direction |
|---|---|---|
| `JOIN_TRACKING_ROOM` | `tracking:join` | client → server |
| `LEAVE_TRACKING_ROOM` | `tracking:leave` | client → server |
| `DRIVER_LOCATION_PUSH` | `driver:location_push` | client → server (driver only) |
| `DRIVER_LOCATION_UPDATE` | `driver:location_update` | server → room |
| `SHIPMENT_PROGRESS_UPDATE` | `shipment:progress_update` | server → room |

### 5.3 Rooms

Use **one room per shipment**, keyed by `shipmentId`. Suggested room name:
`tracking:<shipmentId>`. Everyone watching a shipment (driver, shipper,
transporter) joins the same room; the server broadcasts updates to that room.

### 5.4 Events — exact payloads

#### `tracking:join` (client → server)
```json
{ "shipmentId": "69b8a2cd51dfd9e32ea1214a" }
```
**Server action:** authorize that this user is the shipment's driver, shipper, or
transporter, then `socket.join("tracking:" + shipmentId)`. Optionally emit the
current `current_location` / progress immediately so the joiner isn't blank
until the next push.

#### `tracking:leave` (client → server)
```json
{ "shipmentId": "69b8a2cd51dfd9e32ea1214a" }
```
**Server action:** `socket.leave("tracking:" + shipmentId)`.

#### `driver:location_push` (driver → server)
Emitted by the driver app **every 7 seconds** while the trip is not completed:
```json
{
  "shipmentId": "69b8a2cd51dfd9e32ea1214a",
  "latitude": 23.8150,
  "longitude": 90.4200,
  "timestamp": 1718409600000
}
```
**Server action (the core of the feature):**
1. Verify the sender is the **assigned driver** of this shipment and the
   shipment is `IN_TRANSIT`. Ignore pushes otherwise (e.g. before Start Ride or
   after COMPLETED).
2. Update `current_location` with `[longitude, latitude]`.
3. Append `[longitude, latitude]` to `location_history.coordinates`.
   - Optionally de-noise: skip points that are an implausible jump from the
     previous one (the app already discards jumps > 200 km, but server-side
     validation is good defence).
4. Broadcast `driver:location_update` to the room (below).
5. Recompute progress and broadcast `shipment:progress_update` (below).

> **Note on the `timestamp`:** it's epoch milliseconds from the device clock.
> Use your own server time for ordering if you don't trust device clocks.

#### `driver:location_update` (server → room)
Re-broadcast of the driver position to **everyone in the room** (this is how the
shipper/transporter get the live truck):
```json
{
  "shipmentId": "69b8a2cd51dfd9e32ea1214a",
  "latitude": 23.8150,
  "longitude": 90.4200
}
```
The app filters by `shipmentId`, so always include it. Note this payload is
**flat lat/lng** (not GeoJSON) — keep it exactly as shown.

#### `shipment:progress_update` (server → room)
Sent after each location update so the bottom card shows distance/percent/ETA:
```json
{
  "shipmentId": "69b8a2cd51dfd9e32ea1214a",
  "distanceCovered": 12.4,
  "totalDistance": 48.0,
  "progressPercent": 26,
  "eta": "35 min"
}
```
Field meanings:
- `distanceCovered` — km driven so far (number, may be `0`).
- `totalDistance` — total planned km, or `null` if you can't compute it. The app
  renders an indeterminate bar when this is `null`.
- `progressPercent` — integer 0–100. `100` makes the app show "arrived".
- `eta` — human string shown verbatim, e.g. `"35 min"`, `"Arriving"`, `"N/A"`.
  The app treats `"Arriving"` specially ("almost there") and hides the ETA row
  when it's `""` or `"N/A"`.

**How to compute progress (suggested):**
- `totalDistance` = road distance pickup → delivery. Compute once at ride start
  (e.g. OSRM `router.project-osrm.org`, which the app already uses for routing,
  or any routing service) and cache it on the shipment.
- `distanceCovered` = cumulative distance along `location_history` (sum of
  haversine between consecutive points), or remaining-distance subtracted from
  total — your choice, just keep it monotonic and sane.
- `progressPercent` = `round(distanceCovered / totalDistance * 100)`, clamped to
  0–100.
- `eta` = `remainingDistance / assumedSpeed`, formatted as minutes/hours.

If progress computation is too much for v1, you may emit only
`driver:location_update` and send `shipment:progress_update` with
`totalDistance: null`, `distanceCovered: 0`, `progressPercent: 0`, `eta: ""` —
the live truck still works; the card just won't show progress.

---

## 6. REST contract

### 6.1 `GET /map/shipment/:shipmentId/location`
Returns the **last known position and the driven history** so a viewer who opens
the screen sees the trail immediately (before the next socket push). Called by
the app on screen mount.

**Response shape (the app reads `res.data.data`):**
```json
{
  "success": true,
  "data": {
    "current_location": {
      "type": "Point",
      "coordinates": [90.4200, 23.8150]
    },
    "location_history": {
      "type": "LineString",
      "coordinates": [
        [90.4125, 23.8103],
        [90.4160, 23.8120],
        [90.4200, 23.8150]
      ]
    }
  }
}
```
- Coordinates are GeoJSON `[lng, lat]` (the app swaps them back).
- If the ride is **not** `IN_TRANSIT` (e.g. PENDING/IN_PROGRESS/COMPLETED),
  return **empty** `location_history.coordinates: []` (and a null/absent
  `current_location`). This is what makes the path **disappear after
  completion** — see §7.
- Authorize: only the shipment's driver/shipper/transporter may call it.

### 6.2 `PATCH /shipment/:shipmentId/status` (already exists)
Body:
```json
{ "status": "IN_TRANSIT" }
```
Used by the driver app for **Start Ride** (`IN_TRANSIT`) and **Complete**
(`COMPLETED`). You must add the business rules in §7 to this handler.

### 6.3 `POST /shipment` — accept the EXACT picked pin (action required) ⚠️

**Problem this fixes:** the shipper picks pickup/delivery pins on a map, but the
stored location is inaccurate (off by 100–1000 m). Cause: the mobile create
request is `multipart/form-data`, where every field arrives as a **string**, so a
nested GeoJSON object can't be sent. The exact coordinate was therefore being
dropped and the server re-geocoded the address text (returns a place *centroid*,
not the pin). Sending a stringified GeoJSON instead crashed the server with
`500 "undefined is not iterable"` (because `haversineKm` reads `.coordinates` off
the string).

**The agreed solution (Option B): flat numeric fields.**

The mobile app **now sends** the exact pin as flat fields alongside the addresses
(only when a pin was dropped):

```
pickup_lat    = "23.78061"      delivery_lat = "22.35690"
pickup_lng    = "90.40741"      delivery_lng = "91.78320"
```

(These are strings, because multipart. Web continues to send a real
`pickup_location` / `delivery_location` GeoJSON object — keep supporting that.)

**What you must implement in `createShipment`** — resolve coordinates in this
priority order: **flat fields → GeoJSON object (web) → geocode the address**.
Replace the current coord-resolution block:

```ts
// helper: build a GeoJSON Point [lng, lat] from flat lat/lng strings/numbers
const toPoint = (lat?: any, lng?: any) => {
  const la = parseFloat(lat), ln = parseFloat(lng);
  if (Number.isFinite(la) && Number.isFinite(ln) && !(la === 0 && ln === 0)) {
    return { type: "Point" as const, coordinates: [ln, la] as [number, number] };
  }
  return undefined;
};

const pickup_location =
  toPoint(payload.pickup_lat, payload.pickup_lng) ??   // 1. exact mobile pin
  payload.pickup_location ??                           // 2. web GeoJSON object
  (await geocodeAddress(payload.pickup_address)) ??    // 3. fallback geocode
  undefined;

const delivery_location =
  toPoint(payload.delivery_lat, payload.delivery_lng) ??
  payload.delivery_location ??
  (await geocodeAddress(payload.delivery_address)) ??
  undefined;
```

Then **strip the flat fields before `Shipment.create`** so they aren't persisted
as stray document fields (e.g. destructure `pickup_lat, pickup_lng, delivery_lat,
delivery_lng` out of the payload, or omit them when building `shipmentPayload`).

**Also harden `haversineKm`** (defensive — so a bad/missing coord can never 500
the create again):

```ts
export const haversineKm = (a: IGeoPoint, b: IGeoPoint): number => {
  if (!a?.coordinates || !b?.coordinates) return 0; // skip total_distance instead of crashing
  const [lng1, lat1] = a.coordinates;
  const [lng2, lat2] = b.coordinates;
  // ...unchanged...
};
```

**Result:** when a pin is dropped, `pickup_location` / `delivery_location` store
the **exact** coordinate; geocoding is used only when no pin was provided. The
`total_distance` seed keeps working because both points are valid GeoJSON.

**Acceptance check:** create a shipment from the mobile app with a pin, then read
it back — `pickup_location.coordinates` must equal the `[lng, lat]` of the pin
shown on the picker (to ~5 decimals), not a geocoded centroid.

---

## 7. Business rules you must enforce

These are **not** handled by the frontend — they are your responsibility.

### 7.1 One live ride per driver
When a driver tries to move a shipment to `IN_TRANSIT`:
- Check whether that **driver_id** already has **another** shipment with status
  `IN_TRANSIT`.
- If yes → reject with a clear error (e.g. `409 Conflict`,
  `"Driver already has an active ride"`). The app calls
  `updateShipmentStatus(id, 'IN_TRANSIT')` on Start Ride; a non-2xx response
  should surface as a failure.
- Only one shipment per driver may be `IN_TRANSIT` at any time.

### 7.2 Start of ride (`→ IN_TRANSIT`)
- Verify the requester is the **assigned driver**.
- (Recommended) Reset `location_history.coordinates` to `[]` so the trail starts
  fresh from the pickup. The driver app also clears its local trail on Start
  Ride, so the server should agree.
- (Recommended) Compute and cache `totalDistance` (pickup → delivery) for
  progress.
- From now on, accept `driver:location_push` for this shipment.

### 7.3 During ride (`IN_TRANSIT`)
- Accept location pushes only from the assigned driver.
- Append to `location_history`, update `current_location`, broadcast updates.

### 7.4 End of ride (`→ COMPLETED`) — **make the path disappear**
- Verify the requester is the assigned driver.
- Stop accepting `driver:location_push` for this shipment (ignore late pushes).
- **Clear the path** so it vanishes for everyone:
  - Set `location_history.coordinates = []` (and clear/freeze
    `current_location`), **or**
  - Make `GET /map/shipment/:id/location` return empty history when status is
    `COMPLETED`.
  - Either approach works because the app shows the trail only from this data.
- Optionally emit a final `shipment:progress_update` with `progressPercent: 100`
  before clearing.

### 7.5 Authorization (all of the above)
- Every join, push, and REST call must verify the user is one of the shipment's
  `driver_id` / `shipper_id` / `transporter_id`.
- Only the **driver** may push location or change status.

---

## 8. End-to-end sequence

```
DRIVER app                         SERVER                       SHIPPER/TRANSPORTER app
----------                         ------                       -----------------------
PATCH /shipment/:id/status         enforce "one live ride";
  { status: IN_TRANSIT }    ─────► reset history; cache total
                                   distance; status=IN_TRANSIT
                            ◄─────  200 OK

socket: tracking:join {id}  ─────► join room  ◄───── socket: tracking:join {id}
                                                       (gets planned route from
                                                        pickup_coord/delivery_coord)

[every 7s]
socket: driver:location_push ────► validate driver + IN_TRANSIT;
  {id, lat, lng, ts}               append to history;
                                   update current_location;
                                   compute progress
                                   │
                                   ├─► driver:location_update ──► (truck moves on map)
                                   │     {id, lat, lng}            (trail extends)
                                   └─► shipment:progress_update ─► (card updates)
                                         {id, distanceCovered,…}

PATCH /shipment/:id/status         status=COMPLETED;
  { status: COMPLETED }     ─────► clear location_history;
                                   stop accepting pushes
                            ◄─────  200 OK
GET .../location (on reopen) ────► returns empty history ──────► path gone from map
```

---

## 9. Current frontend status (audit) — what is and isn't wired

I checked the app before writing this. Summary so you know what to expect:

**✅ Driver side — fully implemented** (`LiveTrackingScreen.tsx`):
- Pushes GPS every 7s via `driver:location_push`.
- Joins/leaves the tracking room.
- Listens for `driver:location_update` and `shipment:progress_update`.
- Reads `GET /map/shipment/:id/location` on mount.
- Calls `PATCH /shipment/:id/status` for Start Ride (`IN_TRANSIT`) and Complete
  (`COMPLETED`).
- Note: "heading to pickup" vs "ride started" is currently a **local** phase in
  the app; the only thing the backend learns is the status change to
  `IN_TRANSIT`. The "one live ride" rule must therefore be enforced server-side
  on that status change (§7.1).

**✅ Shipper / Transporter side — now implemented (read-only live view)**
(`ShipmentMapRoute.tsx`, used by `ShipmentTrackingScreen`,
`ShipmentDetails.screen`, `ActiveShipmentDetail`, `ActiveShipmentDetailsScreen` —
all four call sites pass `live`):
- Prefers backend coordinates and geocodes addresses only as a fallback.
- When the shipment is `IN_TRANSIT` it calls `GET /map/shipment/:id/location` to
  seed the truck + trail, joins the tracking room (`tracking:join`), and listens
  for `driver:location_update` to move the truck and extend the driven trail.
- It is **read-only**: it never emits `driver:location_push` and never changes
  status. The trail clears when the shipment is no longer `IN_TRANSIT`.
- **This means the frontend already speaks the contract in this document.** Build
  the backend to §1–§8 and the shipper/transporter live view works with no
  further frontend changes. Until the endpoints exist, the REST call fails
  silently and the map just shows the static planned route.

**❗ Important data dependency:** several maps still geocode free-text addresses
because pickup/delivery coordinates are not stored on the backend. Please store
`pickup_coord` / `delivery_coord` (§4) at shipment creation — once present, all
maps render reliably and the "planned route before ride starts" works without
geocoding guesswork.

---

## 10. Frontend implementation (shipper / transporter live view) — ✅ DONE

> **Status: already implemented in the app.** This section documents how the
> shipper/transporter live view was built and what it expects from you. It
> consumes the **same** backend contract defined above — **no extra backend work
> is needed beyond §1–§8.** It is kept here so you understand the client side; you
> do not need to change any of it.

### 10.1 What changes

Today the shipper/transporter map (`src/presentation/transporter/components/ShipmentMapRoute.tsx`)
is **static**: it geocodes the pickup/delivery addresses and draws a route. We
will turn it into a **live, read-only** version of the driver's tracking screen —
it shows the planned route before the ride, then switches to the live truck +
driven trail once the shipment is `IN_TRANSIT`, and clears the trail on
`COMPLETED`.

The driver screen (`LiveTrackingScreen.tsx`) is the reference implementation;
the shipper/transporter view reuses the same socket events and REST call but
**never emits location** and has **no Start Ride / Complete buttons**.

### 10.2 Props change for `ShipmentMapRoute`

Add the inputs the live logic needs. Current props are address-only:

```ts
// BEFORE
type Props = {
  pickupAddress: string;
  deliveryAddress: string;
  status: string;
  fullscreen?: boolean;
  showBadge?: boolean;
};

// AFTER
type Props = {
  shipmentId: string;                 // NEW — needed to join the room + REST call
  pickupAddress: string;
  deliveryAddress: string;
  pickupCoord?: { latitude: number; longitude: number };   // NEW — prefer over geocoding
  deliveryCoord?: { latitude: number; longitude: number }; // NEW
  status: string;                     // drives live vs static rendering
  live?: boolean;                     // NEW — opt-in so static call sites are unaffected
  fullscreen?: boolean;
  showBadge?: boolean;
};
```

Every call site (`ShipmentTrackingScreen`, `ShipmentDetails.screen`,
`ActiveShipmentDetail`, `ActiveShipmentDetailsScreen`) must pass `shipmentId`
and, where available, the new coordinates. Pass `live` where a live truck is
wanted (the shipment tracking screens).

### 10.3 Behaviour by status (read-only)

| Shipment status | What the shipper/transporter map shows |
|---|---|
| `PENDING` / `IN_PROGRESS` | Planned route (pickup → delivery), **no truck** |
| `IN_TRANSIT` | Planned route + **live truck** + **driven trail** |
| `COMPLETED` | Static info only — **trail cleared**, no truck |

### 10.4 Implementation steps (mirror the driver screen, minus emitting)

1. **Resolve coordinates** — prefer `pickupCoord` / `deliveryCoord` props;
   geocode the address strings only as a fallback (copy the driver screen's
   "Effect 1", including the "location unavailable" state). Stop geocoding when
   coords are present.
2. **Planned route** — fetch the OSRM route between pickup and delivery (reuse
   `fetchRoute` from the driver screen) and draw it. This is visible in every
   status.
3. **Initial position + history (REST)** — on mount, call
   `GET /map/shipment/:shipmentId/location` and seed the truck marker from
   `current_location` and the trail from `location_history`
   (GeoJSON `[lng, lat]` → swap to `{latitude, longitude}`). Backend returns
   empty history unless `IN_TRANSIT`, so this naturally shows nothing pre-ride
   and post-completion.
4. **Socket subscription (live)** — only when `live` and status is `IN_TRANSIT`:
   - `connectSocket()` then `socket.emit('tracking:join', { shipmentId })`.
   - Listen for `driver:location_update` `{ shipmentId, latitude, longitude }` —
     filter by `shipmentId`, move the truck marker, and append to the trail.
   - Listen for `shipment:progress_update` for the progress card (optional for
     v1; the shipper view can show distance/percent/ETA just like the driver).
   - **Do NOT** emit `driver:location_push` and **do NOT** call
     `updateShipmentStatus` — this view is read-only.
   - On unmount: `socket.emit('tracking:leave', { shipmentId })` and remove the
     listeners using the **same function references** (see the driver screen's
     cleanup — `socket.off(event, handler)`, not `socket.off(event)`, otherwise
     you tear down listeners registered elsewhere).
5. **Clear on completion** — when status flips to `COMPLETED`, drop the truck
   marker and the trail (the REST endpoint already returns empty history, so a
   refetch/handling the status is enough).

### 10.5 Reuse / don't duplicate

- Lift the shared helpers from `LiveTrackingScreen.tsx` — `decodePolyline`,
  `fetchRoute`, `fromGeoJson`, `isValidCoord`, `haversineKm`, `sanitizePath`,
  `pushPoint` — into a shared module (e.g. `src/shared/utils/tracking.ts`) and
  import them in both the driver screen and `ShipmentMapRoute`, rather than
  copy-pasting. Several already overlap with `src/shared/utils/map.ts` and
  `src/shared/utils/geocode.ts`.
- Socket event names come from `src/domain/constants/socketEvents.ts` — never
  hardcode the strings.

### 10.6 Frontend checklist (all ✅ done)

- [x] Extend `ShipmentMapRoute` props (`shipmentId`, coords, `live`).
- [x] Prefer backend coords; geocode only as fallback.
- [x] Draw planned route (OSRM) in all statuses.
- [x] Seed truck + trail from `GET /map/shipment/:id/location` on mount.
- [x] When `live` && `IN_TRANSIT`: join room, listen for
      `driver:location_update`, move truck, extend trail. **Never emit.**
- [x] Clean up listeners + leave room on unmount (matched handler references).
- [x] Clear truck + trail when status leaves `IN_TRANSIT` (e.g. `COMPLETED`).
- [x] Update all four call sites to pass `shipmentId` + `live`.
- [x] Extract shared tracking helpers (`src/shared/utils/tracking.ts`) shared by
      the driver screen and this view.

> **Remaining frontend nicety (optional, needs backend first):** the
> `pickupCoord` / `deliveryCoord` props are wired but call sites don't pass them
> yet, so the planned route still geocodes addresses. Once you store and return
> `pickup_coord` / `delivery_coord` (§4), threading them through the shipment
> mapper drops geocoding entirely. `shipment:progress_update` is also not yet
> consumed by this read-only view (distance/percent/ETA card) — easy to add later.

---

## 11. Backend implementation checklist

- [ ] Socket auth: verify JWT from `handshake.auth.token`; attach user+role.
- [ ] Room handlers: `tracking:join` / `tracking:leave` (with authorization).
- [ ] `driver:location_push` handler: validate driver + `IN_TRANSIT`, persist
      `current_location` + append to `location_history`.
- [ ] Broadcast `driver:location_update` to the room (flat lat/lng).
- [ ] Compute + broadcast `shipment:progress_update` (or send the null/zero
      variant for v1).
- [ ] `GET /map/shipment/:id/location` returning GeoJSON; empty history unless
      `IN_TRANSIT`.
- [ ] `PATCH /shipment/:id/status`: enforce **one live ride per driver** on
      `→ IN_TRANSIT`; reset history at ride start.
- [ ] On `→ COMPLETED`: clear `location_history`, stop accepting pushes.
- [ ] Store `pickup_coord` / `delivery_coord` at shipment creation.
- [ ] **(§6.3) `createShipment`: accept flat `pickup_lat/lng` + `delivery_lat/lng`
      from the mobile app (priority: flat fields → GeoJSON object → geocode);
      strip the flat fields before save; harden `haversineKm` against missing
      coordinates.** ← fixes inaccurate pinned location.
- [ ] Authorize every operation to the shipment's driver/shipper/transporter.

---

## 12. Quick reference — payload cheat sheet

```jsonc
// CLIENT → SERVER
"tracking:join"          { "shipmentId": "…" }
"tracking:leave"         { "shipmentId": "…" }
"driver:location_push"   { "shipmentId": "…", "latitude": 23.8, "longitude": 90.4, "timestamp": 1718409600000 }

// SERVER → ROOM
"driver:location_update"     { "shipmentId": "…", "latitude": 23.8, "longitude": 90.4 }
"shipment:progress_update"   { "shipmentId": "…", "distanceCovered": 12.4, "totalDistance": 48.0, "progressPercent": 26, "eta": "35 min" }

// REST
GET   /map/shipment/:shipmentId/location
        → { "data": { "current_location": { "type":"Point", "coordinates":[lng,lat] },
                       "location_history": { "type":"LineString", "coordinates":[[lng,lat], …] } } }
PATCH /shipment/:shipmentId/status   body: { "status": "IN_TRANSIT" | "COMPLETED" }
```

> ⚠️ **Coordinate order:** REST/stored data is GeoJSON `[longitude, latitude]`.
> The two live socket payloads use **flat `latitude` / `longitude` fields**. Don't
> mix them up.
