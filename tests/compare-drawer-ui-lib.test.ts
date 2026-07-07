import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import {
  compareDrawerEmptyStateHint,
  compareDrawerFullViewSearch,
  compareDrawerHeaderBannerTexts,
  compareDrawerShareUrl,
  compareDrawerUiActionsDiverge,
  compareDrawerUiState,
} from "@/lib/compare-drawer-ui-lib";

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

describe("compare drawer ui lib", () => {
  it("builds browse share URLs for drawer copy-link actions", () => {
    expect(compareDrawerShareUrl([])).toBe("/browse");
    expect(
      compareDrawerShareUrl([
        entry({ category: "skills", slug: "alpha" }),
        entry({ category: "hooks", slug: "beta" }),
      ]),
    ).toBe("/browse?compare=skills%2Falpha%2Chooks%2Fbeta");
  });

  it("builds capped full-view compare search params for drawer CTAs", () => {
    expect(compareDrawerFullViewSearch([])).toBeNull();
    expect(compareDrawerFullViewSearch([entry()])).toEqual({
      ids: "mcp/fixture",
    });
    expect(
      compareDrawerFullViewSearch([
        entry({ slug: "one" }),
        entry({ slug: "two" }),
        entry({ slug: "three" }),
        entry({ slug: "four" }),
        entry({ slug: "five" }),
      ]),
    ).toEqual({ ids: "mcp/one,mcp/two,mcp/three,mcp/four" });
  });

  it("returns drawer header banner messages from drawer summaries", () => {
    const reviewed = entry({
      slug: "reviewed",
      reviewedBy: "maintainer",
      reviewedAt: "2026-01-02",
    });
    expect(compareDrawerHeaderBannerTexts([entry(), reviewed])).toEqual([
      "1 trust signal differ across this comparison (Review status).",
    ]);
  });

  it("guides empty drawer readers to add resources from cards", () => {
    expect(compareDrawerEmptyStateHint()).toBe(
      "Add resources to compare by tapping the Compare button on any card.",
    );
  });

  it("returns combined trust and action banner messages for drawer headers", () => {
    expect(
      compareDrawerHeaderBannerTexts([
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
      "Next steps differ across this comparison — review install, source, and claim actions per entry.",
    ]);
  });

  it("bundles drawer presentation state for banners, actions, and full-view links", () => {
    const entries = [
      entry({ reviewedBy: "maintainer", reviewedAt: "2026-01-02" }),
      entry({ slug: "other", installCommand: "npm i fixture" }),
    ];
    expect(compareDrawerUiState([])).toEqual({
      actionRowDiverges: false,
      bannerTexts: [],
      fullViewSearch: null,
    });
    expect(compareDrawerUiState(entries)).toEqual({
      actionRowDiverges: true,
      bannerTexts: [
        "1 trust signal differ across this comparison (Review status).",
        "Next steps differ across this comparison — review install, source, and claim actions per entry.",
      ],
      fullViewSearch: { ids: "mcp/fixture,mcp/other" },
    });
    const bundled = compareDrawerUiState(entries);
    expect(bundled.actionRowDiverges).toBe(
      compareDrawerUiActionsDiverge(entries),
    );
    expect(bundled.fullViewSearch).toEqual(
      compareDrawerFullViewSearch(entries),
    );
    expect(bundled.bannerTexts).toEqual(
      compareDrawerHeaderBannerTexts(entries),
    );
  });
});
