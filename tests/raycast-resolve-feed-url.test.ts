import { describe, expect, it } from "vitest";

import {
  resolveFeedUrl,
  scopedCacheKey,
} from "../integrations/raycast/src/feed.js";

const DEFAULT_FEED = "https://heyclau.de/data/raycast-index.json";
const VALID_OVERRIDE = "https://other.example/data/raycast-index.json";

describe("resolveFeedUrl", () => {
  it("returns the default feed for empty input", () => {
    expect(resolveFeedUrl()).toBe(DEFAULT_FEED);
    expect(resolveFeedUrl("")).toBe(DEFAULT_FEED);
  });

  it("accepts a valid https override that ends with the feed path", () => {
    expect(resolveFeedUrl(VALID_OVERRIDE)).toBe(VALID_OVERRIDE);
  });

  it("rejects malformed URLs", () => {
    expect(() => resolveFeedUrl("not a url")).toThrow("must be a valid URL");
  });

  it("requires https for non-localhost hosts", () => {
    expect(() =>
      resolveFeedUrl("http://other.example/data/raycast-index.json"),
    ).toThrow("must use HTTPS");
  });

  it("requires the override to end with the raycast feed path", () => {
    expect(() => resolveFeedUrl("https://other.example/feed")).toThrow(
      "must end with /data/raycast-index.json",
    );
  });
});

describe("scopedCacheKey", () => {
  it("returns the base key unchanged for the default feed", () => {
    expect(scopedCacheKey("k")).toBe("k");
  });

  it("namespaces the key with the encoded override for a custom feed", () => {
    // A per-feed suffix keeps caches from different overrides from colliding.
    expect(scopedCacheKey("k", VALID_OVERRIDE)).toBe(
      `k:${encodeURIComponent(VALID_OVERRIDE)}`,
    );
  });
});
