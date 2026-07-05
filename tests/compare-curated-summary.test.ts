import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import {
  compareCuratedActionBannerText,
  compareCuratedBannerTexts,
  compareCuratedDecisionBannerText,
  compareCuratedSummary,
} from "@/lib/compare-curated-summary";

function entry(overrides: Partial<Entry> = {}): Entry {
  return {
    category: "mcp",
    slug: "fixture",
    title: "Fixture",
    description: "Fixture description",
    author: "Author",
    tags: [],
    platforms: ["claude-code"],
    installType: "manual",
    trust: "review",
    source: "unverified",
    dateAdded: "2026-01-01",
    ...overrides,
  } as Entry;
}

describe("compare curated summary", () => {
  it("combines decision and action divergence for curated comparison pages", () => {
    const baseline = entry();
    const reviewed = entry({
      reviewedBy: "maintainer",
      reviewedAt: "2026-01-02",
    });
    expect(compareCuratedSummary([baseline])).toEqual({
      comparedCount: 1,
      decision: {
        comparedCount: 1,
        divergingCount: 0,
        divergingLabels: [],
      },
      actionsDiverge: false,
      hasAnyDivergence: false,
    });
    expect(compareCuratedSummary([baseline, reviewed])).toEqual({
      comparedCount: 2,
      decision: {
        comparedCount: 2,
        divergingCount: 1,
        divergingLabels: ["Review status"],
      },
      actionsDiverge: false,
      hasAnyDivergence: true,
    });
    expect(
      compareCuratedSummary([
        baseline,
        entry({ installCommand: "npm i fixture" }),
      ]).hasAnyDivergence,
    ).toBe(true);
  });

  it("formats decision divergence banner copy for curated headers", () => {
    expect(
      compareCuratedDecisionBannerText({
        comparedCount: 2,
        divergingCount: 0,
        divergingLabels: [],
      }),
    ).toBeNull();
    expect(
      compareCuratedDecisionBannerText({
        comparedCount: 2,
        divergingCount: 1,
        divergingLabels: ["Review status"],
      }),
    ).toBe("1 trust signal differ across this comparison (Review status).");
    expect(
      compareCuratedDecisionBannerText({
        comparedCount: 3,
        divergingCount: 2,
        divergingLabels: ["Review status", "Package trust"],
      }),
    ).toBe(
      "2 trust signals differ across this comparison (Review status, Package trust).",
    );
  });

  it("formats action divergence banner copy for curated headers", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
    expect(compareCuratedActionBannerText(true)).toBe(
      "Next steps differ across entries — open the interactive comparison to copy install commands and source links per resource.",
    );
  });

  it("returns ordered banner messages for curated comparison headers", () => {
    const reviewed = entry({
      reviewedBy: "maintainer",
      reviewedAt: "2026-01-02",
    });
    expect(compareCuratedBannerTexts([entry(), reviewed])).toEqual([
      "1 trust signal differ across this comparison (Review status).",
    ]);
    expect(
      compareCuratedBannerTexts([
        entry(),
        entry({ installCommand: "npm i fixture" }),
      ]),
    ).toEqual([
      "Next steps differ across entries — open the interactive comparison to copy install commands and source links per resource.",
    ]);
    expect(compareCuratedBannerTexts([entry()])).toEqual([]);
  });
});
