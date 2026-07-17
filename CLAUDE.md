# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run android   # Build and run on Android (see Windows note below)
npm run ios       # Build and run on iOS
npm run start     # Start Metro bundler
npm run lint      # ESLint
npm run test      # Jest
```

**Windows MAX_PATH workaround:** The `android` script runs via `C:\p` (a junction to this repo root). If `npm run android` fails with path-too-long errors, ensure the junction exists: `cmd /c mklink /J C:\p "C:\Users\Mozammel\Desktop\Projects\freight_transport_app-master"`.

**Environment variables:** Managed by `react-native-config`. All variables must be in `.env` at the repo root. The three active vars are `BASE_URL`, `SOCKET_URL`, and `GOOGLE_MAPS_API_KEY`. After editing `.env` on Android, rebuild (Metro cache alone won't pick up changes).

## Architecture

The app follows a clean-architecture layering pattern inside `src/`:

| Layer | Path | Responsibility |
|---|---|---|
| Domain | `src/domain/` | Entities, use-case functions, API constants, pure types |
| Data | `src/data/` | Axios service calls, data mappers, socket management |
| Presentation | `src/presentation/` | Screens, per-feature hooks, feature-level components |
| Navigation | `src/navigation/` | All React Navigation stacks and tabs |
| Shared | `src/shared/` | Axios clients, AsyncStorage, reusable components/utils |
| App | `src/app/` | Root component, `AuthContext`, `UserContext` |

**Data flow:** Presentation hooks → domain use-cases → data services → Axios/socket → backend.  
**Mappers** (`src/data/mapper/`) convert raw API payloads to typed domain entities before they reach the presentation layer.

## Three User Roles

The app has three distinct roles, each with their own navigation root:

- **SHIPPER** → `ShipperRootStack` → profile-completion wizard (if incomplete) → `ShipperTab`
- **TRANSPORTER** → `TransporterRootStack` → profile-completion wizard (if incomplete) → `TransporterTab`
- **DRIVER** → `DriverStackStack` (no wizard; driver accounts are created by transporters)

Role routing happens in `src/navigation/AppStack.tsx` which reads `user.role` from `AuthContext`. `RootNavigation` gates the whole app on `isAuthenticated`.

## Authentication Flow

- Login stores `accessToken` + `refreshToken` in AsyncStorage (`src/shared/storage/authStorage.ts`).
- `axiosClient` (`src/shared/config/axios.config.ts`) automatically attaches the access token via a request interceptor.
- `publicAxios` (`src/shared/config/publicAxios.config.ts`) is used for unauthenticated endpoints (OTP, reset-password).
- `AuthContext` holds the decoded user object in memory. Calling `logout()` clears both the context state and AsyncStorage.
- `UserContext` is a secondary context that carries the role-specific user object (populated after login).

## Maps and Routing

- **Map rendering:** `react-native-maps` with `PROVIDER_GOOGLE` (requires the API key, but Google Maps billing is disabled on this project's account).
- **Geocoding:** OpenStreetMap Nominatim (free, no key). Used as fallback when pickup/delivery coordinates are not stored on the backend.
- **Route polylines:** OSRM public API (free, no key). Falls back to a straight-line segment on failure.
- Shipment coordinates should be stored by the backend at creation time (map-pin flow in `CreateShipmentScreen`). Nominatim is a last resort only—it cannot resolve informal POI names reliably.

## Real-Time (Socket.io)

- `src/data/socket/socketClient.ts` manages a singleton `socket.io-client` connection authenticated via the stored access token.
- `SocketManager` (`src/data/socket/socketManager.ts`) wraps `emit`/`on`/`off` with lazy connection setup.
- `bidSocketService.ts` provides join/leave/subscribe helpers for the bid room.
- `LiveTrackingScreen` connects directly to the socket for `DRIVER_LOCATION_UPDATE` and `SHIPMENT_PROGRESS_UPDATE` events. It also pushes the driver's GPS position every 7 seconds via `DRIVER_LOCATION_PUSH`. Socket event names are defined in `src/domain/constants/socketEvents.ts`.

## Forms and Validation

React Hook Form is used throughout. Schemas are defined with Yup or Zod (both are installed; Zod is preferred for newer screens). Resolvers from `@hookform/resolvers` connect schemas to RHF.

## Internationalization (English / French)

- Setup lives in `src/shared/i18n/`. `index.ts` initializes i18next; `locales/en.ts` and `locales/fr.ts` hold the strings (`.ts` on purpose — see below).
- **English is the source of truth.** `i18n.d.ts` types `t()` off `en.ts`, so a typo'd key fails `npx tsc --noEmit`. Add the key to `en.ts` first, then mirror it in `fr.ts`.
- Language resolution: a user's explicit choice (AsyncStorage key `appLanguage`) wins; otherwise `react-native-localize` picks from the device locale. `fr-CA`/`fr-FR` collapse to `fr`. Falls back to `en`.
- `RootApp` gates first render on `useI18nReady()` so the UI never flashes English before switching.
- Use `const { t } = useTranslation()` in components; `LanguageSwitcher` (mounted in `SettingsScreen`) changes language at runtime.
- **Never name an interpolation variable `count`** unless you intend pluralization. `count` is i18next's plural trigger; for a non-plural value use `{{min}}`, `{{length}}`, `{{value}}`, etc.
- **Plurals use the v3 `_plural` suffix, not `_one`/`_other`.** The app runs `compatibilityJSON: "v3"` because Hermes has no `Intl.PluralRules`. See `driver.home.activeDeliveries` for the pattern. Never hand-roll `count === 1 ? … : …` — French treats 0 as singular and English does not.
- **`src/shared/i18n/config.ts` holds the options shared by the app and the tests.** Import `I18N_BASE_OPTIONS` in any test that builds an i18next instance; never inline options, or the test config drifts from the device's (Node has `Intl.PluralRules`, Hermes does not).
- `__tests__/i18n.test.ts` enforces en/fr key parity and matching placeholders; `__tests__/i18n.runtime.test.ts` asserts every key resolves in both locales. Run `npx jest __tests__/i18n` after adding strings.
- **After converting a folder, run `node scripts/find-untranslated.js <folder>`** — do not trust a hand-written grep. Grepping for `<Text` and `Alert.alert` misses strings passed to state setters (`setLocationError('…')`, `setError('…')`), which render later and look nothing like copy at the call site. One shipped to a user that way. The script sweeps every literal *and* every JSX text node. It is deliberately noisy (className strings, format masks, dead files) — read each hit rather than narrowing the regex.
- When you add a `t()` call inside a `useEffect`/`useCallback`, **add `t` to the dependency array** or eslint's `exhaustive-deps` will fail.

### Locales are `.ts`, never `.json` — this is load-bearing

`locales/en.ts` and `locales/fr.ts` export plain default objects. They used to be `.json`, and **Metro served stale cached JSON modules while picking up `.ts` edits in the same folder**. The symptom is brutal to diagnose: a key you just added renders as raw text on device (`driver.tracking.pickupLocationMissing`) while its neighbours render fine, and every local check — `tsc`, `jest`, even a production bundle grep — passes, because they all read from disk. It cost multiple debugging rounds and reached the user twice. **Do not convert them back to `.json`.**

### Troubleshooting: raw keys on screen

If the UI renders a translation **key** instead of text, the console tells you which case you're in:

- `i18n: MISSING KEY "<key>" …` — that one key isn't in the loaded resources. A typo would have failed `npx tsc --noEmit`, so it's a staleness problem: fully reload the app (`R` twice in Metro), and if it persists `npx react-native start --reset-cache`.
- `i18n: initialised but resources are MISSING (canary …)` — **every** key is raw; the bundle has stale locale modules. Reset the cache.
- `i18n: init failed …` — init threw; the message names the cause.

Note that i18next snapshots the resources during `init()` and never re-reads the modules, so Fast Refresh alone does not pick up locale edits — `index.ts` re-injects the bundles via `module.hot` to cover this, but a full reload is the guaranteed fix.

`initI18n` is deliberately built so that **nothing optional can prevent the resources from loading**. Device-locale detection (`react-native-localize`) is a native call that can throw; it is wrapped and degrades to English. Never let locale detection, AsyncStorage, or anything else reject out of `initI18n` — a failure there costs every string in the app, not just the language choice. `__tests__/i18nInitResilience.test.ts` and `__tests__/i18nMissingKey.test.ts` pin this.

**Corollary for testing a translation change:** a passing `jest`/`tsc` run proves the keys exist, not that the running app has them. Always fully reload before judging what is on screen.

`initI18n` is deliberately built so that **nothing optional can prevent the resources from loading**. Device-locale detection (`react-native-localize`) is a native call that can throw; it is wrapped and degrades to English. Never let locale detection, AsyncStorage, or anything else reject out of `initI18n` — a failure there costs every string in the app, not just the language choice. `__tests__/i18nInitResilience.test.ts` pins this.

### The rule that matters most: never translate a value that goes to the backend

Several strings are *both* a UI label and an API payload. Translating them silently changes what is stored server-side. The pattern for these is a **value/label split** — `{ value: "TRUCK", labelKey: "truckTypes.truck" }` — where `value` keeps its existing English/enum form and only `labelKey` is translated. `TRUCK_TYPES` (`src/domain/constants/truckTypes.ts`) and `SETTINGS_MENU` (`settingsMenu.ts`) already follow this; type `labelKey` as i18next's `ParseKeys` so bad keys fail the build.

Known cases, all of which reach the backend via `Object.entries(data).forEach(...formData.append(...))` in `CreateShipmentScreen`:
- `CATEGORY_OPTIONS` / `PACKAGING_OPTIONS` — **done**. They now live in `src/domain/constants/shipmentOptions.ts` as `{ value, labelKey }`, with `src/shared/i18n/useShipmentOptions.ts` providing the translated lists, the value→label lookup for the read path (screens render `data.category` straight from the API), and a fallback so legacy values render raw instead of blank. `SelectField` takes an optional `formatValue`; `OptionSelectorModal` accepts `string | {value,label}` and **always emits the value**. The `value` strings are a data contract — existing rows depend on them.
- `VEHICLE_TYPES` (`Vehicle/components/VehicleForm.tsx`) — **still to do**; same shape, and it's compared for equality on the edit screen.
- `src/shared/utils/dateWireFormat.ts` — **already handled**: `DatePickerField` submits its formatted output as `date_preference`, so its month names stay English. `__tests__/datePickerWireFormat.test.ts` locks this. To localise the date display, emit the ISO string and format at render time.

Also: don't translate `COUNTRIES[].name` — `findCountryByName()` matches on it and it round-trips to the backend.

### Other gotchas

- **Don't pass display text as a navigation param.** It freezes at navigation time and won't re-translate on language switch. `Info.screen.tsx` derives its title from the `type` param instead.
- Same for state: store an index/id, not a translated label (see `StatCard`'s month picker).
- The brand name lives in `src/domain/constants/brand.ts` and is interpolated as `{{brand}}` so translators can't mangle it.
- Backend-supplied text (API error messages, FAQ content, invoice PDF) can't be translated client-side. Only the `||` fallback is fixable.

**Rollout status (batch 5 complete):** converted — i18n foundation, auth, earnings, the settings tree, both tab bars, `src/shared/components/*`, `SETTINGS_MENU`, `TRUCK_TYPES`, all live files under `driver/` and `shipper/`, `shipment/screens/MyShipments.screen.tsx`, `shipment/screens/ShipmentTrackingScreen.tsx`, and the live `invoice/` screens (`Invoices.screen.tsx`, `InvoiceDetails.screen.tsx`, `components/InvoiceTable.tsx`, `components/InvoiceItem.tsx`).

Still hardcoded English: `transporter/`, `Vehicle/`, `availablebids/`, `profile_completion/`, and the transporter-facing remainder of `shipment/` (`ActiveShipments.screen.tsx`, `ShipmentDetails.screen.tsx`, `components/*`) — roughly 275 strings.

**Dates:** use `useFormatDate()` (`src/shared/i18n/useFormatDate.ts`) for display dates. It is built on `useMonthNames()` and deliberately avoids `Intl.DateTimeFormat`, because Hermes ships a partial Intl (no `Intl.PluralRules`) and a Node-based test would never catch a device-only failure. Do not confuse it with `shared/utils/dateWireFormat.ts`, which stays English because its output is submitted to the API.

**Note on `src/presentation/shipment/`:** it is a *shared* feature folder, not shipper-only — `MyShipments`/`ShipmentTracking` are reached from `ShipperShipmentsStack`, while `ActiveShipments`/`ShipmentDetails` are reached from `ActiveShipmentsStack`, `TransporterHomeStack` and `InvoiceStack`. Don't assume a folder maps to one role; check the navigators.

Note ~26 files in those folders are unimported dead code (duplicate `CreateShipmentScreen`s, 8 copies of `useSignup`, a `screens copy/` folder) — check the import graph before translating. Known open items: the app mixes `$` and `€` and pins `Intl.NumberFormat` to `en-US`/USD in `src/shared/utils/price.ts` and `driver/helper/format-price.helper.ts` (needs a product decision, not an i18n fix); `driver/screens/LocationPermissionGate.screen.tsx` keeps a deliberate "Apprximate" typo in the English copy only.

## Styling

NativeWind v4 (Tailwind for React Native) is the primary styling approach. Some older screens still use `StyleSheet.create`. Tailwind config is in `tailwind.config.js`.
