import { describe, expect, it } from "vitest";

import { loadCachedFeed } from "../integrations/raycast/src/runtime.js";
import { feedCacheKey } from "../integrations/raycast/src/feed.js";
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

describe("loadCachedFeed", () => {
  it("returns an empty feed on a cache miss", () => {
    expect(loadCachedFeed(makeCache())).toEqual({
      entries: [],
      generatedAt: "",
    });
  });

  it("parses a cached feed on a hit", () => {
    const cache = makeCache();
    cache.set(
      feedCacheKey(),
      JSON.stringify({ generatedAt: "g", entries: [] }),
    );
    const result = loadCachedFeed(cache);
    expect(result.entries).toEqual([]);
    expect(result.generatedAt).toBe("g");
  });

  it("evicts a corrupt entry and returns an empty feed (self-healing)", () => {
    const cache = makeCache();
    cache.set(feedCacheKey(), "not valid json");
    expect(loadCachedFeed(cache)).toEqual({ entries: [], generatedAt: "" });
    // The bad value is removed so the next read can refetch cleanly.
    expect(cache.store[feedCacheKey()]).toBeUndefined();
  });
});
