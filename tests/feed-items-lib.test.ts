import { describe, expect, it } from "vitest";

import {
  absolutizeFeedLinks,
  feedLastBuilt,
} from "../apps/web/src/lib/feed-items-lib";

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

  it("falls back to the epoch ISO string for an empty feed", () => {
    expect(feedLastBuilt([])).toBe(new Date(0).toISOString());
  });
});
