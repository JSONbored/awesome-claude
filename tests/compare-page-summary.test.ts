import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import {
  COMPARE_PAGE_SURFACE,
  comparePageActionBannerText,
  comparePageBannerTexts,
  comparePageDecisionBannerText,
  comparePageDecisionSummary,
  comparePageSummary,
} from "@/lib/compare-page-summary";

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

describe("compare page summary", () => {
  it("exposes the compare page analytics surface id", () => {
    expect(COMPARE_PAGE_SURFACE).toBe("compare-page");
  });

  it("mirrors decision summaries for interactive compare headers", () => {
    const baseline = entry();
    const reviewed = entry({
      reviewedBy: "maintainer",
      reviewedAt: "2026-01-02",
    });
    expect(comparePageDecisionSummary([baseline])).toEqual({
      comparedCount: 1,
      divergingCount: 0,
      divergingLabels: [],
    });
    expect(comparePageDecisionSummary([baseline, reviewed])).toEqual({
      comparedCount: 2,
      divergingCount: 1,
      divergingLabels: ["Review status"],
    });
  });

  it("combines trust and action divergence for page summaries", () => {
    const baseline = entry();
    const reviewed = entry({
      reviewedBy: "maintainer",
      reviewedAt: "2026-01-02",
    });
    expect(comparePageSummary([baseline])).toEqual({
      comparedCount: 1,
      decision: {
        comparedCount: 1,
        divergingCount: 0,
        divergingLabels: [],
      },
      actionsDiverge: false,
      hasAnyDivergence: false,
    });
    expect(comparePageSummary([baseline, reviewed])).toEqual({
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
      comparePageSummary([baseline, entry({ installCommand: "npm i fixture" })])
        .hasAnyDivergence,
    ).toBe(true);
  });

  it("formats page decision banner copy", () => {
    expect(comparePageDecisionBannerText([entry()])).toBeNull();
    expect(
      comparePageDecisionBannerText([
        entry(),
        entry({ reviewedBy: "maintainer", reviewedAt: "2026-01-02" }),
      ]),
    ).toBe("1 trust signal differ across this comparison (Review status).");
  });

  it("formats page action banner copy for inline table CTAs", () => {
    expect(comparePageActionBannerText(false)).toBeNull();
    expect(comparePageActionBannerText(true)).toBe(
      "Next steps differ across this comparison — review install, source, and claim actions in the table below.",
    );
  });

  it("returns ordered page header banner messages", () => {
    const reviewed = entry({
      reviewedBy: "maintainer",
      reviewedAt: "2026-01-02",
    });
    expect(comparePageBannerTexts([entry(), reviewed])).toEqual([
      "1 trust signal differ across this comparison (Review status).",
    ]);
    expect(
      comparePageBannerTexts([
        entry(),
        entry({ installCommand: "npm i fixture" }),
      ]),
    ).toEqual([
      "Next steps differ across this comparison — review install, source, and claim actions in the table below.",
    ]);
  });
});
