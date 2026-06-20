import { describe, expect, it } from "vitest";

import {
  feedCacheKey,
  trendingCacheKey,
  recentUpdatesCacheKey,
  feedMetadataCacheKey,
  detailCacheKey,
  trendingFeedUrl,
  recentUpdatesFeedUrl,
  registryManifestUrl,
  registrySearchUrl,
  absoluteDataUrl,
  resolveConfiguredFeedUrl,
  RAYCAST_FEED_OVERRIDE_ENV,
} from "../integrations/raycast/src/feed.js";

const SITE = "https://heyclau.de";
const DEFAULT_FEED = `${SITE}/data/raycast-index.json`;

describe("default cache keys", () => {
  it("uses stable, distinct base keys per feed kind", () => {
    expect(feedCacheKey()).toBe("heyclaude-raycast-index");
    expect(trendingCacheKey()).toBe("heyclaude-raycast-trending");
    expect(recentUpdatesCacheKey()).toBe("heyclaude-raycast-recent-updates");
    expect(feedMetadataCacheKey()).toBe("heyclaude-raycast-feed-metadata");
  });
});

describe("detailCacheKey", () => {
  it("keys a detail entry by category and slug", () => {
    expect(detailCacheKey({ category: "agents", slug: "my-slug" })).toBe(
      "heyclaude-raycast-detail:agents:my-slug",
    );
  });

  it("appends an optional namespace segment", () => {
    expect(
      detailCacheKey({ category: "agents", slug: "x" }, DEFAULT_FEED, "ns"),
    ).toBe("heyclaude-raycast-detail:agents:x:ns");
  });
});

describe("feed/url builders", () => {
  it("builds the trending and recent-updates API URLs with a limit", () => {
    expect(trendingFeedUrl()).toBe(`${SITE}/api/registry/trending?limit=25`);
    expect(recentUpdatesFeedUrl()).toBe(`${SITE}/api/registry/diff?limit=25`);
  });

  it("builds the registry manifest data URL", () => {
    expect(registryManifestUrl()).toBe(`${SITE}/data/registry-manifest.json`);
  });

  it("resolves a relative data path against a feed base", () => {
    expect(absoluteDataUrl("a/b.json", `${SITE}/data/raycast-index.json`)).toBe(
      `${SITE}/data/a/b.json`,
    );
  });
});

describe("registrySearchUrl", () => {
  it("sets the trimmed query and optional facet params", () => {
    const url = new URL(
      registrySearchUrl({ query: "  hello  ", category: "mcp" }),
    );
    expect(url.pathname).toBe("/api/registry/search");
    expect(url.searchParams.get("q")).toBe("hello");
    expect(url.searchParams.get("category")).toBe("mcp");
  });

  it("includes the installable flag when requested", () => {
    const url = new URL(registrySearchUrl({ query: "x", installable: true }));
    expect(url.searchParams.get("installable")).toBe("true");
  });
});

describe("resolveConfiguredFeedUrl", () => {
  it("returns the default feed when nothing overrides it", () => {
    expect(resolveConfiguredFeedUrl({}, {})).toBe(DEFAULT_FEED);
  });

  it("prefers the environment override over preferences", () => {
    const override = "https://o.example/data/raycast-index.json";
    expect(
      resolveConfiguredFeedUrl(
        { feedUrlOverride: "https://p.example/data/raycast-index.json" },
        { [RAYCAST_FEED_OVERRIDE_ENV]: override },
      ),
    ).toBe(override);
  });

  it("falls back to the preference override when no env var is set", () => {
    const pref = "https://p.example/data/raycast-index.json";
    expect(resolveConfiguredFeedUrl({ feedUrlOverride: pref }, {})).toBe(pref);
  });
});
