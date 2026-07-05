import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import { compareTableInteractiveUiState } from "@/lib/compare-table-interactive-ui-lib";

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

describe("compare table interactive ui lib", () => {
  it("hides next-action rows for single-entry tables", () => {
    expect(compareTableInteractiveUiState([entry()], true)).toEqual({
      divergingDecisionLabels: new Set(),
      renderNextActions: false,
      actionRowDiverges: false,
      actionCells: [expect.objectContaining({ entryKey: "mcp:fixture" })],
    });
  });

  it("bundles per-column action cells for multi-entry tables", () => {
    const state = compareTableInteractiveUiState(
      [entry(), entry({ slug: "other" })],
      true,
    );
    expect(state.renderNextActions).toBe(true);
    expect(state.actionCells).toHaveLength(2);
    expect(state.actionCells[0]).toEqual(
      expect.objectContaining({ entryKey: "mcp:fixture" }),
    );
  });

  it("respects the showNextActions toggle for multi-entry tables", () => {
    expect(
      compareTableInteractiveUiState(
        [entry(), entry({ slug: "other" })],
        false,
      ),
    ).toEqual({
      divergingDecisionLabels: new Set(),
      renderNextActions: false,
      actionRowDiverges: false,
      actionCells: expect.any(Array),
    });
  });

  it("highlights diverging decision rows and next actions", () => {
    const state = compareTableInteractiveUiState(
      [
        entry({ reviewedBy: "maintainer", reviewedAt: "2026-01-02" }),
        entry({ slug: "other", installCommand: "npm i fixture" }),
      ],
      true,
    );
    expect(state.divergingDecisionLabels).toEqual(new Set(["Review status"]));
    expect(state.renderNextActions).toBe(true);
    expect(state.actionRowDiverges).toBe(true);
    expect(state.actionCells).toHaveLength(2);
  });
});
