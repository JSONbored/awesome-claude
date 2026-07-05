import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import {
  BROWSE_COMPARE_MIN_ITEMS,
  browseCompareHintText,
  browseCompareOverflowHint,
  browseCompareSelectedEntries,
  browseCompareSummary,
  browseCompareUiState,
  shouldShowBrowseCompareHint,
} from "@/lib/compare-browse-summary";

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

describe("compare browse summary", () => {
  it("requires at least two selected entries before showing browse compare hints", () => {
    expect(BROWSE_COMPARE_MIN_ITEMS).toBe(2);
    expect(shouldShowBrowseCompareHint([])).toBe(false);
    expect(shouldShowBrowseCompareHint([entry()])).toBe(false);
    expect(
      shouldShowBrowseCompareHint([entry(), entry({ slug: "other" })]),
    ).toBe(true);
    expect(browseCompareHintText([entry()])).toBeNull();
  });

  it("summarizes browse selection divergence via curated compare helpers", () => {
    const baseline = entry();
    const reviewed = entry({
      slug: "reviewed",
      reviewedBy: "maintainer",
      reviewedAt: "2026-01-02",
    });
    expect(browseCompareSummary([baseline, reviewed])).toEqual({
      comparedCount: 2,
      decision: {
        comparedCount: 2,
        divergingCount: 1,
        divergingLabels: ["Review status"],
      },
      actionsDiverge: false,
      hasAnyDivergence: true,
    });
  });

  it("prompts users to open compare when selected entries align on decision signals", () => {
    expect(browseCompareHintText([entry(), entry({ slug: "other" })])).toBe(
      "Open compare to review trust and next steps side by side.",
    );
  });

  it("highlights trust divergence in compact browse hints", () => {
    expect(
      browseCompareHintText([
        entry(),
        entry({
          slug: "reviewed",
          reviewedBy: "maintainer",
          reviewedAt: "2026-01-02",
        }),
      ]),
    ).toBe("1 trust signal differ — open compare for details.");
  });

  it("highlights action divergence in compact browse hints", () => {
    expect(
      browseCompareHintText([
        entry(),
        entry({ slug: "installable", installCommand: "npm i fixture" }),
      ]),
    ).toBe("next steps differ — open compare for details.");
  });

  it("uses plural trust signal copy when multiple rows diverge", () => {
    expect(
      browseCompareHintText([
        entry(),
        entry({
          slug: "reviewed",
          reviewedBy: "maintainer",
          reviewedAt: "2026-01-02",
          packageVerified: true,
        }),
      ]),
    ).toBe("2 trust signals differ — open compare for details.");
  });

  it("combines trust and action divergence in browse hints", () => {
    expect(
      browseCompareHintText([
        entry(),
        entry({
          slug: "mixed",
          reviewedBy: "maintainer",
          reviewedAt: "2026-01-02",
          installCommand: "npm i fixture",
        }),
      ]),
    ).toBe(
      "1 trust signal differ · next steps differ — open compare for details.",
    );
  });

  it("caps browse compare hints and links to the interactive compare limit", () => {
    const five = [
      entry({ slug: "one" }),
      entry({ slug: "two" }),
      entry({ slug: "three" }),
      entry({ slug: "four" }),
      entry({
        slug: "five",
        reviewedBy: "maintainer",
        reviewedAt: "2026-01-02",
      }),
    ];
    expect(browseCompareSelectedEntries(five)).toHaveLength(4);
    expect(browseCompareOverflowHint(5, 4)).toBe(
      "Opening 4 of 5 selected in compare.",
    );
    expect(browseCompareOverflowHint(2, 2)).toBeNull();
    expect(browseCompareHintText(five)).toBe(
      "Open compare to review trust and next steps side by side.",
    );
    expect(browseCompareUiState(five)).toEqual({
      search: { ids: "mcp/one,mcp/two,mcp/three,mcp/four" },
      selectedCount: 4,
      hint: "Open compare to review trust and next steps side by side.",
      overflowHint: "Opening 4 of 5 selected in compare.",
    });
    expect(browseCompareUiState([entry()])).toBeNull();
  });
});
