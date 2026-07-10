import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import {
  compareDrawerPresentationUiInteractivePresentationState,
  compareDrawerPresentationUiInteractiveUiState,
} from "@/lib/compare-drawer-presentation-ui-interactive-ui-lib";

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

describe("compare drawer presentation ui interactive ui lib", () => {
  it("returns no diverging labels for uniform compared entries", () => {
    expect(compareDrawerPresentationUiInteractiveUiState([entry()])).toEqual({
      divergingDecisionLabels: new Set(),
      actionRowDiverges: false,
    });
  });

  it("highlights diverging decision rows and next actions", () => {
    const state = compareDrawerPresentationUiInteractiveUiState([
      entry({ reviewedBy: "maintainer", reviewedAt: "2026-01-02" }),
      entry({ slug: "other", installCommand: "npm i fixture" }),
    ]);
    expect(state.divergingDecisionLabels).toEqual(new Set(["Review status"]));
    expect(state.actionRowDiverges).toBe(true);
    const items = [
      entry({ reviewedBy: "maintainer", reviewedAt: "2026-01-02" }),
      entry({ slug: "other", installCommand: "npm i fixture" }),
    ];
    expect(state).toEqual(
      compareDrawerPresentationUiInteractivePresentationState(items),
    );
  });
});
