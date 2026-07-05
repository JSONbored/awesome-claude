import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import {
  comparePageActionsForEntry,
  comparePageActionsInteractiveUiState,
} from "@/lib/compare-page-actions-interactive-ui-lib";

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

describe("compare page actions interactive ui lib", () => {
  it("bundles per-column action cells for a single compared entry", () => {
    const state = comparePageActionsInteractiveUiState([entry()]);
    expect(state.actionRowDiverges).toBe(false);
    expect(state.actionCells).toEqual([
      {
        entryKey: "mcp:fixture",
        actions: expect.arrayContaining([
          expect.objectContaining({ id: "dossier" }),
          expect.objectContaining({ id: "claim" }),
        ]),
      },
    ]);
    expect(
      comparePageActionsForEntry(entry(), state.actionCells).map((a) => a.id),
    ).toEqual(["dossier", "claim"]);
  });

  it("keeps action rows unhighlighted when columns share the same next-action sets", () => {
    expect(
      comparePageActionsInteractiveUiState([
        entry({ slug: "alpha", installCommand: "npm i fixture" }),
        entry({ slug: "beta", installCommand: "pnpm add fixture" }),
      ]),
    ).toEqual({
      actionRowDiverges: false,
      actionCells: [
        expect.objectContaining({ entryKey: "mcp:alpha" }),
        expect.objectContaining({ entryKey: "mcp:beta" }),
      ],
    });
  });

  it("returns an empty action list when no bundled cell matches the entry", () => {
    expect(comparePageActionsForEntry(entry({ slug: "missing" }), [])).toEqual(
      [],
    );
  });

  it("highlights diverging next-action rows for mixed compare columns", () => {
    const state = comparePageActionsInteractiveUiState([
      entry({ installCommand: "npm i fixture" }),
      entry(),
    ]);
    expect(state.actionRowDiverges).toBe(true);
    expect(state.actionCells).toHaveLength(2);
    expect(comparePageActionsForEntry(entry(), state.actionCells)).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: "dossier" })]),
    );
  });
});
