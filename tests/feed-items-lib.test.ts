import { describe, expect, it } from "vitest";

import {
  absolutizeFeedLinks,
  feedLastBuilt,
} from "../apps/web/src/lib/feed-items-lib";
import {
  buildRss,
  EMPTY_FEED_LAST_BUILT,
  latestPubDate,
  rfc822,
} from "../apps/web/src/lib/feeds-lib";

describe("absolutizeFeedLinks", () => {
  it("prefixes relative links with the base and preserves other fields", () => {
    const out = absolutizeFeedLinks(
      [{ link: "/changelog", title: "Note", pubDate: "2026-01-01" }],
      "https://heyclau.de",
    );
    expect(out[0]).toEqual({
      link: "https://heyclau.de/changelog",
      title: "Note",
      pubDate: "2026-01-01",
    });
  });

  it("leaves absolute (http) links unchanged", () => {
    const out = absolutizeFeedLinks(
      [{ link: "https://elsewhere.example/x", pubDate: "2026-01-01" }],
      "https://heyclau.de",
    );
    expect(out[0].link).toBe("https://elsewhere.example/x");
  });
});

describe("feedLastBuilt", () => {
  it("returns the newest item's pubDate", () => {
    expect(
      feedLastBuilt([{ pubDate: "2026-02-02" }, { pubDate: "2026-01-01" }]),
    ).toBe("2026-02-02");
  });

  it("returns the newest item's pubDate when the array is not sorted by date", () => {
    expect(
      feedLastBuilt([
        { pubDate: "2026-01-01" },
        { pubDate: "2026-02-02" },
        { pubDate: "2026-01-15" },
      ]),
    ).toBe("2026-02-02");
  });

  it("falls back to the shared empty-feed timestamp for an empty feed", () => {
    expect(feedLastBuilt([])).toBe(EMPTY_FEED_LAST_BUILT);
  });

  it("agrees with the empty feed's own <lastBuildDate> and latestPubDate fallback", () => {
    // Regression for #5676: the route-level feedLastBuilt fallback and the RSS
    // body's internal latestPubDate default must be the same instant, so the
    // reported FeedHealth.lastBuilt matches the <lastBuildDate> in the body.
    const built = feedLastBuilt([]);
    expect(built).toBe(latestPubDate([]));
    const body = buildRss({
      title: "Empty",
      description: "Empty feed",
      link: "https://heyclau.de",
      selfLink: "https://heyclau.de/feeds/changelog-policy.xml",
      items: [],
    });
    expect(body).toContain(`<lastBuildDate>${rfc822(built)}</lastBuildDate>`);
  });
});
