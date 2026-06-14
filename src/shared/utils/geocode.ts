import axios from 'axios';

export type Coord = { latitude: number; longitude: number };

const NOMINATIM = 'https://nominatim.openstreetmap.org';

// Nominatim's public usage policy allows at most 1 request/second. We space
// calls a little wider than that to stay safely under the limit and avoid the
// Varnish "429 Too many requests" response.
const MIN_INTERVAL_MS = 1200;

// Cache resolved AND unresolved lookups, keyed by the normalized address.
// A cached `null` means "Nominatim has no result for this string" (e.g. an
// informal POI or placeholder/seed text) — caching it stops us from hammering
// the API with the same hopeless query on every render.
const cache = new Map<string, Coord | null>();

// De-dupe concurrent lookups of the same address into a single request.
const inflight = new Map<string, Promise<Coord | null>>();

// Single serialized queue: every Nominatim call waits its turn and is spaced
// at least MIN_INTERVAL_MS from the previous one, so parallel callers (pickup +
// delivery, multiple maps mounting at once) can never burst past the limit.
let chain: Promise<void> = Promise.resolve();
let lastCallAt = 0;

function schedule<T>(task: () => Promise<T>): Promise<T> {
  const run = chain.then(async () => {
    const wait = lastCallAt + MIN_INTERVAL_MS - Date.now();
    if (wait > 0) await new Promise((r) => setTimeout(r, wait));
    lastCallAt = Date.now();
    return task();
  });
  // Keep the chain alive even if an individual task rejects.
  chain = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

/**
 * Geocode a free-text address to coordinates via OpenStreetMap Nominatim.
 * Cached + globally rate-limited. Returns `null` when there is no match.
 *
 * Note: Nominatim cannot resolve informal POI names. For reliable pins the
 * coordinate should be stored on the backend at shipment creation (map-pin
 * flow); this is a best-effort fallback only.
 */
export async function geocodeAddress(
  address?: string | null,
): Promise<Coord | null> {
  const key = (address ?? '').trim().toLowerCase();
  if (!key) return null;

  if (cache.has(key)) return cache.get(key)!;
  if (inflight.has(key)) return inflight.get(key)!;

  const p = schedule(async () => {
    try {
      const res = await axios.get(`${NOMINATIM}/search`, {
        params: { format: 'json', limit: 1, q: address },
        headers: { 'User-Agent': 'LawapanTruck/1.0 (freight-app)' },
        timeout: 15000,
      });
      const hit = res.data?.[0];
      const coord: Coord | null =
        hit?.lat && hit?.lon
          ? { latitude: parseFloat(hit.lat), longitude: parseFloat(hit.lon) }
          : null;
      // Cache both hits and confirmed "no result" responses.
      cache.set(key, coord);
      return coord;
    } catch {
      // Transient failures (e.g. 429/timeouts) are NOT cached, so a later
      // attempt can still succeed.
      return null;
    } finally {
      inflight.delete(key);
    }
  });

  inflight.set(key, p);
  return p;
}

export type Suggestion = { label: string; latitude: number; longitude: number };

const searchCache = new Map<string, Suggestion[]>();

/**
 * Free-text place search (up to 5 matches) via Nominatim. Cached + globally
 * rate-limited through the same queue as `geocodeAddress`.
 */
export async function searchPlaces(q: string): Promise<Suggestion[]> {
  const key = (q ?? '').trim().toLowerCase();
  if (key.length < 3) return [];
  if (searchCache.has(key)) return searchCache.get(key)!;

  return schedule(async () => {
    try {
      const res = await axios.get(`${NOMINATIM}/search`, {
        params: { format: 'json', limit: 5, q },
        headers: { 'User-Agent': 'LawapanTruck/1.0 (freight-app)' },
        timeout: 15000,
      });
      const out: Suggestion[] = (res.data || [])
        .filter((r: any) => r?.lat && r?.lon)
        .map((r: any) => ({
          label: r.display_name as string,
          latitude: parseFloat(r.lat),
          longitude: parseFloat(r.lon),
        }));
      searchCache.set(key, out);
      return out;
    } catch {
      return [];
    }
  });
}

/**
 * Reverse-geocode a coordinate back to a readable address (best-effort).
 * Rate-limited through the shared queue.
 */
export async function reverseGeocode(c: Coord): Promise<string | null> {
  return schedule(async () => {
    try {
      const res = await axios.get(`${NOMINATIM}/reverse`, {
        params: { format: 'json', lat: c.latitude, lon: c.longitude },
        headers: { 'User-Agent': 'LawapanTruck/1.0 (freight-app)' },
        timeout: 15000,
      });
      return (res.data?.display_name as string) ?? null;
    } catch {
      return null;
    }
  });
}
