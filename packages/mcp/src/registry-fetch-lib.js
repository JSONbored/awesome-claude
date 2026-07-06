import {
  publicApiBaseUrl,
  stripTrailingSlashes,
} from "./registry-public-api-lib.js";

export const JSON_MIME_TYPE = "application/json";
export const DISCOVERY_FETCH_TIMEOUT_MS = 5000;

/**
 * Build the absolute URL for a public HeyClaude API path.
 *
 * @param {string} apiPath API path beginning with `/api/...`.
 * @param {{ publicApiBaseUrl?: string }} [options]
 * @returns {string}
 */
export function buildPublicApiRequestUrl(apiPath, options = {}) {
  const baseUrl = stripTrailingSlashes(publicApiBaseUrl(options));
  return `${baseUrl}${apiPath.startsWith("/") ? "" : "/"}${apiPath}`;
}

/**
 * Fetch JSON from a public HeyClaude API path. Tests inject a deterministic
 * fetcher via `options.fetchPublicApi`; production uses `fetch()` with a
 * bounded {@link DISCOVERY_FETCH_TIMEOUT_MS} timeout, `redirect: "error"`,
 * and a JSON `accept` header. Throws on non-2xx responses so callers can
 * convert failures into the "unavailable" graceful-degradation envelope.
 *
 * @param {string} apiPath API path beginning with `/api/...`.
 * @param {{
 *   publicApiBaseUrl?: string,
 *   fetchPublicApi?: (apiPath: string) => Promise<unknown>,
 * }} [options]
 * @returns {Promise<unknown>} Parsed JSON body from the upstream response.
 */
export async function fetchPublicApiJson(apiPath, options = {}) {
  if (typeof options.fetchPublicApi === "function") {
    return options.fetchPublicApi(apiPath);
  }
  const url = buildPublicApiRequestUrl(apiPath, options);
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    DISCOVERY_FETCH_TIMEOUT_MS,
  );
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { accept: JSON_MIME_TYPE },
      redirect: "error",
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new Error(`Public API ${apiPath} returned ${response.status}.`);
    }
    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
}
