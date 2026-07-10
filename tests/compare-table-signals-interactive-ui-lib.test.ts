import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import {
  compareTableSignalsInteractiveDivergingDecisionLabels,
  compareTableSignalsInteractiveUiState,
} from "@/lib/compare-table-signals-interactive-ui-lib";

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

describe("compare table signals interactive ui lib", () => {
  it("returns no diverging decision labels for uniform compared entries", () => {
    expect(compareTableSignalsInteractiveUiState([entry()])).toEqual({
      divergingDecisionLabels: new Set(),
    });
    expect(
      compareTableSignalsInteractiveUiState([
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
    const state = compareTableSignalsInteractiveUiState(entries);
    expect(state).toEqual({
      divergingDecisionLabels: new Set(["Review status"]),
    });
    expect(state.divergingDecisionLabels).toEqual(
      compareTableSignalsInteractiveDivergingDecisionLabels(entries),
    );
  });

  it("returns an empty label set when no entries are compared", () => {
    expect(compareTableSignalsInteractiveUiState([])).toEqual({
      divergingDecisionLabels: new Set(),
    });
  });
});
