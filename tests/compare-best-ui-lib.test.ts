import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import {
  compareBestHeaderBannerTexts,
  compareBestInteractiveLinkLabel,
  compareBestInteractiveSearch,
  compareBestShowCompareSection,
  compareBestUiState,
} from "@/lib/compare-best-ui-lib";

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

describe("compare best ui lib", () => {
  it("only surfaces best-list compare UI for multi-entry tables", () => {
    expect(compareBestShowCompareSection([])).toBe(false);
    expect(compareBestShowCompareSection([entry()])).toBe(false);
    expect(
      compareBestShowCompareSection([entry(), entry({ slug: "other" })]),
    ).toBe(true);
    expect(compareBestHeaderBannerTexts([entry()])).toEqual([]);
  });

  it("returns best-list header banner messages", () => {
    const reviewed = entry({
      slug: "reviewed",
      reviewedBy: "maintainer",
      reviewedAt: "2026-01-02",
    });
    expect(compareBestHeaderBannerTexts([entry(), reviewed])).toEqual([
      "1 trust signal differ across this comparison (Review status).",
    ]);
  });

  it("builds interactive compare search params for best-list pages", () => {
    expect(compareBestInteractiveSearch([entry()])).toBeNull();
    expect(
      compareBestInteractiveSearch([
        entry({ category: "skills", slug: "alpha" }),
        entry({ category: "hooks", slug: "beta" }),
      ]),
    ).toEqual({ ids: "skills/alpha,hooks/beta" });
  });

  it("formats best-list interactive link labels from entry count", () => {
    expect(compareBestInteractiveLinkLabel(2)).toBe(
      "Open in the interactive comparison tool",
    );
    expect(compareBestInteractiveLinkLabel(4)).toBe(
      "Open 4 picks in the interactive comparison tool",
    );
  });

  it("returns combined trust and action banner messages for best-list headers", () => {
    expect(
      compareBestHeaderBannerTexts([
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

  it("bundles best-list page presentation state for headers and interactive links", () => {
    expect(
      compareBestUiState([
        entry({ category: "skills", slug: "alpha" }),
        entry({ category: "hooks", slug: "beta" }),
      ]),
    ).toEqual({
      showCompareSection: true,
      bannerTexts: [],
      interactiveSearch: { ids: "skills/alpha,hooks/beta" },
      interactiveLinkLabel: "Open in the interactive comparison tool",
    });
    const entries = [
      entry({ category: "skills", slug: "alpha" }),
      entry({ category: "hooks", slug: "beta" }),
    ];
    const bundled = compareBestUiState(entries);
    expect(bundled.showCompareSection).toBe(
      compareBestShowCompareSection(entries),
    );
    expect(bundled.bannerTexts).toEqual(compareBestHeaderBannerTexts(entries));
    expect(bundled.interactiveSearch).toEqual(
      compareBestInteractiveSearch(entries),
    );
    expect(bundled.interactiveLinkLabel).toBe(
      compareBestInteractiveLinkLabel(entries.length),
    );
    expect(
      compareBestUiState([
        entry(),
        entry({
          slug: "mixed",
          reviewedBy: "maintainer",
          reviewedAt: "2026-01-02",
          installCommand: "npm i fixture",
        }),
      ]),
    ).toEqual({
      showCompareSection: true,
      bannerTexts: [
        "1 trust signal differ across this comparison (Review status).",
        "Next steps differ across picks — use the actions in the table below to copy install commands and source links per resource.",
      ],
      interactiveSearch: { ids: "mcp/fixture,mcp/mixed" },
      interactiveLinkLabel: "Open in the interactive comparison tool",
    });
  });
});
