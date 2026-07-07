import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  GET,
  __resetNpmMetaCacheForTest,
} from "../apps/web/src/routes/api/public/npm/$";

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

describe("public npm metadata API cache", () => {
  beforeEach(() => {
    __resetNpmMetaCacheForTest();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
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

    await GET({ params: { _splat: "cacheable-package" } });
    const firstCallCount = fetchMock.mock.calls.length;
    await GET({ params: { _splat: "cacheable-package" } });
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
      await GET({ params: { _splat: `pkg-${i}` } });
    }
    const beforeRefetch = fetchMock.mock.calls.length;
    await GET({ params: { _splat: "pkg-0" } });

    // 3 upstream calls per miss: latest + downloads + packument.
    expect(fetchMock.mock.calls.length - beforeRefetch).toBe(3);
  });
});
