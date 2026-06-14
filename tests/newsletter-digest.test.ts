import { describe, expect, it } from "vitest";

import { selectDigestEntries, type DigestCandidate } from "../apps/web/src/lib/newsletter-digest";

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
