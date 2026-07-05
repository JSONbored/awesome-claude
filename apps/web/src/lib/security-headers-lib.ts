/**
 * Pure security-header helpers.
 *
 * The origin parser, the non-production host check, and the edge-cache header
 * policy — none of which depend on the site config or environment. Given the
 * same inputs the output is deterministic (the header helpers mutate the passed
 * `Headers` object in place and return it).
 *
 * The public surface (`security-headers.ts` / `@/lib/security-headers`) keeps
 * the CSP/site-config-bound header set and re-exports the helpers below.
 */

export function urlOrigin(value: string) {
  if (!value) return "";
  try {
    return new URL(value).origin;
  } catch {
    return "";
  }
}

// Non-production hosts (preview/staging) must not be indexed — otherwise Google treats
// e.g. dev.heyclau.de as duplicate content competing with the canonical production site.
export function isNonProdHost(hostname: string) {
  return (
    hostname.startsWith("dev.") ||
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname.includes("staging") ||
    hostname.endsWith(".workers.dev")
  );
}

// SSR HTML that no route opted out of is safe to cache at the edge so repeat hits
// skip re-rendering. Personalized/dynamic routes already set their own `Cache-Control`
// (typically `no-store`), which is preserved; a `Set-Cookie` (session/personalization)
// also disables caching as a backstop. CDN-only (`s-maxage`) — no browser `max-age`, so
// a deploy invalidates immediately for users.
export const HTML_CACHE_CONTROL = "public, s-maxage=300, stale-while-revalidate=86400";

export function applyEdgeCacheHeaders(headers: Headers, status: number, method: string) {
  if (method !== "GET" || status !== 200) return headers;
  if (headers.has("cache-control") || headers.has("set-cookie")) return headers;
  if (!(headers.get("content-type") ?? "").includes("text/html")) return headers;
  headers.set("cache-control", HTML_CACHE_CONTROL);
  return headers;
}
