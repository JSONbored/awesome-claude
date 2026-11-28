import { describe, expect, it, vi } from "vitest";

import {
  edgeCacheableRequest,
  storableResponse,
  withEdgeCache,
} from "@/lib/edge-cache";
import { applyEdgeCacheHeaders, HTML_CACHE_CONTROL } from "@/lib/security-headers-lib";

const URL_ = "https://heyclau.de/agents";

function page(headers: Record<string, string> = {}, status = 200) {
  return new Response("<html>page</html>", {
    status,
    headers: { "content-type": "text/html; charset=utf-8", ...headers },
  });
}

/** The Cache API's match/put, keyed by URL as the edge cache keys a GET. */
function memoryCache() {
  const stored = new Map<string, Response>();
  return {
    stored,
    match: vi.fn(async (request: RequestInfo | URL) => {
      const hit = stored.get(new Request(request).url);
      return hit ? hit.clone() : undefined;
    }),
    put: vi.fn(async (request: RequestInfo | URL, response: Response) => {
      stored.set(new Request(request).url, response);
    }),
  };
}

/** A request's waitUntil, collecting what it was handed. */
function context() {
  const pending: Promise<unknown>[] = [];
  return { pending, waitUntil: (promise: Promise<unknown>) => pending.push(promise) };
}

describe("what the edge cache stores", () => {
  it("stores the policy's own HTML header and an API's max-age", () => {
    const headers = applyEdgeCacheHeaders(
      new Headers({ "content-type": "text/html; charset=utf-8" }),
      200,
      "GET",
    );
    expect(headers.get("cache-control")).toBe(HTML_CACHE_CONTROL);
    expect(storableResponse(new Response("x", { headers }))).toBe(true);
    expect(
      storableResponse(page({ "cache-control": "public, max-age=300, stale-while-revalidate=3600" })),
    ).toBe(true);
    // s-maxage governs the edge even when max-age says otherwise.
    expect(storableResponse(page({ "cache-control": "public, max-age=0, s-maxage=60" }))).toBe(true);
  });

  it("never stores what is personal, unbounded or not a success", () => {
    for (const headers of [
      {},
      { "cache-control": "no-store" },
      { "cache-control": "private, max-age=60" },
      { "cache-control": "public, max-age=60, no-cache" },
      { "cache-control": "public" },
      { "cache-control": "public, s-maxage=0" },
      { "cache-control": "public, s-maxage=soon" },
      { "cache-control": HTML_CACHE_CONTROL, "set-cookie": "session=abc" },
      { "cache-control": HTML_CACHE_CONTROL, vary: "*" },
    ])
      expect(storableResponse(page(headers)), JSON.stringify(headers)).toBe(false);
    expect(storableResponse(page({ "cache-control": HTML_CACHE_CONTROL }, 404))).toBe(false);
  });

  it("answers only a GET with no credential and no cookie", () => {
    expect(edgeCacheableRequest(new Request(URL_))).toBe(true);
    expect(edgeCacheableRequest(new Request(URL_, { method: "POST" }))).toBe(false);
    expect(edgeCacheableRequest(new Request(URL_, { method: "HEAD" }))).toBe(false);
    expect(
      edgeCacheableRequest(new Request(URL_, { headers: { authorization: "Bearer t" } })),
    ).toBe(false);
    expect(edgeCacheableRequest(new Request(URL_, { headers: { cookie: "a=b" } }))).toBe(false);
  });
});

describe("withEdgeCache", () => {
  it("renders once, then answers from the cache", async () => {
    const cache = memoryCache();
    const render = vi.fn(async () => page({ "cache-control": HTML_CACHE_CONTROL }));
    const first = context();
    const one = await withEdgeCache(new Request(URL_), first, render, cache);
    await Promise.all(first.pending);
    expect(await one.text()).toBe("<html>page</html>");
    expect(cache.put).toHaveBeenCalledTimes(1);

    const two = await withEdgeCache(new Request(URL_), context(), render, cache);
    expect(await two.text()).toBe("<html>page</html>");
    expect(render).toHaveBeenCalledTimes(1);
  });

  it("renders every time for what it may not store or answer", async () => {
    const cache = memoryCache();
    const renders = [
      // A response that opts out is rendered, and never stored.
      [new Request(URL_), async () => page({ "cache-control": "no-store" })],
      // A request with a cookie is never answered from the cache, nor stored.
      [
        new Request(URL_, { headers: { cookie: "a=b" } }),
        async () => page({ "cache-control": HTML_CACHE_CONTROL }),
      ],
      [new Request(URL_, { method: "POST" }), async () => page({ "cache-control": HTML_CACHE_CONTROL })],
    ] as const;
    for (const [request, body] of renders) {
      const render = vi.fn(body);
      await withEdgeCache(request, context(), render, cache);
      await withEdgeCache(request, context(), render, cache);
      expect(render).toHaveBeenCalledTimes(2);
    }
    expect(cache.put).not.toHaveBeenCalled();
    expect(cache.match).toHaveBeenCalledTimes(2);
  });

  it("is a plain render with no cache, and stores nothing without a waitUntil", async () => {
    const render = vi.fn(async () => page({ "cache-control": HTML_CACHE_CONTROL }));
    expect((await withEdgeCache(new Request(URL_), context(), render, null)).status).toBe(200);
    const cache = memoryCache();
    await withEdgeCache(new Request(URL_), {}, render, cache);
    await withEdgeCache(new Request(URL_), null, render, cache);
    expect(cache.put).not.toHaveBeenCalled();
    expect(render).toHaveBeenCalledTimes(3);
  });

  it("treats a failing cache as a miss, never as an error", async () => {
    const render = vi.fn(async () => page({ "cache-control": HTML_CACHE_CONTROL }));
    const broken = {
      match: vi.fn(async () => {
        throw new Error("cache unavailable");
      }),
      put: vi.fn(async () => {
        throw new Error("cache full");
      }),
    };
    const ctx = context();
    const response = await withEdgeCache(new Request(URL_), ctx, render, broken);
    await expect(Promise.all(ctx.pending)).resolves.toBeDefined();
    expect(response.status).toBe(200);
    expect(render).toHaveBeenCalledTimes(1);
  });

  it("renders when the platform has no cache and none is given", async () => {
    vi.stubGlobal("caches", undefined);
    try {
      const render = vi.fn(async () => page({ "cache-control": HTML_CACHE_CONTROL }));
      expect((await withEdgeCache(new Request(URL_), context(), render)).status).toBe(200);
      expect(render).toHaveBeenCalledTimes(1);
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it("uses the platform's default cache when none is given", async () => {
    const cache = memoryCache();
    vi.stubGlobal("caches", { default: cache });
    try {
      const ctx = context();
      await withEdgeCache(
        new Request(URL_),
        ctx,
        async () => page({ "cache-control": HTML_CACHE_CONTROL }),
      );
      await Promise.all(ctx.pending);
      expect(cache.stored.has(URL_)).toBe(true);
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
