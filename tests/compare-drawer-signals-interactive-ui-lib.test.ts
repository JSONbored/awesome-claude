import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import {
  compareDrawerSignalsInteractiveDivergingDecisionLabels,
  compareDrawerSignalsInteractiveUiState,
} from "@/lib/compare-drawer-signals-interactive-ui-lib";

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

describe("compare drawer signals interactive ui lib", () => {
  it("returns no diverging decision labels for uniform compared entries", () => {
    expect(compareDrawerSignalsInteractiveUiState([entry()])).toEqual({
      divergingDecisionLabels: new Set(),
    });
    expect(
      compareDrawerSignalsInteractiveUiState([
        entry(),
        entry({ slug: "other" }),
      ]),
    ).toEqual({
      divergingDecisionLabels: new Set(),
    });
  });

  it("highlights diverging review status decision rows", () => {
    const entries = [
      entry(),
      entry({ reviewedBy: "maintainer", reviewedAt: "2026-01-02" }),
    ];
    const state = compareDrawerSignalsInteractiveUiState(entries);
    expect(state).toEqual({
      divergingDecisionLabels: new Set(["Review status"]),
    });
    expect(state.divergingDecisionLabels).toEqual(
      compareDrawerSignalsInteractiveDivergingDecisionLabels(entries),
    );
  });

  it("returns an empty label set when no entries are compared", () => {
    expect(compareDrawerSignalsInteractiveUiState([])).toEqual({
      divergingDecisionLabels: new Set(),
    });
  });
});
