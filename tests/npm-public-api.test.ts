import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  GET,
  __resetNpmMetaCacheForTest,
} from "../apps/web/src/routes/api/public/npm/$";
import { getApiRouteDefinition } from "../apps/web/src/lib/api/contracts";

const globalWithEnv = globalThis as typeof globalThis & { __env__?: unknown };

function pkgFromUrl(input: string) {
  const url = new URL(input);
  if (url.hostname === "registry.npmjs.org") {
    const raw = decodeURIComponent(url.pathname.slice(1));
    return raw.endsWith("/latest") ? raw.slice(0, -"/latest".length) : raw;
  }
  if (url.hostname === "api.npmjs.org") {
    return decodeURIComponent(url.pathname.split("/").slice(4).join("/"));
  }
  return "unknown";
}

function okJson(body: unknown) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}

function requestFor(pkg: string, ip = "203.0.113.50") {
  return new Request(`https://heyclau.de/api/public/npm/${pkg}`, {
    headers: { "cf-connecting-ip": ip },
  });
}

describe("public npm metadata API cache", () => {
  beforeEach(() => {
    __resetNpmMetaCacheForTest();
    delete globalWithEnv.__env__;
  });

  afterEach(() => {
    delete globalWithEnv.__env__;
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("registers a durable Cloudflare rate-limit binding", () => {
    expect(getApiRouteDefinition("publicNpm.read").rateLimit).toMatchObject({
      scope: "public-npm",
      limit: 120,
      windowMs: 60_000,
      binding: "API_DYNAMIC_RATE_LIMIT",
    });
  });

  it("serves repeat requests from isolate cache", async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url =
        typeof input === "string"
          ? input
          : input instanceof URL
            ? input.href
            : input.url;
      const pkg = pkgFromUrl(url);
      if (url.includes("/latest"))
        return okJson({ name: pkg, version: "1.0.0" });
      if (url.includes("/downloads/point/last-week/"))
        return okJson({ downloads: 123 });
      return okJson({ time: { "1.0.0": "2026-01-01T00:00:00.000Z" } });
    });
    vi.stubGlobal("fetch", fetchMock);

    await GET(requestFor("cacheable-package"), {
      params: { _splat: "cacheable-package" },
    });
    const firstCallCount = fetchMock.mock.calls.length;
    await GET(requestFor("cacheable-package"), {
      params: { _splat: "cacheable-package" },
    });
    expect(fetchMock.mock.calls.length).toBe(firstCallCount);
  });

  it("evicts oldest keys when cache exceeds max entries", async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url =
        typeof input === "string"
          ? input
          : input instanceof URL
            ? input.href
            : input.url;
      const pkg = pkgFromUrl(url);
      if (url.includes("/latest"))
        return okJson({ name: pkg, version: "1.0.0" });
      if (url.includes("/downloads/point/last-week/"))
        return okJson({ downloads: 42 });
      return okJson({ time: { "1.0.0": "2026-01-01T00:00:00.000Z" } });
    });
    vi.stubGlobal("fetch", fetchMock);

    for (let i = 0; i < 257; i += 1) {
      // Unique IPs so the in-memory fallback limit does not trip mid-loop.
      await GET(requestFor(`pkg-${i}`, `198.51.100.${i % 250}`), {
        params: { _splat: `pkg-${i}` },
      });
    }
    const beforeRefetch = fetchMock.mock.calls.length;
    await GET(requestFor("pkg-0", "198.51.100.250"), {
      params: { _splat: "pkg-0" },
    });

    // 3 upstream calls per miss: latest + downloads + packument.
    expect(fetchMock.mock.calls.length - beforeRefetch).toBe(3);
  });

  it("returns 429 before upstream fetch when the Cloudflare binding denies", async () => {
    const fetchMock = vi.fn(async () =>
      okJson({ name: "x", version: "1.0.0" }),
    );
    vi.stubGlobal("fetch", fetchMock);
    globalWithEnv.__env__ = {
      API_DYNAMIC_RATE_LIMIT: {
        limit: async () => ({ success: false }),
      },
    };

    const response = await GET(requestFor("rate-limited-package"), {
      params: { _splat: "rate-limited-package" },
    });

    expect(response.status).toBe(429);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects invalid package names with 400 before any upstream fetch", async () => {
    const fetchMock = vi.fn(async () =>
      okJson({ name: "x", version: "1.0.0" }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const response = await GET(requestFor("../evil"), {
      params: { _splat: "../evil" },
    });

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "Invalid package name",
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
