import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import {
  comparePageUiInteractiveActionRowDiverges,
  comparePageUiInteractiveUiState,
} from "@/lib/compare-page-ui-interactive-ui-lib";

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

describe("compare page ui interactive ui lib", () => {
  it("bundles compare page header banners, share URL, and selection hints", () => {
    expect(
      comparePageUiInteractiveUiState([
        entry({ category: "skills", slug: "alpha" }),
        entry({ category: "hooks", slug: "beta" }),
      ]),
    ).toEqual({
      actionRowDiverges: false,
      bannerTexts: [],
      singleItemHint: null,
      shareUrl: "/compare?ids=skills%2Falpha%2Chooks%2Fbeta",
    });
  });

  it("surfaces single-item selection hints for one-entry comparisons", () => {
    expect(comparePageUiInteractiveUiState([entry()]).singleItemHint).toContain(
      "Add one more resource",
    );
  });

  it("highlights diverging next actions in bundled page presentation state", () => {
    const items = [
      entry({ installCommand: "npm i fixture" }),
      entry({ slug: "other" }),
    ];
    const state = comparePageUiInteractiveUiState(items);
    expect(state.actionRowDiverges).toBe(true);
    expect(state.actionRowDiverges).toBe(
      comparePageUiInteractiveActionRowDiverges(items),
    );
  });
});
