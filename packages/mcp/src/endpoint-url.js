/**
 * MCP endpoint URL normalization surface.
 *
 * Pure endpoint URL helpers live in `endpoint-url-lib.js`. This module
 * re-exports that surface so existing `./endpoint-url.js` imports stay
 * unchanged.
 */
export {
  DEFAULT_REMOTE_MCP_URL,
  DEFAULT_REQUEST_TIMEOUT_MS,
  normalizeEndpointUrl,
  normalizeTimeoutMs,
} from "./endpoint-url-lib.js";
