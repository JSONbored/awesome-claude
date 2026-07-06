import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import { compareDrawerUiInteractiveUiState } from "@/lib/compare-drawer-ui-interactive-ui-lib";

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

describe("compare drawer ui interactive ui lib", () => {
  it("bundles drawer header banners and full-view search for empty selections", () => {
    expect(compareDrawerUiInteractiveUiState([])).toEqual({
      actionRowDiverges: false,
      bannerTexts: [],
      fullViewSearch: null,
      divergingDecisionLabels: new Set(),
    });
  });

  it("surfaces full-view search params for multi-item drawer selections", () => {
    expect(
      compareDrawerUiInteractiveUiState([
        entry({ category: "skills", slug: "alpha" }),
        entry({ category: "hooks", slug: "beta" }),
      ]),
    ).toEqual({
      actionRowDiverges: false,
      bannerTexts: [],
      fullViewSearch: { ids: "skills/alpha,hooks/beta" },
      divergingDecisionLabels: new Set(),
    });
  });

  it("highlights diverging decision rows and next actions", () => {
    const state = compareDrawerUiInteractiveUiState([
      entry({ reviewedBy: "maintainer", reviewedAt: "2026-01-02" }),
      entry({ slug: "other", installCommand: "npm i fixture" }),
    ]);
    expect(state.divergingDecisionLabels).toEqual(new Set(["Review status"]));
    expect(state.actionRowDiverges).toBe(true);
  });
});
