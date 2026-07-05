import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import { compareDrawerInteractiveUiState } from "@/lib/compare-drawer-interactive-ui-lib";

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

describe("compare drawer interactive ui lib", () => {
  it("bundles drawer presentation, empty hint, and share URL state", () => {
    expect(compareDrawerInteractiveUiState([])).toEqual({
      drawerUi: {
        actionRowDiverges: false,
        bannerTexts: [],
        fullViewSearch: null,
      },
      emptyHint: expect.stringContaining("Compare"),
      shareUrl: "/browse",
      divergingDecisionLabels: new Set(),
      actionRowDiverges: false,
      actionCells: [],
    });
  });

  it("surfaces full-view search and share URLs for multi-item selections", () => {
    const state = compareDrawerInteractiveUiState([
      entry({ category: "skills", slug: "alpha" }),
      entry({ category: "hooks", slug: "beta" }),
    ]);
    expect(state.drawerUi.fullViewSearch).toEqual({
      ids: "skills/alpha,hooks/beta",
    });
    expect(state.shareUrl).toBe(
      "/browse?compare=skills%2Falpha%2Chooks%2Fbeta",
    );
    expect(state.actionCells).toHaveLength(2);
    expect(state.actionCells[0]).toEqual(
      expect.objectContaining({ entryKey: "skills:alpha" }),
    );
  });

  it("highlights diverging decision rows and next actions", () => {
    const state = compareDrawerInteractiveUiState([
      entry({ reviewedBy: "maintainer", reviewedAt: "2026-01-02" }),
      entry({ slug: "other", installCommand: "npm i fixture" }),
    ]);
    expect(state.divergingDecisionLabels).toEqual(new Set(["Review status"]));
    expect(state.actionRowDiverges).toBe(true);
    expect(state.actionCells).toHaveLength(2);
  });
});
