import { SITE_URL } from "./platforms.js";

/**
 * Resolve the public HeyClaude API base URL. Prefers an explicit override
 * on `options.publicApiBaseUrl`, then the `HEYCLAUDE_PUBLIC_API_URL`
 * environment variable, then falls back to the canonical site URL.
 *
 * @param {{ publicApiBaseUrl?: string }} [options]
 * @returns {string} Base URL used to build `/api/...` requests.
 */
export function publicApiBaseUrl(options = {}) {
  return (
    options.publicApiBaseUrl || process.env.HEYCLAUDE_PUBLIC_API_URL || SITE_URL
  );
}

/**
 * Remove trailing slashes without using a potentially expensive regex on
 * caller-controlled API base URL overrides.
 *
 * @param {string} value
 * @returns {string}
 */
export function stripTrailingSlashes(value) {
  let end = value.length;
  while (end > 0 && value.charCodeAt(end - 1) === 47) {
    end -= 1;
  }
  return value.slice(0, end);
}
