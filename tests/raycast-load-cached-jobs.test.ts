import { describe, expect, it } from "vitest";

import { loadCachedJobs } from "../integrations/raycast/src/jobs-runtime.js";
import {
  jobsCacheKey,
  type RaycastJob,
} from "../integrations/raycast/src/jobs-feed.js";
import type { RaycastTextCache } from "../integrations/raycast/src/runtime.js";

const job: RaycastJob = {
  slug: "s",
  title: "Engineer",
  company: "Acme",
  location: "L",
  description: "Desc",
  applyUrl: "https://a.example",
  webUrl: "https://w.example",
  sourceLabel: "s",
  applySourceLabel: "as",
  benefits: [],
  responsibilities: [],
  requirements: [],
  featured: false,
};

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

const EMPTY = { entries: [], generatedAt: "", count: 0 };

describe("loadCachedJobs", () => {
  it("returns an empty result on a cache miss", () => {
    expect(loadCachedJobs(makeCache())).toEqual(EMPTY);
  });

  it("parses a cached feed on a hit", () => {
    const cache = makeCache();
    cache.set(
      jobsCacheKey(),
      JSON.stringify({ generatedAt: "g", count: 1, entries: [job] }),
    );
    const result = loadCachedJobs(cache);
    expect(result.entries).toHaveLength(1);
    expect(result.generatedAt).toBe("g");
  });

  it("evicts a corrupt cache entry and returns empty (self-healing)", () => {
    const cache = makeCache();
    cache.set(jobsCacheKey(), "not valid json");
    expect(loadCachedJobs(cache)).toEqual(EMPTY);
    // The bad entry is removed so the next read can refetch cleanly.
    expect(cache.store[jobsCacheKey()]).toBeUndefined();
  });
});
