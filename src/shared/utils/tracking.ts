import axios from 'axios';
import { Coord } from './geocode';

// Shared live-tracking geometry helpers, used by both the driver tracking screen
// (LiveTrackingScreen) and the read-only shipper/transporter map (ShipmentMapRoute).
// Keep these in one place so the two views can never drift apart.

export type { Coord };

// Decode a Google/OSRM encoded polyline (precision 5) into coordinates.
export function decodePolyline(encoded: string): Coord[] {
  const coords: Coord[] = [];
  let index = 0, lat = 0, lng = 0;
  while (index < encoded.length) {
    let shift = 0, result = 0, byte: number;
    do { byte = encoded.charCodeAt(index++) - 63; result |= (byte & 0x1f) << shift; shift += 5; } while (byte >= 0x20);
    lat += (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    shift = 0; result = 0;
    do { byte = encoded.charCodeAt(index++) - 63; result |= (byte & 0x1f) << shift; shift += 5; } while (byte >= 0x20);
    lng += (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    coords.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
  }
  return coords;
}

// Fetch a road-aligned route between two points via OSRM (free, no key/billing).
// OSRM returns an encoded polyline (precision 5, same as Google) that follows the
// road network. Falls back to a straight segment only if the request fails.
export async function fetchRoute(origin: Coord, dest: Coord): Promise<Coord[]> {
  try {
    const coords = `${origin.longitude},${origin.latitude};${dest.longitude},${dest.latitude}`;
    const res = await axios.get(
      `https://router.project-osrm.org/route/v1/driving/${coords}`,
      { params: { overview: 'full', geometries: 'polyline' } },
    );
    if (res.data?.code === 'Ok' && res.data.routes?.length > 0) {
      const pts = decodePolyline(res.data.routes[0].geometry);
      if (pts.length > 1) return pts;
    }
  } catch {
    // fall through to straight-line fallback
  }
  return [origin, dest];
}

// GeoJSON stores [longitude, latitude] — swap for react-native-maps.
export function fromGeoJson([lng, lat]: number[]): Coord {
  return { latitude: lat, longitude: lng };
}

// A coordinate is only usable if it is finite, within valid lat/lng ranges and
// not the null-island (0,0) placeholder.
export function isValidCoord(c?: Coord | null): c is Coord {
  return (
    !!c &&
    Number.isFinite(c.latitude) && Number.isFinite(c.longitude) &&
    Math.abs(c.latitude) <= 90 && Math.abs(c.longitude) <= 180 &&
    !(c.latitude === 0 && c.longitude === 0)
  );
}

// Great-circle distance in km between two coordinates.
export function haversineKm(a: Coord, b: Coord): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLng = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude), lat2 = toRad(b.latitude);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// Largest jump between consecutive driven-path points before we treat it as a
// bad GPS reading / stale data point (km).
export const MAX_JUMP_KM = 200;

// Drop invalid points, then anchor to the most recent point and keep only the
// recent run whose consecutive gaps are plausible — this strips out stale
// garbage history (e.g. a default California coordinate left over from testing).
export function sanitizePath(points: Coord[]): Coord[] {
  const valid = points.filter(isValidCoord);
  if (valid.length <= 1) return valid;
  const out: Coord[] = [valid[valid.length - 1]];
  for (let i = valid.length - 2; i >= 0; i--) {
    if (haversineKm(valid[i], out[0]) <= MAX_JUMP_KM) out.unshift(valid[i]);
    else break;
  }
  return out;
}

// Append a new live point only if it is valid and not an implausible jump from
// the last one — keeps the driven path clean as updates stream in.
export function pushPoint(prev: Coord[], next: Coord): Coord[] {
  if (!isValidCoord(next)) return prev;
  const last = prev[prev.length - 1];
  if (last && haversineKm(last, next) > MAX_JUMP_KM) return prev;
  return [...prev, next];
}
