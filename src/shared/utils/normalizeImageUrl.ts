const BASE_IMAGE_URL = "https://server.lawapantruck.com";

// Matches any localhost / 127.0.0.1 / 0.0.0.0 origin, with any protocol
// (http/https), optional port, and an optional trailing slash. The backend
// historically stored absolute upload URLs against a hardcoded
// `http://localhost:5000`, so older records still carry a localhost origin.
const LOCALHOST_ORIGIN = /^https?:\/\/(?:localhost|127\.0\.0\.1|0\.0\.0\.0)(?::\d+)?\/?/i;

/**
 * Normalizes an image/file URL coming from the backend.
 *
 * - Empty/missing → "".
 * - A localhost origin (any port/protocol) → swapped for the production host.
 * - An already-absolute production URL (https://server.lawapantruck.com/...) →
 *   returned unchanged.
 * - A relative path (/uploads/...) → prefixed with the production host.
 */
export const normalizeImageUrl = (url?: string): string => {
    if (!url) return "";

    const trimmed = url.trim();

    // Rewrite any localhost origin to the production host.
    if (LOCALHOST_ORIGIN.test(trimmed)) {
        return trimmed.replace(LOCALHOST_ORIGIN, `${BASE_IMAGE_URL}/`);
    }

    // Already absolute (e.g. https://server.lawapantruck.com/...) — leave as-is.
    if (/^https?:\/\//i.test(trimmed)) return trimmed;

    // Relative path — join to the production host, avoiding a double slash.
    return `${BASE_IMAGE_URL}/${trimmed.replace(/^\/+/, "")}`;
};
