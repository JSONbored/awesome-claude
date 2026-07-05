import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import { compareTableUiInteractiveUiState } from "@/lib/compare-table-ui-interactive-ui-lib";

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

describe("compare table ui interactive ui lib", () => {
  it("hides next-action rows for single-entry tables", () => {
    expect(compareTableUiInteractiveUiState([entry()], true)).toEqual({
      divergingDecisionLabels: new Set(),
      renderNextActions: false,
      actionRowDiverges: false,
    });
  });

  it("respects the showNextActions toggle for multi-entry tables", () => {
    const entries = [entry(), entry({ slug: "other" })];
    expect(compareTableUiInteractiveUiState(entries, false)).toEqual({
      divergingDecisionLabels: new Set(),
      renderNextActions: false,
      actionRowDiverges: false,
    });
    expect(compareTableUiInteractiveUiState(entries, true)).toEqual({
      divergingDecisionLabels: new Set(),
      renderNextActions: true,
      actionRowDiverges: false,
    });
  });

  it("highlights diverging decision rows and next actions", () => {
    const state = compareTableUiInteractiveUiState(
      [
        entry({ reviewedBy: "maintainer", reviewedAt: "2026-01-02" }),
        entry({ slug: "other", installCommand: "npm i fixture" }),
      ],
      true,
    );
    expect(state.divergingDecisionLabels).toEqual(new Set(["Review status"]));
    expect(state.renderNextActions).toBe(true);
    expect(state.actionRowDiverges).toBe(true);
  });
});
