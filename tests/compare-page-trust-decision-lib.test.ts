import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import {
  compareEntryTrustScore,
  compareEntryTrustSnapshot,
  comparePageDivergingDecisionRows,
  comparePageSafestEntryKey,
  comparePageTrustDecisionUiState,
} from "@/lib/compare-page-trust-decision-lib";

function entry(overrides: Partial<Entry> = {}): Entry {
  return {
    category: "skills",
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

describe("compare page trust decision lib", () => {
  it("requires at least two entries before showing the panel", () => {
    expect(comparePageTrustDecisionUiState([entry()])).toEqual({
      showPanel: false,
    });
  });

  it("scores trusted reviewed entries above unverified ones", () => {
    const trusted = entry({
      trust: "trusted",
      reviewed: true,
      source: "source-backed",
      safetyNotes: "Careful",
      installCommand: "npm i demo",
    });
    const risky = entry({
      slug: "risky",
      trust: "limited",
      source: "unverified",
    });

    expect(compareEntryTrustScore(trusted)).toBeGreaterThan(
      compareEntryTrustScore(risky),
    );
    expect(
      comparePageSafestEntryKey([
        compareEntryTrustSnapshot(risky),
        compareEntryTrustSnapshot(trusted),
      ]),
    ).toBe("skills/fixture");
  });

  it("builds diverging decision rows and guidance for mixed comparisons", () => {
    const left = entry({
      trust: "trusted",
      reviewed: true,
      source: "source-backed",
      installCommand: "npm i left",
    });
    const right = entry({
      slug: "right",
      trust: "review",
      source: "unverified",
    });

    const rows = comparePageDivergingDecisionRows([left, right]);
    expect(rows.length).toBeGreaterThan(0);

    const state = comparePageTrustDecisionUiState([left, right]);
    expect(state.showPanel).toBe(true);
    if (!state.showPanel) return;

    expect(state.entrySnapshots).toHaveLength(2);
    expect(state.headline).toBeTruthy();
    expect(state.divergingCount).toBeGreaterThan(0);
  });

  it("flags missing safety notes in the primary hint for larger sets", () => {
    const state = comparePageTrustDecisionUiState([
      entry({ slug: "one" }),
      entry({ slug: "two", safetyNotes: "Careful" }),
      entry({ slug: "three" }),
    ]);

    expect(state.showPanel).toBe(true);
    if (!state.showPanel) return;
    expect(state.primaryHint).toContain("missing safety notes");
  });
});
