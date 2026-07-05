import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import {
  compareSurfaceActionCells,
  compareSurfaceActionSummary,
  compareSurfaceActionsDiverge,
  compareSurfaceSharedActionIds,
} from "@/lib/compare-surface-actions-lib";

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

describe("compare surface actions lib", () => {
  it("maps compared entries to per-column next-action cells", () => {
    expect(compareSurfaceActionCells([entry()])).toEqual([
      {
        entryKey: "mcp:fixture",
        actions: expect.arrayContaining([
          expect.objectContaining({ id: "dossier" }),
          expect.objectContaining({ id: "claim" }),
        ]),
      },
    ]);
    expect(
      compareSurfaceActionCells([
        entry({ category: "skills", slug: "alpha" }),
        entry({ category: "hooks", slug: "beta", sourceUrl: "https://x.dev" }),
      ]).map((cell) => cell.entryKey),
    ).toEqual(["skills:alpha", "hooks:beta"]);
  });

  it("detects when columns expose different next-action sets", () => {
    expect(
      compareSurfaceActionsDiverge([
        entry({ installCommand: "npm i fixture" }),
        entry(),
      ]),
    ).toBe(true);
    expect(
      compareSurfaceActionsDiverge([
        entry({ installCommand: "npm i fixture" }),
        entry({ installCommand: "pnpm add fixture" }),
      ]),
    ).toBe(false);
    expect(compareSurfaceActionsDiverge([])).toBe(false);
  });

  it("finds action ids shared across every compared entry", () => {
    expect(compareSurfaceSharedActionIds([])).toEqual([]);
    expect(compareSurfaceSharedActionIds([entry()])).toEqual([
      "dossier",
      "claim",
    ]);
    expect(
      compareSurfaceSharedActionIds([
        entry({ installCommand: "npm i fixture" }),
        entry({ installCommand: "pnpm add fixture" }),
      ]),
    ).toEqual(["dossier", "install", "claim"]);
    expect(
      compareSurfaceSharedActionIds([
        entry({ installCommand: "npm i fixture" }),
        entry(),
      ]),
    ).toEqual(["dossier", "claim"]);
  });

  it("summarizes action divergence for compare surface headers", () => {
    const baseline = entry();
    const withInstall = entry({ installCommand: "npm i fixture" });
    expect(compareSurfaceActionSummary([baseline])).toEqual({
      comparedCount: 1,
      diverges: false,
      sharedActionIds: ["dossier", "claim"],
      uniqueSignatures: 1,
    });
    expect(compareSurfaceActionSummary([baseline, withInstall])).toEqual({
      comparedCount: 2,
      diverges: true,
      sharedActionIds: ["dossier", "claim"],
      uniqueSignatures: 2,
    });
  });
});
