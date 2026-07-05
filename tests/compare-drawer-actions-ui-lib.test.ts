import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import {
  COMPARE_DRAWER_SURFACE,
  compareDrawerActionCells,
  compareDrawerActionSummary,
  compareDrawerActionsDiverge,
  compareDrawerEntryActions,
  compareDrawerSharedActionIds,
} from "@/lib/compare-drawer-actions-ui-lib";
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

describe("compare drawer actions ui lib", () => {
  it("exposes the compare drawer analytics surface id", () => {
    expect(COMPARE_DRAWER_SURFACE).toBe("compare-drawer");
  });

  it("resolves next actions for a single compared entry", () => {
    expect(
      compareDrawerEntryActions(entry()).map((action) => action.id),
    ).toEqual(["dossier", "claim"]);
  });

  it("maps compared entries to per-column next-action cells", () => {
    expect(compareDrawerActionCells([entry()])).toEqual([
      {
        entryKey: "mcp:fixture",
        actions: expect.arrayContaining([
          expect.objectContaining({ id: "dossier" }),
          expect.objectContaining({ id: "claim" }),
        ]),
      },
    ]);
    expect(
      compareDrawerActionCells([
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

  it("detects when drawer columns expose different next-action sets", () => {
    expect(
      compareDrawerActionsDiverge([
        entry({ installCommand: "npm i fixture" }),
        entry(),
      ]),
    ).toBe(true);
    expect(
      compareDrawerActionsDiverge([
        entry({ installCommand: "npm i fixture" }),
        entry({ installCommand: "pnpm add fixture" }),
      ]),
    ).toBe(false);
    expect(compareDrawerActionsDiverge([])).toBe(false);
  });

  it("finds action ids shared across every compared entry", () => {
    expect(compareDrawerSharedActionIds([])).toEqual([]);
    expect(compareDrawerSharedActionIds([entry()])).toEqual([
      "dossier",
      "claim",
    ]);
    expect(
      compareDrawerSharedActionIds([
        entry({ installCommand: "npm i fixture" }),
        entry(),
      ]),
    ).toEqual(["dossier", "claim"]);
  });

  it("summarizes drawer action divergence for header hints", () => {
    const baseline = entry();
    const withInstall = entry({ installCommand: "npm i fixture" });
    expect(compareDrawerActionSummary([baseline])).toEqual({
      comparedCount: 1,
      diverges: false,
      sharedActionIds: ["dossier", "claim"],
      uniqueSignatures: 1,
    });
    expect(compareDrawerActionSummary([baseline, withInstall])).toEqual({
      comparedCount: 2,
      diverges: true,
      sharedActionIds: ["dossier", "claim"],
      uniqueSignatures: 2,
    });
    expect(compareDrawerActionSummary([baseline, withInstall])).toEqual(
      compareSurfaceActionSummary([baseline, withInstall]),
    );
  });
});
