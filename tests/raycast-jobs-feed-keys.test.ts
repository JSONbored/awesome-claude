import { describe, expect, it } from "vitest";

import {
  parseFavoriteJobKeys,
  serializeFavoriteJobKeys,
  jobsCacheKey,
  buildPostJobUrl,
} from "../integrations/raycast/src/jobs-feed.js";

describe("favorite job key storage", () => {
  it("parses a stored array into a sorted, de-duplicated list", () => {
    expect(parseFavoriteJobKeys('["b","a","a"]')).toEqual(["a", "b"]);
  });

  it("returns an empty list for blank or non-array payloads", () => {
    // A blank string hits the falsy guard; a non-array JSON value is rejected
    // after parsing. Both degrade to an empty favorites list.
    expect(parseFavoriteJobKeys("")).toEqual([]);
    expect(parseFavoriteJobKeys("[]")).toEqual([]);
    expect(parseFavoriteJobKeys('{"x":1}')).toEqual([]);
  });

  it("serializes favorites as a sorted, de-duplicated JSON array", () => {
    expect(serializeFavoriteJobKeys(["b", "a", "a"])).toBe('["a","b"]');
  });

  it("round-trips through serialize -> parse", () => {
    expect(
      parseFavoriteJobKeys(serializeFavoriteJobKeys(["z", "y", "y", "x"])),
    ).toEqual(["x", "y", "z"]);
  });
});

describe("jobsCacheKey", () => {
  it("uses the base key for the default feed and a namespaced key otherwise", () => {
    // A custom feed URL gets an encoded suffix so caches never collide.
    const base = jobsCacheKey();
    expect(jobsCacheKey()).toBe(base);
    const custom = jobsCacheKey("https://other.example/jobs");
    expect(custom.startsWith(`${base}:`)).toBe(true);
    expect(custom).toContain(encodeURIComponent("https://other.example/jobs"));
  });
});

describe("buildPostJobUrl", () => {
  it("resolves the /jobs/post path against the given origin", () => {
    expect(buildPostJobUrl("https://heyclau.de")).toBe(
      "https://heyclau.de/jobs/post",
    );
  });
});
