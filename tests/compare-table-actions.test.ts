import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import {
  COMPARE_TABLE_SURFACE,
  compareTableActionCells,
  compareTableActionSummary,
  compareTableActionsDiverge,
  compareTableSharedActionIds,
  shouldRenderCompareTableActions,
} from "@/lib/compare-table-actions";
import { compareSurfaceActionSummary } from "@/lib/compare-surface-actions-lib";

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

describe("compare table actions", () => {
  it("exposes the compare table analytics surface id", () => {
    expect(COMPARE_TABLE_SURFACE).toBe("compare-table");
  });

  it("only renders next-action rows when enabled for multi-entry tables", () => {
    expect(shouldRenderCompareTableActions([], true)).toBe(false);
    expect(shouldRenderCompareTableActions([entry()], true)).toBe(false);
    expect(
      shouldRenderCompareTableActions(
        [entry(), entry({ slug: "other" })],
        false,
      ),
    ).toBe(false);
    expect(
      shouldRenderCompareTableActions(
        [entry(), entry({ slug: "other" })],
        true,
      ),
    ).toBe(true);
  });

  it("maps compared entries to per-column next-action cells", () => {
    expect(compareTableActionCells([entry()])).toEqual([
      {
        entryKey: "mcp:fixture",
        actions: expect.arrayContaining([
          expect.objectContaining({ id: "dossier" }),
          expect.objectContaining({ id: "claim" }),
        ]),
      },
    ]);
  });

  it("detects when table columns expose different next-action sets", () => {
    expect(
      compareTableActionsDiverge([
        entry({ installCommand: "npm i fixture" }),
        entry(),
      ]),
    ).toBe(true);
    expect(
      compareTableActionsDiverge([
        entry({ installCommand: "npm i fixture" }),
        entry({ installCommand: "pnpm add fixture" }),
      ]),
    ).toBe(false);
    expect(compareTableActionsDiverge([])).toBe(false);
  });

  it("finds action ids shared across every compared entry", () => {
    expect(compareTableSharedActionIds([])).toEqual([]);
    expect(compareTableSharedActionIds([entry()])).toEqual([
      "dossier",
      "claim",
    ]);
    expect(
      compareTableSharedActionIds([
        entry({ installCommand: "npm i fixture" }),
        entry(),
      ]),
    ).toEqual(["dossier", "claim"]);
  });

  it("summarizes table action divergence for row highlighting", () => {
    const baseline = entry();
    const withInstall = entry({ installCommand: "npm i fixture" });
    expect(compareTableActionSummary([baseline, withInstall])).toEqual({
      comparedCount: 2,
      diverges: true,
      sharedActionIds: ["dossier", "claim"],
      uniqueSignatures: 2,
    });
    expect(compareTableActionSummary([baseline, withInstall])).toEqual(
      compareSurfaceActionSummary([baseline, withInstall]),
    );
  });
});
