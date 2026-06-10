# Backend Integration Report — Shipment Tracking (Driver App)

**Audience:** Backend developer
**Goal:** Align the backend with what the mobile app already expects, fix the "wrong pickup location" bug, and add the missing start/finish status transitions.

---

## 1. The bug we are fixing first: wrong pickup location on the map

When a driver opens a shipment and taps **Start Shipment**, the live map shows the pickup pin in the **wrong place** (it always lands near Abidjan: `lat 5.36, lng -4.0`).

**Root cause:** the shipment payload from the API contains the pickup/delivery **address text only — no coordinates.** The app then tries to geocode the address string, and when that fails it falls back to a hardcoded default coordinate (Abidjan). That default is what you see.

**What the app needs:** every shipment must include **pickup and delivery coordinates**. Address strings are not enough for an accurate map pin.

### Required new fields on the shipment object

Please add coordinates to each shipment returned by the API. **Preferred format = GeoJSON Point** (matches what the tracking endpoint already uses):

```jsonc
{
  "_id": "...",
  "pickup_address": "Rue 14.12, Zone 4, Abidjan",
  "pickup_location": {                 // ← NEW (GeoJSON, [lng, lat])
    "type": "Point",
    "coordinates": [-4.0267, 5.3364]
  },
  "delivery_address": "Ave. Nelson Mandela, Ouagadougou",
  "delivery_location": {               // ← NEW (GeoJSON, [lng, lat])
    "type": "Point",
    "coordinates": [-1.5197, 12.3714]
  }
}
```

> ⚠️ **GeoJSON order is `[longitude, latitude]`** — not `[lat, lng]`. The app already decodes GeoJSON this way for the live-location endpoint, so keep it consistent.

These coordinates should be captured **at shipment creation time** (geocode the address on the server, or have the shipper drop a pin) and stored on the shipment document, so they are stable and accurate rather than re-geocoded on every app open.

---

## 2. Current API contract the app already depends on

### 2.1 Get shipments for a driver
```
GET /shipment/driver/:driverId
```
Response shape the app reads:
```jsonc
{
  "data": {
    "shipments": [ /* array of shipment objects */ ]
  }
}
```

Fields the app currently maps from each shipment (snake_case → keep these names):

| Backend field          | Used for                    | Notes |
|------------------------|-----------------------------|-------|
| `_id`                  | shipment id                 | |
| `shipment_title`       | title                       | |
| `pickup_address`       | pickup address text         | |
| `delivery_address`     | delivery address text       | |
| `status`               | status badge / logic        | see §4 for required values |
| `driver_id`            | assignment                  | |
| `transporter_id`       | assignment                  | |
| `shipment_images[]`    | images                      | array of URLs |
| `price`                | price                       | |
| `category`             | commodity                   | |
| `discription`          | description                 | **typo exists today** — see §5 |
| `weight`               | weight                      | |
| `dimensions`           | dimensions                  | |
| `type_of_packaging`    | packaging                   | |
| `time_window`          | time window                 | |
| `contact_person`       | contact person              | |
| `pickup_location`      | **map pin (NEW — §1)**      | GeoJSON Point |
| `delivery_location`    | **map pin (NEW — §1)**      | GeoJSON Point |

### 2.2 Live location for a shipment (already consumed by the app)
```
GET /map/shipment/:id/location
```
Response shape the app reads:
```jsonc
{
  "data": {
    "current_location":  { "coordinates": [lng, lat] },        // last known truck position
    "location_history":  { "coordinates": [[lng, lat], ...] }  // driven path
  }
}
```
This is working — listed here so it stays consistent with the new `pickup_location`/`delivery_location` format.

---

## 3. Live tracking — Socket.IO contract

Transport: **Socket.IO over WebSocket.** Auth is sent in the handshake:
```js
io(SOCKET_URL, { auth: { token: <accessToken> }, transports: ["websocket"] })
```

