import { describe, expect, it } from "vitest";

import {
  loadCachedTrending,
  loadCachedRecentUpdates,
} from "../integrations/raycast/src/runtime.js";
import {
  trendingCacheKey,
  recentUpdatesCacheKey,
} from "../integrations/raycast/src/feed.js";
import type { RaycastTextCache } from "../integrations/raycast/src/runtime.js";

function makeCache(): RaycastTextCache & { store: Record<string, string> } {
  const store: Record<string, string> = {};
  return {
    store,
    get: (key) => store[key],
    set: (key, value) => {
      store[key] = value;
    },
    remove: (key) => {
      delete store[key];
    },
  };
}

describe("loadCachedTrending", () => {
  it("returns the empty 'all' default on a cache miss", () => {
    expect(loadCachedTrending(makeCache())).toEqual({
      entries: [],
      category: "all",
      platform: "all",
      generatedAt: "",
    });
  });

  it("parses a cached trending feed on a hit", () => {
    const cache = makeCache();
    cache.set(
      trendingCacheKey(),
      JSON.stringify({
        generatedAt: "g",
        category: "all",
        platform: "all",
        entries: [],
      }),
    );
    expect(loadCachedTrending(cache).generatedAt).toBe("g");
  });

  it("evicts a corrupt entry and returns the default (self-healing)", () => {
    const cache = makeCache();
    cache.set(trendingCacheKey(), "not json");
    expect(loadCachedTrending(cache).generatedAt).toBe("");
    expect(cache.store[trendingCacheKey()]).toBeUndefined();
  });
});

describe("loadCachedRecentUpdates", () => {
  it("returns the empty default on a cache miss", () => {
    expect(loadCachedRecentUpdates(makeCache())).toEqual({
      entries: [],
      generatedAt: "",
      currentSignature: "",
    });
  });

  it("parses a cached recent-updates feed on a hit", () => {
    const cache = makeCache();
    cache.set(
      recentUpdatesCacheKey(),
      JSON.stringify({
        generatedAt: "g",
        currentSignature: "sig",
        entries: [],
      }),
    );
    const result = loadCachedRecentUpdates(cache);
    expect(result.generatedAt).toBe("g");
    expect(result.currentSignature).toBe("sig");
  });

  it("evicts a corrupt entry and returns the default (self-healing)", () => {
    const cache = makeCache();
    cache.set(recentUpdatesCacheKey(), "not json");
    expect(loadCachedRecentUpdates(cache).generatedAt).toBe("");
    expect(cache.store[recentUpdatesCacheKey()]).toBeUndefined();
  });
});
