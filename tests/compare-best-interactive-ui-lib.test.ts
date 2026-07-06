import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import {
  compareBestInteractiveShowCompareSection,
  compareBestInteractiveUiState,
} from "@/lib/compare-best-interactive-ui-lib";

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

describe("compare best interactive ui lib", () => {
  it("hides compare UI for single-entry best lists", () => {
    expect(compareBestInteractiveUiState([entry()])).toEqual({
      showCompareSection: false,
      bannerTexts: [],
      interactiveSearch: null,
      interactiveLinkLabel: "Open 1 picks in the interactive comparison tool",
    });
    expect(compareBestInteractiveShowCompareSection([entry()])).toBe(false);
  });

  it("bundles best-list page presentation state for headers and interactive links", () => {
    expect(
      compareBestInteractiveUiState([
        entry({ category: "skills", slug: "alpha" }),
        entry({ category: "hooks", slug: "beta" }),
      ]),
    ).toEqual({
      showCompareSection: true,
      bannerTexts: [],
      interactiveSearch: { ids: "skills/alpha,hooks/beta" },
      interactiveLinkLabel: "Open in the interactive comparison tool",
    });
    expect(
      compareBestInteractiveShowCompareSection([
        entry({ category: "skills", slug: "alpha" }),
        entry({ category: "hooks", slug: "beta" }),
      ]),
    ).toBe(true);
    const entries = [
      entry({ category: "skills", slug: "alpha" }),
      entry({ category: "hooks", slug: "beta" }),
    ];
    const bundled = compareBestInteractiveUiState(entries);
    expect(bundled.showCompareSection).toBe(
      compareBestInteractiveShowCompareSection(entries),
    );
  });

  it("surfaces divergence banners for multi-entry best lists", () => {
    expect(
      compareBestInteractiveUiState([
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
