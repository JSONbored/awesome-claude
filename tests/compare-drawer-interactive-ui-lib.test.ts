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
  });

  it("highlights diverging next actions in bundled drawer state", () => {
    expect(
      compareDrawerInteractiveUiState([
        entry({ installCommand: "npm i fixture" }),
        entry({ slug: "other" }),
      ]).drawerUi.actionRowDiverges,
    ).toBe(true);
  });
});
