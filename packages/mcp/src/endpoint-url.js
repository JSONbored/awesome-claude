export const DEFAULT_REMOTE_MCP_URL = "https://heyclau.de/api/mcp";
export const DEFAULT_REQUEST_TIMEOUT_MS = 30000;

const localHosts = new Set(["127.0.0.1", "localhost", "::1", "[::1]"]);

export function normalizeEndpointUrl(value = DEFAULT_REMOTE_MCP_URL) {
  const raw = String(value || "").trim();
  if (!raw) throw new Error("MCP endpoint URL is required.");

  const url = new URL(raw);
  if (url.protocol !== "https:" && !localHosts.has(url.hostname)) {
    throw new Error("MCP endpoint URL must use HTTPS outside localhost.");
  }

  if (url.pathname === "/" || url.pathname === "") {
    url.pathname = "/api/mcp";
  }

  return url;
}

export function normalizeTimeoutMs(
  value,
  fallback = DEFAULT_REQUEST_TIMEOUT_MS,
) {
  if (value === undefined || value === null || value === "") return fallback;
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric < 1000 || numeric > 300000) {
    throw new Error("Timeout must be between 1000 and 300000 milliseconds.");
  }
  return Math.trunc(numeric);
}
