import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import {
  compareDrawerActionBannerText,
  compareDrawerBannerTexts,
  compareDrawerDecisionBannerText,
  compareDrawerDecisionSummary,
  compareDrawerSummary,
} from "@/lib/compare-drawer-summary";

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

describe("compare drawer summary", () => {
  it("mirrors decision summaries for drawer header hints", () => {
    const baseline = entry();
    const reviewed = entry({
      reviewedBy: "maintainer",
      reviewedAt: "2026-01-02",
    });
    expect(compareDrawerDecisionSummary([baseline])).toEqual({
      comparedCount: 1,
      divergingCount: 0,
      divergingLabels: [],
    });
    expect(compareDrawerDecisionSummary([baseline, reviewed])).toEqual({
      comparedCount: 2,
      divergingCount: 1,
      divergingLabels: ["Review status"],
    });
  });

  it("combines trust and action divergence for drawer summaries", () => {
    const baseline = entry();
    const reviewed = entry({
      reviewedBy: "maintainer",
      reviewedAt: "2026-01-02",
    });
    expect(compareDrawerSummary([baseline])).toEqual({
      comparedCount: 1,
      decision: {
        comparedCount: 1,
        divergingCount: 0,
        divergingLabels: [],
      },
      actionsDiverge: false,
      hasAnyDivergence: false,
    });
    expect(compareDrawerSummary([baseline, reviewed])).toEqual({
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
      compareDrawerSummary([
        baseline,
        entry({ installCommand: "npm i fixture" }),
      ]).hasAnyDivergence,
    ).toBe(true);
  });

  it("formats drawer decision banner copy", () => {
    expect(compareDrawerDecisionBannerText([entry()])).toBeNull();
    expect(
      compareDrawerDecisionBannerText([
        entry(),
        entry({ reviewedBy: "maintainer", reviewedAt: "2026-01-02" }),
      ]),
    ).toBe("1 trust signal differ across this comparison (Review status).");
  });

  it("formats drawer action banner copy", () => {
    expect(compareDrawerActionBannerText(false)).toBeNull();
    expect(compareDrawerActionBannerText(true)).toBe(
      "Next steps differ across this comparison — review install, source, and claim actions per entry.",
    );
  });

  it("returns ordered drawer header banner messages", () => {
    const reviewed = entry({
      reviewedBy: "maintainer",
      reviewedAt: "2026-01-02",
    });
    expect(compareDrawerBannerTexts([entry(), reviewed])).toEqual([
      "1 trust signal differ across this comparison (Review status).",
    ]);
    expect(
      compareDrawerBannerTexts([
        entry(),
        entry({ installCommand: "npm i fixture" }),
      ]),
    ).toEqual([
      "Next steps differ across this comparison — review install, source, and claim actions per entry.",
    ]);
    expect(
      compareDrawerBannerTexts([
        entry(),
        entry({
          reviewedBy: "maintainer",
          reviewedAt: "2026-01-02",
          installCommand: "npm i fixture",
        }),
      ]),
    ).toEqual([
      "1 trust signal differ across this comparison (Review status).",
      "Next steps differ across this comparison — review install, source, and claim actions per entry.",
    ]);
  });
});
