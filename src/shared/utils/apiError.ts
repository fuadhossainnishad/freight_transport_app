// Reads a human-usable message out of a rejected API call.
//
// `axiosClient`'s response interceptor rejects a PLAIN OBJECT, not an
// AxiosError: { status, message, data, statusCode }. So `err.response.data.message`
// — the axios idiom — is always undefined here, and every call site that used it
// was silently falling through to its own fallback string.
//
// Worse, the backend's Zod failures set `message` to the generic "Validation
// Error" and put the useful text in `errorSources[0].message`:
//
//   { "message": "Validation Error",
//     "errorSources": [{ "path": "monthly_budget_for_shipment",
//                        "message": "Please select a valid monthly budget" }] }
//
// On a payment screen that means the user is told only "Validation Error".
// This resolves the specific field message first, and tolerates both the
// interceptor's shape and a raw AxiosError in case a caller bypasses it.

interface ErrorSource {
  path?: string;
  message?: string;
}

const readErrorSources = (payload: any): string | undefined => {
  const sources: ErrorSource[] | undefined = payload?.errorSources;
  if (!Array.isArray(sources) || sources.length === 0) return undefined;

  const messages = sources
    .map((s) => s?.message)
    .filter((m): m is string => typeof m === "string" && m.trim() !== "");

  return messages.length ? messages.join("\n") : undefined;
};

/**
 * The most specific message available, in order:
 *   1. the backend's per-field validation messages
 *   2. the backend's top-level `message`
 *   3. the thrown error's own `message`
 *   4. the caller's fallback
 *
 * `fallback` should be a translated string — this helper never translates,
 * because the text it prefers comes from the server and can't be localised
 * client-side.
 */
export const getApiErrorMessage = (err: any, fallback: string): string => {
  // The interceptor puts the raw response body on `data`; a raw AxiosError
  // puts it on `response.data`.
  const body = err?.data ?? err?.response?.data;

  const fieldMessages = readErrorSources(body);
  if (fieldMessages) return fieldMessages;

  const bodyMessage = body?.message;
  if (typeof bodyMessage === "string" && bodyMessage.trim() !== "") return bodyMessage;

  const errMessage = err?.message;
  if (typeof errMessage === "string" && errMessage.trim() !== "") return errMessage;

  return fallback;
};

/** HTTP status of a rejected call, from either error shape. */
export const getApiErrorStatus = (err: any): number | undefined =>
  err?.statusCode ?? err?.response?.status;
