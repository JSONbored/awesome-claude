// Pure response-decoration for the MCP streamable route: apply the MCP CORS
// allowlist, the shared security headers, and no-store caching. Split out of the
// route so the header application can be unit-tested without the handler.

import { applySecurityHeaders } from "@/lib/security-headers";

const mcpCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "POST, DELETE, OPTIONS",
  "access-control-allow-headers":
    "content-type, accept, mcp-session-id, mcp-protocol-version, mcp-method, mcp-name, last-event-id",
  "access-control-expose-headers": "mcp-session-id, mcp-protocol-version",
};

/**
 * Return a copy of the response with the MCP CORS headers, the shared security
 * headers, and `cache-control: no-store` applied. Status, status text, and body
 * are preserved.
 */
export function applyMcpHeaders(response: Response): Response {
  const headers = applySecurityHeaders(new Headers(response.headers));
  for (const [key, value] of Object.entries(mcpCorsHeaders)) headers.set(key, value);
  headers.set("cache-control", "no-store");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
