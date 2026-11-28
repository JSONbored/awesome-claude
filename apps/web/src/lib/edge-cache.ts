// The edge cache `HTML_CACHE_CONTROL` (security-headers-lib.ts) was written for.
//
// A Worker's own Response is not stored by Cloudflare's cache on a custom
// domain: heyclau.de's pages carry `public, s-maxage=300` and never come back
// with a `cf-cache-status`, so every request rendered its page again. Measured
// 2026-11-28 over the 30 days before: 1.30M requests and 1.47B CPU-ms, a mean
// of 1.1 s of CPU each. A first request to a cold isolate took 5-9 s; the same
// URL answered in 0.25-0.42 s once warm.
//
// This stores what the app already marks shareable, in the Cache API of the
// colo the Worker runs in, for as long as the response itself declares:
//
// - only a GET that carries no Authorization header and no Cookie, so nothing
//   personalized is stored or served from here;
// - only a 200 whose Cache-Control is `public` with an `s-maxage` (or, without
//   one, a `max-age`) above zero, and that sets no cookie, varies on nothing
//   unbounded and is not `private`, `no-store` or `no-cache`;
// - stored under the response's own Cache-Control, which the Cache API honours
//   for expiry, `s-maxage` first.
//
// A cache that is missing or fails is a miss, never an error.

type EdgeCache = Pick<Cache, "match" | "put">;
type WaitUntil = { waitUntil: (promise: Promise<unknown>) => void };

/** Whether this request may be answered from, or stored into, the edge cache. */
export function edgeCacheableRequest(request: Request): boolean {
  return (
    request.method === "GET" &&
    !request.headers.has("authorization") &&
    !request.headers.has("cookie")
  );
}

function lifetime(directives: readonly string[], name: string): number | null {
  const directive = directives.find((d) => d.startsWith(`${name}=`));
  if (!directive) return null;
  const seconds = Number(directive.slice(name.length + 1));
  return Number.isFinite(seconds) ? seconds : null;
}

/** Whether a response may be stored for other visitors. */
export function storableResponse(response: Response): boolean {
  if (response.status !== 200 || response.headers.has("set-cookie")) return false;
  if ((response.headers.get("vary") ?? "").includes("*")) return false;
  const directives = (response.headers.get("cache-control") ?? "")
    .toLowerCase()
    .split(",")
    .map((d) => d.trim());
  if (!directives.includes("public")) return false;
  if (directives.some((d) => d === "private" || d === "no-store" || d === "no-cache")) {
    return false;
  }
  const seconds = lifetime(directives, "s-maxage") ?? lifetime(directives, "max-age");
  return seconds !== null && seconds > 0;
}

function defaultCache(): EdgeCache | null {
  const caches = (globalThis as { caches?: { default?: EdgeCache } }).caches;
  return caches?.default ?? null;
}

function waitUntil(ctx: unknown): WaitUntil["waitUntil"] | null {
  const fn = (ctx as Partial<WaitUntil> | null | undefined)?.waitUntil;
  return typeof fn === "function" ? fn.bind(ctx) : null;
}

/**
 * Answer from the edge cache when it holds this request, otherwise render and
 * store what may be shared. The store runs after the response, on the
 * request's `waitUntil`; without one the response is not stored.
 */
export async function withEdgeCache(
  request: Request,
  ctx: unknown,
  render: () => Promise<Response>,
  cache: EdgeCache | null = defaultCache(),
): Promise<Response> {
  if (!cache || !edgeCacheableRequest(request)) return render();
  let hit: Response | undefined;
  try {
    hit = await cache.match(request);
  } catch {
    hit = undefined;
  }
  if (hit) return hit;
  const response = await render();
  const defer = waitUntil(ctx);
  if (defer && storableResponse(response)) {
    defer(cache.put(request, response.clone()).catch(() => undefined));
  }
  return response;
}
