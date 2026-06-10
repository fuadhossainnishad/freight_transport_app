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

## Styling

NativeWind v4 (Tailwind for React Native) is the primary styling approach. Some older screens still use `StyleSheet.create`. Tailwind config is in `tailwind.config.js`.
