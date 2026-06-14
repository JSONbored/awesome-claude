import { siteConfig } from "./site";

function urlOrigin(value: string) {
  if (!value) return "";
  try {
    return new URL(value).origin;
  } catch {
    return "";
  }
}

const scriptSrc = [
  "script-src 'self' 'unsafe-inline'",
  process.env.NODE_ENV === "production" ? "" : "'unsafe-eval'",
  "https://umami.heyclau.de",
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
      "https://umami.heyclau.de",
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

// Non-production hosts (preview/staging) must not be indexed — otherwise Google treats
// e.g. dev.heyclau.de as duplicate content competing with the canonical production site.
function isNonProdHost(hostname: string) {
  return (
    hostname.startsWith("dev.") ||
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname.includes("staging") ||
    hostname.endsWith(".workers.dev")
  );
}

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

// SSR HTML that no route opted out of is safe to cache at the edge so repeat hits
// skip re-rendering. Personalized/dynamic routes already set their own `Cache-Control`
// (typically `no-store`), which is preserved; a `Set-Cookie` (session/personalization)
// also disables caching as a backstop. CDN-only (`s-maxage`) — no browser `max-age`, so
// a deploy invalidates immediately for users.
const HTML_CACHE_CONTROL = "public, s-maxage=300, stale-while-revalidate=86400";

export function applyEdgeCacheHeaders(headers: Headers, status: number, method: string) {
  if (method !== "GET" || status !== 200) return headers;
  if (headers.has("cache-control") || headers.has("set-cookie")) return headers;
  if (!(headers.get("content-type") ?? "").includes("text/html")) return headers;
  headers.set("cache-control", HTML_CACHE_CONTROL);
  return headers;
}

export function getSecurityHeaders() {
  return Object.entries(SECURITY_HEADERS).map(([key, value]) => ({
    key,
    value,
  }));
}
