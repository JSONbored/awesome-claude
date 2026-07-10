import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import {
  compareTableActionsForEntry,
  compareTableActionsInteractiveActionCells,
  compareTableActionsInteractiveActionRowDiverges,
  compareTableActionsInteractiveRenderNextActions,
  compareTableActionsInteractiveUiState,
} from "@/lib/compare-table-actions-interactive-ui-lib";

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

describe("compare table actions interactive ui lib", () => {
  it("hides next-action rows for single-entry tables", () => {
    const state = compareTableActionsInteractiveUiState([entry()], true);
    expect(state).toEqual({
      renderNextActions: false,
      actionRowDiverges: false,
      actionCells: [expect.objectContaining({ entryKey: "mcp:fixture" })],
    });
    expect(
      compareTableActionsForEntry(entry(), state.actionCells).map((a) => a.id),
    ).toEqual(["dossier", "claim"]);
  });

  it("respects the showNextActions toggle for multi-entry tables", () => {
    const entries = [entry(), entry({ slug: "other" })];
    expect(compareTableActionsInteractiveUiState(entries, false)).toEqual({
      renderNextActions: false,
      actionRowDiverges: false,
      actionCells: expect.any(Array),
    });
    expect(compareTableActionsInteractiveUiState(entries, true)).toEqual({
      renderNextActions: true,
      actionRowDiverges: false,
      actionCells: [
        expect.objectContaining({ entryKey: "mcp:fixture" }),
        expect.objectContaining({ entryKey: "mcp:other" }),
      ],
    });
  });

  it("returns an empty action list when no bundled cell matches the entry", () => {
    expect(compareTableActionsForEntry(entry({ slug: "missing" }), [])).toEqual(
      [],
    );
  });

  it("highlights diverging next-action rows when enabled for mixed columns", () => {
    const entries = [
      entry({ installCommand: "npm i fixture" }),
      entry({ slug: "other" }),
    ];
    const state = compareTableActionsInteractiveUiState(entries, true);
    expect(state.renderNextActions).toBe(true);
    expect(state.actionRowDiverges).toBe(true);
    expect(state.actionCells).toHaveLength(2);
    expect(state.renderNextActions).toBe(
      compareTableActionsInteractiveRenderNextActions(entries, true),
    );
    expect(state.actionRowDiverges).toBe(
      compareTableActionsInteractiveActionRowDiverges(entries, true),
    );
    expect(state.actionCells).toEqual(
      compareTableActionsInteractiveActionCells(entries),
    );
  });
});
