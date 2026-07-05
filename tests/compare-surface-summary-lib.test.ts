import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import {
  compareSurfaceBannerTexts,
  compareSurfaceDecisionBannerText,
  compareSurfaceDecisionSummary,
  compareSurfaceSummary,
} from "@/lib/compare-surface-summary-lib";

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

describe("compare surface summary lib", () => {
  it("mirrors decision summaries for compare surface headers", () => {
    const baseline = entry();
    const reviewed = entry({
      reviewedBy: "maintainer",
      reviewedAt: "2026-01-02",
    });
    expect(compareSurfaceDecisionSummary([baseline])).toEqual({
      comparedCount: 1,
      divergingCount: 0,
      divergingLabels: [],
    });
    expect(compareSurfaceDecisionSummary([baseline, reviewed])).toEqual({
      comparedCount: 2,
      divergingCount: 1,
      divergingLabels: ["Review status"],
    });
  });

  it("combines trust and action divergence for surface summaries", () => {
    const baseline = entry();
    const reviewed = entry({
      reviewedBy: "maintainer",
      reviewedAt: "2026-01-02",
    });
    expect(compareSurfaceSummary([baseline])).toEqual({
      comparedCount: 1,
      decision: {
        comparedCount: 1,
        divergingCount: 0,
        divergingLabels: [],
      },
      actionsDiverge: false,
      hasAnyDivergence: false,
    });
    expect(compareSurfaceSummary([baseline, reviewed])).toEqual({
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
      compareSurfaceSummary([
        baseline,
        entry({ installCommand: "npm i fixture" }),
      ]).hasAnyDivergence,
    ).toBe(true);
  });

  it("formats surface decision banner copy", () => {
    expect(compareSurfaceDecisionBannerText([entry()])).toBeNull();
    expect(
      compareSurfaceDecisionBannerText([
        entry(),
        entry({ reviewedBy: "maintainer", reviewedAt: "2026-01-02" }),
      ]),
    ).toBe("1 trust signal differ across this comparison (Review status).");
  });

  it("returns ordered banner messages with optional action copy", () => {
    const reviewed = entry({
      reviewedBy: "maintainer",
      reviewedAt: "2026-01-02",
    });
    expect(compareSurfaceBannerTexts([entry(), reviewed], null)).toEqual([
      "1 trust signal differ across this comparison (Review status).",
    ]);
    expect(compareSurfaceBannerTexts([entry()], null)).toEqual([]);
    expect(
      compareSurfaceBannerTexts(
        [entry()],
        "Next steps differ across this comparison.",
      ),
    ).toEqual(["Next steps differ across this comparison."]);
    expect(
      compareSurfaceBannerTexts(
        [entry(), reviewed],
        "Next steps differ across this comparison.",
      ),
    ).toEqual([
      "1 trust signal differ across this comparison (Review status).",
      "Next steps differ across this comparison.",
    ]);
  });
});
