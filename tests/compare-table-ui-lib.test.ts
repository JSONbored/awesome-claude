import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import {
  compareTablePresentationActionRowDiverges,
  compareTablePresentationDivergingDecisionLabels,
  compareTablePresentationRenderNextActions,
  compareTablePresentationState,
} from "@/lib/compare-table-ui-lib";

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

describe("compare table ui lib", () => {
  it("hides next-action rows for single-entry tables", () => {
    expect(compareTablePresentationState([entry()], true)).toEqual({
      divergingDecisionLabels: new Set(),
      renderNextActions: false,
      actionRowDiverges: false,
    });
  });

  it("surfaces next-action rows for multi-entry tables when enabled", () => {
    expect(
      compareTablePresentationState([entry(), entry({ slug: "other" })], true),
    ).toEqual({
      divergingDecisionLabels: new Set(),
      renderNextActions: true,
      actionRowDiverges: false,
    });
  });

  it("respects the showNextActions toggle for multi-entry tables", () => {
    expect(
      compareTablePresentationState([entry(), entry({ slug: "other" })], false),
    ).toEqual({
      divergingDecisionLabels: new Set(),
      renderNextActions: false,
      actionRowDiverges: false,
    });
  });

  it("highlights diverging decision rows and next actions", () => {
    const entries = [
      entry({ reviewedBy: "maintainer", reviewedAt: "2026-01-02" }),
      entry({ slug: "other", installCommand: "npm i fixture" }),
    ];
    const state = compareTablePresentationState(entries, true);
    expect(state.divergingDecisionLabels).toEqual(new Set(["Review status"]));
    expect(state.renderNextActions).toBe(true);
    expect(state.actionRowDiverges).toBe(true);
    expect(state.divergingDecisionLabels).toEqual(
      compareTablePresentationDivergingDecisionLabels(entries),
    );
    expect(state.renderNextActions).toBe(
      compareTablePresentationRenderNextActions(entries, true),
    );
    expect(state.actionRowDiverges).toBe(
      compareTablePresentationActionRowDiverges(entries, true),
    );
  });
});
