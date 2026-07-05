import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import {
  compareBestActionBannerText,
  compareBestBannerTexts,
  compareBestDecisionBannerText,
  compareBestListInteractiveLinkLabel,
  compareBestListInteractiveSearch,
  compareBestSummary,
  shouldShowBestCompareSection,
} from "@/lib/compare-best-summary";

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

describe("compare best summary", () => {
  it("only surfaces best-list compare helpers for multi-entry tables", () => {
    expect(shouldShowBestCompareSection([])).toBe(false);
    expect(shouldShowBestCompareSection([entry()])).toBe(false);
    expect(
      shouldShowBestCompareSection([entry(), entry({ slug: "other" })]),
    ).toBe(true);
    expect(compareBestBannerTexts([entry()])).toEqual([]);
  });

  it("summarizes trust and action divergence for best-list compare sections", () => {
    const baseline = entry();
    const reviewed = entry({
      slug: "reviewed",
      reviewedBy: "maintainer",
      reviewedAt: "2026-01-02",
    });
    expect(compareBestSummary([baseline, reviewed])).toEqual({
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
      compareBestSummary([
        baseline,
        entry({ slug: "installable", installCommand: "npm i fixture" }),
      ]).hasAnyDivergence,
    ).toBe(true);
  });

  it("formats best-list decision banner copy", () => {
    expect(compareBestDecisionBannerText([entry()])).toBeNull();
    expect(
      compareBestDecisionBannerText([
        entry(),
        entry({
          slug: "reviewed",
          reviewedBy: "maintainer",
          reviewedAt: "2026-01-02",
        }),
      ]),
    ).toBe("1 trust signal differ across this comparison (Review status).");
  });

  it("formats best-list action banner copy for inline table CTAs", () => {
    expect(compareBestActionBannerText(false)).toBeNull();
    expect(compareBestActionBannerText(true)).toBe(
      "Next steps differ across picks — use the actions in the table below to copy install commands and source links per resource.",
    );
  });

  it("returns ordered best-list banner messages", () => {
    const reviewed = entry({
      slug: "reviewed",
      reviewedBy: "maintainer",
      reviewedAt: "2026-01-02",
    });
    expect(compareBestBannerTexts([entry(), reviewed])).toEqual([
      "1 trust signal differ across this comparison (Review status).",
    ]);
    expect(
      compareBestBannerTexts([
        entry(),
        entry({ slug: "installable", installCommand: "npm i fixture" }),
      ]),
    ).toEqual([
      "Next steps differ across picks — use the actions in the table below to copy install commands and source links per resource.",
    ]);
    expect(
      compareBestBannerTexts([
        entry(),
        entry({
          slug: "mixed",
          reviewedBy: "maintainer",
          reviewedAt: "2026-01-02",
          installCommand: "npm i fixture",
        }),
      ]),
    ).toEqual([
      "1 trust signal differ across this comparison (Review status).",
      "Next steps differ across picks — use the actions in the table below to copy install commands and source links per resource.",
    ]);
  });

  it("builds interactive compare links for best-list picks", () => {
    const catalog = [
      entry({ category: "skills", slug: "alpha" }),
      entry({ category: "hooks", slug: "beta" }),
    ];
    expect(
      compareBestListInteractiveSearch([{ ref: "skills/alpha" }], catalog),
    ).toBeNull();
    expect(
      compareBestListInteractiveSearch(
        [{ ref: "skills/alpha" }, { ref: "hooks/beta" }],
        catalog,
      ),
    ).toEqual({ ids: "skills/alpha,hooks/beta" });
    expect(
      compareBestListInteractiveLinkLabel(
        [{ ref: "skills/alpha" }, { ref: "hooks/beta" }],
        catalog,
      ),
    ).toBe("Open interactively");
  });
});
