import { describe, expect, it } from "vitest";

// Deep-relative test imports use the `.js` specifier across this repo's suite;
// the bundler maps it to the TypeScript source.
import { parseFeed } from "../integrations/raycast/src/feed.js";

// A raw feed entry needs the fields normalizeRaycastEntry requires
// (category/slug/title/description plus detailUrl and webUrl).
const rawEntry = {
  category: "agents",
  slug: "a",
  title: "T",
  description: "D",
  detailUrl: "https://d.example",
  webUrl: "https://w.example",
};

describe("parseFeed", () => {
  it("normalizes valid entries and drops malformed ones", () => {
    const feed = parseFeed(
      JSON.stringify({ generatedAt: "g", entries: [rawEntry, { bad: 1 }] }),
    );
    expect(feed.entries).toHaveLength(1);
    expect(feed.entries[0].slug).toBe("a");
    expect(feed.generatedAt).toBe("g");
  });

  it("returns an empty feed when the entries field is not an array", () => {
    expect(parseFeed(JSON.stringify({ foo: 1 }))).toEqual({
      entries: [],
      generatedAt: "",
    });
  });

  it("defaults generatedAt to an empty string when it is not a string", () => {
    const feed = parseFeed(
      JSON.stringify({ generatedAt: 123, entries: [rawEntry] }),
    );
    expect(feed.generatedAt).toBe("");
    expect(feed.entries).toHaveLength(1);
  });
});
