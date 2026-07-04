import { describe, expect, it } from "vitest";

import {
  hubHighlights,
  hubStats,
  trustPosture,
  type Highlight,
} from "../apps/web/src/lib/hub-highlights-lib";
import type { Entry } from "@/types/registry";

function entry(overrides: Partial<Entry> = {}): Entry {
  return {
    category: "mcp",
    slug: "demo",
    title: "Demo",
    description: "Example MCP server",
    trust: "review",
    source: "unverified",
    platforms: [],
    tags: [],
    dateAdded: "2026-01-01",
    ...overrides,
  } as Entry;
}

const byKind = (highlights: Highlight[], kind: Highlight["kind"]) =>
  highlights.find((item) => item.kind === kind);

describe("hubHighlights guardrails", () => {
  it("returns no highlights when the set is too small to be meaningful", () => {
    expect(hubHighlights([])).toEqual([]);
    expect(hubHighlights([entry()])).toEqual([]);
  });

  it("never surfaces the same entry twice in one strip", () => {
    const shared = entry({
      slug: "all-rounder",
      trust: "trusted",
      source: "first-party",
      safetyNotes: "sandboxed",
      privacyNotes: "local only",
      reviewed: true,
      repoStats: { stars: 99 },
      dateAdded: "2026-06-01",
    });
    const highlights = hubHighlights([
      shared,
      entry({ slug: "filler", dateAdded: "2026-01-02" }),
    ]);
    const keys = highlights.map(
      (item) => `${item.entry.category}/${item.entry.slug}`,
    );
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("respects the requested limit", () => {
    const entries = [
      entry({
        slug: "trusted",
        trust: "trusted",
        source: "first-party",
        dateAdded: "2026-01-05",
      }),
      entry({
        slug: "documented",
        safetyNotes: "x",
        privacyNotes: "y",
        reviewed: true,
        dateAdded: "2026-01-06",
      }),
      entry({
        slug: "popular",
        repoStats: { stars: 42 },
        dateAdded: "2026-01-04",
      }),
      entry({ slug: "newest", dateAdded: "2026-01-07" }),
      entry({
        slug: "reviewed",
        reviewed: true,
        source: "source-backed",
        dateAdded: "2026-01-03",
      }),
    ];
    expect(hubHighlights(entries, 2)).toHaveLength(2);
    expect(hubHighlights(entries, 6).length).toBeLessThanOrEqual(6);
  });
});

describe("hubHighlights trusted pick", () => {
  it("prefers trusted entries with stronger provenance and newer dates", () => {
    const entries = [
      entry({
        slug: "older-trusted",
        trust: "trusted",
        source: "source-backed",
        dateAdded: "2026-01-01",
      }),
      entry({
        slug: "best-trusted",
        trust: "trusted",
        source: "first-party",
        dateAdded: "2026-06-01",
      }),
      entry({ slug: "filler", dateAdded: "2026-01-02" }),
    ];

    const trusted = byKind(hubHighlights(entries), "trusted");
    expect(trusted?.entry.slug).toBe("best-trusted");
    expect(trusted?.label).toBe("Most-trusted pick");
    expect(trusted?.reason).toContain("Trusted trust");
    expect(trusted?.reason).toContain("first-party");
  });

  it("uses the unverified-source reason copy when provenance is missing", () => {
    const entries = [
      entry({
        slug: "trusted-unverified",
        trust: "trusted",
        source: "unverified",
        dateAdded: "2026-03-01",
      }),
      entry({ slug: "filler", dateAdded: "2026-01-02" }),
    ];

    const trusted = byKind(hubHighlights(entries), "trusted");
    expect(trusted?.reason).toBe("Trusted trust tier in this set.");
  });
});

describe("hubHighlights newest pick", () => {
  it("selects the entry with the latest valid dateAdded", () => {
    const entries = [
      entry({ slug: "older", dateAdded: "2026-01-01" }),
      entry({ slug: "newest", dateAdded: "2026-06-15" }),
      entry({ slug: "middle", dateAdded: "2026-03-01" }),
    ];

    const newest = byKind(hubHighlights(entries), "newest");
    expect(newest?.entry.slug).toBe("newest");
    expect(newest?.label).toBe("Newest addition");
    expect(newest?.reason).toContain("Added to the directory");
  });

  it("ignores entries with missing or invalid dates", () => {
    const entries = [
      entry({ slug: "invalid", dateAdded: "not-a-date" }),
      entry({ slug: "missing-date", dateAdded: undefined }),
      entry({ slug: "valid", dateAdded: "2026-02-01" }),
    ];

    const newest = byKind(hubHighlights(entries), "newest");
    expect(newest?.entry.slug).toBe("valid");
  });
});

describe("hubHighlights documented pick", () => {
  it("prefers reviewed documented entries over undocumented reviewed peers", () => {
    const entries = [
      entry({
        slug: "documented-reviewed",
        safetyNotes: "runs locally",
        privacyNotes: "no telemetry",
        reviewed: true,
        dateAdded: "2026-01-02",
      }),
      entry({
        slug: "documented-only",
        safetyNotes: "sandboxed",
        privacyNotes: "ephemeral",
        reviewed: false,
        dateAdded: "2026-06-01",
      }),
      entry({ slug: "filler", dateAdded: "2026-01-01" }),
    ];

    const documented = byKind(hubHighlights(entries), "documented");
    expect(documented?.entry.slug).toBe("documented-reviewed");
    expect(documented?.reason).toBe(
      "Has safety and privacy notes, maintainer-reviewed.",
    );
  });

  it("uses the on-file copy when safety and privacy notes exist without review", () => {
    const entries = [
      entry({
        slug: "notes-only",
        safetyNotes: "reads files",
        privacyNotes: "local only",
        reviewed: false,
        dateAdded: "2026-04-01",
      }),
      entry({ slug: "newest", dateAdded: "2026-06-01" }),
      entry({ slug: "filler", dateAdded: "2026-01-01" }),
    ];

    const documented = byKind(hubHighlights(entries), "documented");
    expect(documented?.entry.slug).toBe("notes-only");
    expect(documented?.reason).toBe(
      "Has both safety and privacy notes on file.",
    );
  });
});

describe("hubHighlights sourced pick", () => {
  it("surfaces the strongest source-backed or first-party provenance", () => {
    const entries = [
      entry({ slug: "external", source: "external", dateAdded: "2026-01-01" }),
      entry({
        slug: "source-backed",
        source: "source-backed",
        dateAdded: "2026-02-01",
      }),
      entry({
        slug: "first-party",
        trust: "review",
        source: "first-party",
        dateAdded: "2026-01-15",
      }),
    ];

    const sourced = byKind(hubHighlights(entries), "sourced");
    expect(sourced?.entry.slug).toBe("first-party");
    expect(sourced?.reason).toContain("First-party provenance");
  });
});

describe("hubHighlights popular pick", () => {
  it("selects the entry with the highest repository star count", () => {
    const entries = [
      entry({
        slug: "low-stars",
        repoStats: { stars: 3 },
        dateAdded: "2026-01-01",
      }),
      entry({
        slug: "high-stars",
        repoStats: { stars: 1200 },
        dateAdded: "2026-01-02",
      }),
      entry({ slug: "filler", dateAdded: "2026-01-03" }),
    ];

    const popular = byKind(hubHighlights(entries), "popular");
    expect(popular?.entry.slug).toBe("high-stars");
    expect(popular?.reason).toContain("1,200 stars");
  });

  it("skips the popular slot when no entry has repository stars", () => {
    const entries = [
      entry({ slug: "a", dateAdded: "2026-01-01" }),
      entry({ slug: "b", dateAdded: "2026-01-02" }),
    ];
    expect(byKind(hubHighlights(entries), "popular")).toBeUndefined();
  });

  it("ignores zero-star repositories when ranking popularity", () => {
    const entries = [
      entry({
        slug: "zero-stars",
        repoStats: { stars: 0 },
        dateAdded: "2026-01-01",
      }),
      entry({ slug: "missing-stats", repoStats: {}, dateAdded: "2026-01-02" }),
      entry({
        slug: "winner",
        repoStats: { stars: 7 },
        dateAdded: "2026-01-03",
      }),
      entry({ slug: "newest", dateAdded: "2026-06-01" }),
    ];

    const popular = byKind(hubHighlights(entries), "popular");
    expect(popular?.entry.slug).toBe("winner");
  });
});

describe("hubHighlights reviewed fallback", () => {
  it("fills the strip with a maintainer-reviewed pick when earlier slots are taken", () => {
    const entries = [
      entry({
        slug: "trusted",
        trust: "trusted",
        source: "first-party",
        dateAdded: "2026-01-05",
      }),
      entry({
        slug: "documented",
        safetyNotes: "x",
        privacyNotes: "y",
        reviewed: true,
        dateAdded: "2026-01-06",
      }),
      entry({
        slug: "popular",
        repoStats: { stars: 42 },
        dateAdded: "2026-01-04",
      }),
      entry({ slug: "newest", dateAdded: "2026-01-07" }),
      entry({
        slug: "reviewed-fallback",
        reviewed: true,
        source: "external",
        dateAdded: "2026-01-03",
      }),
    ];

    const highlights = hubHighlights(entries, 5);
    const reviewed = byKind(highlights, "reviewed");
    expect(reviewed?.entry.slug).toBe("reviewed-fallback");
    expect(reviewed?.reason).toBe(
      "Metadata eyeballed by a maintainer before listing.",
    );
  });
});

describe("hubHighlights integrated fixture", () => {
  it("derives the same highlight ordering as the live hub pages fixture", () => {
    const entries = [
      entry({
        slug: "trusted",
        title: "Trusted",
        trust: "trusted",
        source: "first-party",
        dateAdded: "2026-01-05",
      }),
      entry({
        slug: "documented",
        title: "Documented",
        source: "source-backed",
        safetyNotes: "Runs local commands.",
        privacyNotes: "Reads local files.",
        reviewed: true,
        dateAdded: "2026-01-06",
      }),
      entry({
        slug: "popular",
        title: "Popular",
        source: "source-backed",
        repoStats: { stars: 42 },
        dateAdded: "2026-01-04",
      }),
      entry({
        slug: "external",
        title: "External",
        source: "external",
        dateAdded: "2026-01-03",
      }),
      entry({ slug: "newest", title: "Newest", dateAdded: "2026-01-07" }),
    ];

    expect(hubHighlights(entries).map((item) => item.entry.slug)).toEqual([
      "trusted",
      "newest",
      "documented",
      "popular",
    ]);
  });
});

describe("hubStats", () => {
  it("returns an empty breakdown for an empty set", () => {
    expect(hubStats([])).toEqual([]);
  });

  it("omits zero-count signals instead of rendering empty rows", () => {
    const sparse = [
      entry({ trust: "review", source: "external" }),
      entry({ trust: "review", source: "external" }),
    ];
    expect(hubStats(sparse)).toEqual([]);
  });

  it("counts trusted, sourced, safety, privacy, and reviewed signals", () => {
    const entries = [
      entry({
        slug: "trusted",
        trust: "trusted",
        source: "first-party",
        safetyNotes: "x",
        privacyNotes: "y",
        reviewed: true,
        dateAdded: "2026-01-05",
      }),
      entry({
        slug: "documented",
        source: "source-backed",
        safetyNotes: "Runs local commands.",
        privacyNotes: "Reads local files.",
        reviewed: true,
        dateAdded: "2026-01-06",
      }),
      entry({
        slug: "popular",
        source: "source-backed",
        repoStats: { stars: 42 },
        dateAdded: "2026-01-04",
      }),
      entry({ slug: "external", source: "external", dateAdded: "2026-01-03" }),
      entry({ slug: "newest", dateAdded: "2026-01-07" }),
    ];

    expect(hubStats(entries).map((stat) => stat.key)).toEqual(
      expect.arrayContaining([
        "trusted",
        "sourced",
        "safety",
        "privacy",
        "reviewed",
      ]),
    );
    expect(
      hubStats(entries).find((stat) => stat.key === "sourced"),
    ).toMatchObject({
      label: "Source-backed",
      count: 3,
      pct: 60,
    });
    expect(
      hubStats(entries).find((stat) => stat.key === "trusted"),
    ).toMatchObject({
      count: 1,
      pct: 20,
    });
  });

  it("rounds percentages to whole numbers", () => {
    const entries = [
      entry({ trust: "trusted", source: "first-party" }),
      entry({ trust: "review", source: "external" }),
      entry({ trust: "review", source: "external" }),
    ];
    expect(hubStats(entries).find((stat) => stat.key === "trusted")?.pct).toBe(
      33,
    );
  });
});

describe("trustPosture", () => {
  it("reports zero trusted share for an empty set", () => {
    expect(trustPosture([])).toEqual({ trusted: 0, pct: 0 });
  });

  it("computes trusted-tier share for intro copy", () => {
    const entries = [
      entry({
        trust: "trusted",
        source: "first-party",
        dateAdded: "2026-01-05",
      }),
      entry({ source: "source-backed", dateAdded: "2026-01-06" }),
      entry({
        source: "source-backed",
        repoStats: { stars: 42 },
        dateAdded: "2026-01-04",
      }),
      entry({ source: "external", dateAdded: "2026-01-03" }),
      entry({ dateAdded: "2026-01-07" }),
    ];

    expect(trustPosture(entries)).toEqual({ trusted: 1, pct: 20 });
  });

  it("returns one hundred percent when every entry is trusted", () => {
    const entries = [
      entry({ slug: "a", trust: "trusted" }),
      entry({ slug: "b", trust: "trusted" }),
    ];
    expect(trustPosture(entries)).toEqual({ trusted: 2, pct: 100 });
  });
});

describe("hub highlight reason copy", () => {
  it("uses lowercased source labels in trusted reasons", () => {
    const entries = [
      entry({
        slug: "trusted",
        trust: "trusted",
        source: "source-backed",
        dateAdded: "2026-01-01",
      }),
      entry({ slug: "filler", dateAdded: "2026-01-02" }),
    ];
    expect(byKind(hubHighlights(entries), "trusted")?.reason).toContain(
      "source-backed source",
    );
  });

  it("formats sourced provenance labels from registry constants", () => {
    const entries = [
      entry({ slug: "a", source: "source-backed", dateAdded: "2026-01-01" }),
      entry({ slug: "b", source: "first-party", dateAdded: "2026-01-02" }),
      entry({ slug: "c", source: "external", dateAdded: "2026-01-03" }),
    ];
    expect(byKind(hubHighlights(entries), "sourced")?.reason).toContain(
      "First-party provenance",
    );
  });
});
