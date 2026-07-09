import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import {
  compareDrawerPresentationActionRowDiverges,
  compareDrawerPresentationDivergingDecisionLabels,
  compareDrawerPresentationState,
} from "@/lib/compare-drawer-presentation-ui-lib";

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

describe("compare drawer presentation ui lib", () => {
  it("returns no diverging labels for uniform compared entries", () => {
    expect(compareDrawerPresentationState([entry()])).toEqual({
      divergingDecisionLabels: new Set(),
      actionRowDiverges: false,
    });
    expect(
      compareDrawerPresentationState([entry(), entry({ slug: "other" })]),
    ).toEqual({
      divergingDecisionLabels: new Set(),
      actionRowDiverges: false,
    });
  });

  it("returns an empty label set when no entries are compared", () => {
    expect(compareDrawerPresentationState([])).toEqual({
      divergingDecisionLabels: new Set(),
      actionRowDiverges: false,
    });
  });

  it("highlights diverging decision rows and next actions", () => {
    const items = [
      entry({ reviewedBy: "maintainer", reviewedAt: "2026-01-02" }),
      entry({ slug: "other", installCommand: "npm i fixture" }),
    ];
    const state = compareDrawerPresentationState(items);
    expect(state.divergingDecisionLabels).toEqual(new Set(["Review status"]));
    expect(state.actionRowDiverges).toBe(true);
    expect(state.divergingDecisionLabels).toEqual(
      compareDrawerPresentationDivergingDecisionLabels(items),
    );
    expect(state.actionRowDiverges).toBe(
      compareDrawerPresentationActionRowDiverges(items),
    );
  });
});
