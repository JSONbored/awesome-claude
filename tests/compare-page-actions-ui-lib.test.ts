import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import {
  COMPARE_PAGE_SURFACE,
  comparePageActionCells,
  comparePageActionSummary,
  comparePageActionsDiverge,
  comparePageEntryActions,
  comparePageSharedActionIds,
} from "@/lib/compare-page-actions-ui-lib";
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

describe("compare page actions ui lib", () => {
  it("exposes the compare page analytics surface id", () => {
    expect(COMPARE_PAGE_SURFACE).toBe("compare-page");
  });

  it("resolves next actions for a single compared entry", () => {
    expect(comparePageEntryActions(entry()).map((action) => action.id)).toEqual(
      ["dossier", "claim"],
    );
  });

  it("maps compared entries to per-column next-action cells", () => {
    expect(comparePageActionCells([entry()])).toEqual([
      {
        entryKey: "mcp:fixture",
        actions: expect.arrayContaining([
          expect.objectContaining({ id: "dossier" }),
          expect.objectContaining({ id: "claim" }),
        ]),
      },
    ]);
    expect(
      comparePageActionCells([
        entry({ category: "skills", slug: "alpha" }),
        entry({
          category: "hooks",
          slug: "beta",
          claimed: true,
          sourceUrl: "https://x.dev",
        }),
      ]).map((cell) => cell.entryKey),
    ).toEqual(["skills:alpha", "hooks:beta"]);
  });

  it("detects when page columns expose different next-action sets", () => {
    expect(
      comparePageActionsDiverge([
        entry({ installCommand: "npm i fixture" }),
        entry(),
      ]),
    ).toBe(true);
    expect(
      comparePageActionsDiverge([
        entry({ installCommand: "npm i fixture" }),
        entry({ installCommand: "pnpm add fixture" }),
      ]),
    ).toBe(false);
    expect(comparePageActionsDiverge([])).toBe(false);
  });

  it("finds action ids shared across every compared entry", () => {
    expect(comparePageSharedActionIds([])).toEqual([]);
    expect(comparePageSharedActionIds([entry()])).toEqual(["dossier", "claim"]);
    expect(
      comparePageSharedActionIds([
        entry({ installCommand: "npm i fixture" }),
        entry({ installCommand: "pnpm add fixture" }),
      ]),
    ).toEqual(["dossier", "install", "claim"]);
    expect(
      comparePageSharedActionIds([
        entry({ installCommand: "npm i fixture" }),
        entry(),
      ]),
    ).toEqual(["dossier", "claim"]);
  });

  it("summarizes page action divergence for header hints", () => {
    const baseline = entry();
    const withInstall = entry({ installCommand: "npm i fixture" });
    expect(comparePageActionSummary([baseline])).toEqual({
      comparedCount: 1,
      diverges: false,
      sharedActionIds: ["dossier", "claim"],
      uniqueSignatures: 1,
    });
    expect(comparePageActionSummary([baseline, withInstall])).toEqual({
      comparedCount: 2,
      diverges: true,
      sharedActionIds: ["dossier", "claim"],
      uniqueSignatures: 2,
    });
    expect(comparePageActionSummary([baseline, withInstall])).toEqual(
      compareSurfaceActionSummary([baseline, withInstall]),
    );
  });
});
