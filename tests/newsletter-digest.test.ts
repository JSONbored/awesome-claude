import { describe, expect, it } from "vitest";

import {
  digestCategoryCounts,
  groupDigestByCategory,
  selectDigestEntries,
  type DigestCandidate,
  type DigestItem,
} from "../apps/web/src/lib/newsletter-digest";

const NOW = Date.parse("2026-06-14T16:00:00Z");

function entry(daysAgo: number, overrides: Partial<DigestCandidate> = {}): DigestCandidate {
  const d = new Date(NOW - daysAgo * 86_400_000).toISOString().slice(0, 10);
  return {
    title: `Entry ${daysAgo}d`,
    category: "mcp",
    slug: `entry-${daysAgo}`,
    description: `Description ${daysAgo}`,
    dateAdded: d,
    ...overrides,
  };
}

describe("selectDigestEntries", () => {
  it("returns null (skip thin week) below the minimum", () => {
    const entries = [entry(1), entry(2), entry(3)]; // 3 < min 5
    expect(selectDigestEntries(entries, NOW, { min: 5 })).toBeNull();
  });

  it("includes only entries within the window, newest first", () => {
    const entries = [entry(10), entry(1), entry(8), entry(3), entry(0), entry(6), entry(2)];
    const result = selectDigestEntries(entries, NOW, { windowDays: 7, min: 1, max: 10 });
    expect(result).not.toBeNull();
    // 0,1,2,3,6 days ago are within 7 days; 8 and 10 are excluded.
    expect(result!.map((r) => r.slug)).toEqual([
      "entry-0",
      "entry-1",
      "entry-2",
      "entry-3",
      "entry-6",
    ]);
  });

  it("caps the digest at max", () => {
    const entries = Array.from({ length: 12 }, (_, i) => entry(i % 6));
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 6 });
    expect(result).toHaveLength(6);
  });

  it("excludes future-dated and unparseable entries", () => {
    const entries = [
      entry(-2, { slug: "future" }),
      entry(1),
      entry(2),
      entry(3),
      entry(4),
      entry(5, { dateAdded: "not-a-date", slug: "bad-date" }),
    ];
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 10 });
    const slugs = result!.map((r) => r.slug);
    expect(slugs).not.toContain("future");
    expect(slugs).not.toContain("bad-date");
  });

  it("prefers cardDescription over description for the summary", () => {
    const entries = [
      entry(1, { cardDescription: "Card copy", description: "Long copy" }),
      entry(2),
      entry(3),
      entry(4),
      entry(5),
    ];
    const result = selectDigestEntries(entries, NOW, { min: 1, max: 1 });
    expect(result![0].summary).toBe("Card copy");
  });
});

function item(category: string, slug: string): DigestItem {
  return { category, slug, title: `${category}/${slug}`, summary: "" };
}

describe("groupDigestByCategory", () => {
  it("groups items under their category, preserving within-category order", () => {
    const items = [
      item("mcp", "a"),
      item("skills", "b"),
      item("mcp", "c"),
      item("rules", "d"),
      item("skills", "e"),
    ];
    const groups = groupDigestByCategory(items);
    expect(groups.map((g) => g.category)).toEqual(["mcp", "skills", "rules"]);
    expect(groups[0].items.map((i) => i.slug)).toEqual(["a", "c"]);
    expect(groups[1].items.map((i) => i.slug)).toEqual(["b", "e"]);
    expect(groups[2].items.map((i) => i.slug)).toEqual(["d"]);
  });

  it("returns an empty array for an empty input", () => {
    expect(groupDigestByCategory([])).toEqual([]);
  });

  it("returns a single group when all items share a category", () => {
    const items = [item("mcp", "x"), item("mcp", "y")];
    const groups = groupDigestByCategory(items);
    expect(groups).toHaveLength(1);
    expect(groups[0].category).toBe("mcp");
    expect(groups[0].items).toHaveLength(2);
  });

  it("group order tracks the first occurrence of each category, not alphabetical", () => {
    const items = [item("rules", "a"), item("agents", "b"), item("rules", "c")];
    const groups = groupDigestByCategory(items);
    expect(groups[0].category).toBe("rules");
    expect(groups[1].category).toBe("agents");
  });
});

describe("digestCategoryCounts", () => {
  it("counts items per category", () => {
    const items = [item("mcp", "a"), item("mcp", "b"), item("skills", "c")];
    const counts = digestCategoryCounts(items);
    expect(counts.get("mcp")).toBe(2);
    expect(counts.get("skills")).toBe(1);
    expect(counts.has("rules")).toBe(false);
  });

  it("returns an empty map for an empty input", () => {
    expect(digestCategoryCounts([])).toEqual(new Map());
  });

  it("count values sum to the total number of items", () => {
    const items = [item("mcp", "a"), item("skills", "b"), item("rules", "c"), item("mcp", "d")];
    const counts = digestCategoryCounts(items);
    const total = [...counts.values()].reduce((s, n) => s + n, 0);
    expect(total).toBe(items.length);
  });
});