### Events the app EMITS (server must handle)
| Event                    | Payload                                                       | When |
|--------------------------|--------------------------------------------------------------|------|
| `tracking:join`          | `{ shipmentId }`                                              | screen open — join the shipment room |
| `tracking:leave`         | `{ shipmentId }`                                              | screen close |
| `driver:location_push`   | `{ shipmentId, latitude, longitude, timestamp }`             | every ~7s while trip is live |

### Events the app LISTENS for (server must broadcast)
| Event                       | Payload                                                                              | Purpose |
|-----------------------------|--------------------------------------------------------------------------------------|---------|
| `driver:location_update`    | `{ shipmentId, latitude, longitude }`                                                | relay driver position to viewers (transporter/shipper) |
| `shipment:progress_update`  | `{ shipmentId, distanceCovered, totalDistance, progressPercent, eta }`               | progress bar + ETA |

**Server responsibilities:**
- On `driver:location_push`: persist the point to `location_history`, update `current_location`, and **re-broadcast** as `driver:location_update` to everyone in that shipment room.
- Compute and emit `shipment:progress_update` (distance covered along route, total route distance, percent, ETA string). The app currently shows `--` / hides ETA until this arrives, so it degrades gracefully — but this is where the real numbers come from.

> Note: `latitude`/`longitude` here are plain numbers (not GeoJSON arrays). Only the REST `/map/.../location` payload and the new shipment coords use GeoJSON `[lng, lat]`.

---

## 4. Start & Finish flow — **currently missing on the backend**

Right now the app drives the trip **entirely client-side** and never tells the backend the status changed:

- **"Start Shipment"** → only navigates to the tracking screen.
- **"Start Ride"** (after reaching pickup) → only a local phase switch.
- **"Arrival at Destination" / finish** → only navigates back.

This means the backend status never advances, and other parties (shipper/transporter) don't see the trip start or complete. We need backend endpoints so the app can record these transitions.

### Required status-transition endpoints

```
PATCH /shipment/:id/status
Body: { "status": "IN_TRANSIT" }     // when the ride actually starts (driver left pickup)
Body: { "status": "COMPLETED" }      // when the driver confirms arrival/delivery
```
(Or dedicated routes if you prefer: `POST /shipment/:id/start`, `POST /shipment/:id/complete`.)

**Status values the app uses today (keep these exact strings):**
`PENDING`, `IN_PROGRESS`, `IN_TRANSIT`, `COMPLETED`.

Suggested lifecycle:
1. `PENDING` → shipment assigned, not started.
2. `IN_TRANSIT` → driver tapped **Start Ride** at pickup. (App should call the status endpoint here.)
3. `COMPLETED` → driver confirmed delivery. (App should call the status endpoint here, and the server can stop expecting location pushes.)

On `COMPLETED`, the server should also emit a final `shipment:progress_update` with `progressPercent: 100` so all viewers see the trip finish.

---

## 5. Small cleanups worth doing

- **`discription` typo:** the description field is spelled `discription` in the payload. Recommend adding `description` (correct spelling) while keeping `discription` temporarily for backward-compat, then deprecating the misspelled one.
- **Price range:** the app has `priceMin`/`priceMax` but the API sends a single `price`. If a range is ever needed, expose `price_min`/`price_max`; otherwise the single `price` is fine.

---

## 6. Acceptance checklist for the backend dev

- [ ] Shipment objects from `GET /shipment/driver/:driverId` include `pickup_location` and `delivery_location` as GeoJSON `[lng, lat]`.
- [ ] Those coordinates are stored at creation time (server-side geocode or shipper pin), not random/empty.
- [ ] `PATCH /shipment/:id/status` (or start/complete routes) accepts `IN_TRANSIT` and `COMPLETED`.
- [ ] Socket: `driver:location_push` is persisted and re-broadcast as `driver:location_update`.
- [ ] Socket: server emits `shipment:progress_update` with real distance/percent/eta.
- [ ] Status strings exactly match: `PENDING` / `IN_PROGRESS` / `IN_TRANSIT` / `COMPLETED`.
- [ ] GeoJSON coordinate order is `[longitude, latitude]` everywhere.
