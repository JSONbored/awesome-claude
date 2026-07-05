/**
 * Security-header surface.
 *
 * The pure helpers (origin parsing, non-prod host check, edge-cache policy) live
 * in `security-headers-lib.ts`. This module keeps the site-config / env-bound CSP
 * header set and re-exports the pure helpers so existing `@/lib/security-headers`
 * imports stay unchanged.
 */
import { isNonProdHost, urlOrigin } from "@/lib/security-headers-lib";
import { siteConfig } from "./site";

export { applyEdgeCacheHeaders, urlOrigin } from "@/lib/security-headers-lib";

const scriptSrc = [
  // Keep scripts constrained to same-origin application bundles. The legacy
  // first-party analytics script proxy is disabled because it could serve
  // external JavaScript as same-origin code; browser analytics is emitted by
  // our bundled first-party tracker through /u/api/send.
  "script-src 'self' 'unsafe-inline'",
  process.env.NODE_ENV === "production" ? "" : "'unsafe-eval'",
  "https://challenges.cloudflare.com",
]
  .filter(Boolean)
  .join(" ");

const connectSrc = Array.from(
  new Set(
    [
      "connect-src 'self'",
      "https://api.github.com",
      "https://img.shields.io",
      "https://challenges.cloudflare.com",
      "https://submission-gate.heyclau.de",
      urlOrigin(siteConfig.submissionGateUrl),
    ].filter(Boolean),
  ),
).join(" ");

const SECURITY_HEADERS = {
  "content-security-policy": [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    scriptSrc,
    // Fonts are self-hosted (public/fonts.css + /fonts/*.woff2), so no third-party origins needed.
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    connectSrc,
    "frame-src https://challenges.cloudflare.com",
    "form-action 'self' https://github.com",
    "manifest-src 'self'",
  ].join("; "),
  "cross-origin-opener-policy": "same-origin",
  "permissions-policy":
    "camera=(), microphone=(), geolocation=(), payment=(), usb=(), bluetooth=(), browsing-topics=()",
  "referrer-policy": "strict-origin-when-cross-origin",
  "strict-transport-security": "max-age=63072000; includeSubDomains; preload",
  "x-content-type-options": "nosniff",
  "x-frame-options": "DENY",
} as const;

// RFC 8288 Link header advertising agent-discovery resources from every HTML page.
const AGENT_LINK_HEADER = [
  `<${siteConfig.url}/.well-known/api-catalog>; rel="api-catalog"`,
  `<${siteConfig.url}/openapi.json>; rel="service-desc"; type="application/json"`,
  `<${siteConfig.url}/api-docs>; rel="service-doc"; type="text/html"`,
  `<${siteConfig.url}/.well-known/mcp/server-card.json>; rel="related"; title="MCP server card"`,
  `<${siteConfig.url}/.well-known/agent-skills/index.json>; rel="related"; title="Agent skills index"`,
].join(", ");

export function applySecurityHeaders(headers: Headers, request?: Request) {
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    if (!headers.has(name)) headers.set(name, value);
  }
  if ((headers.get("content-type") ?? "").includes("text/html") && !headers.has("link")) {
    headers.set("link", AGENT_LINK_HEADER);
  }
  if (request) {
    try {
      const { hostname } = new URL(request.url);
      if (isNonProdHost(hostname)) {
        headers.set("x-robots-tag", "noindex, follow");
      }
    } catch {
      // Malformed request URL — leave indexing headers untouched.
    }
  }
  return headers;
}

export function getSecurityHeaders() {
  return Object.entries(SECURITY_HEADERS).map(([key, value]) => ({
    key,
    value,
  }));
}
