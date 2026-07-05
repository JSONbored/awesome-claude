import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import { reviewCompareSignal } from "@/lib/compare-entry-signals";
import {
  compareDrawerDecisionRowDiverges,
  compareDrawerDecisionRows,
  compareDrawerDivergingDecisionLabels,
  compareSignalToneClass,
} from "@/lib/compare-drawer-signals-ui-lib";

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

describe("compare drawer signals ui lib", () => {
  it("detects when drawer decision rows diverge across compared entries", () => {
    expect(
      compareDrawerDecisionRowDiverges(reviewCompareSignal, [
        entry(),
        entry({ reviewedBy: "maintainer", reviewedAt: "2026-01-02" }),
      ]),
    ).toBe(true);
    expect(
      compareDrawerDecisionRowDiverges(reviewCompareSignal, [
        entry(),
        entry({ slug: "other" }),
      ]),
    ).toBe(false);
  });

  it("returns diverging drawer decision row labels", () => {
    expect(compareDrawerDivergingDecisionLabels([entry()])).toEqual([]);
    expect(
      compareDrawerDivergingDecisionLabels([
        entry(),
        entry({ reviewedBy: "maintainer", reviewedAt: "2026-01-02" }),
      ]),
    ).toEqual(["Review status"]);
  });

  it("exposes drawer decision row definitions for signal cells", () => {
    const rows = compareDrawerDecisionRows();
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.map((row) => row.label)).toContain("Review status");
  });

  it("re-exports compare signal tone classes for drawer cells", () => {
    expect(compareSignalToneClass("verified")).toBe("text-trust-trusted");
    expect(compareSignalToneClass("missing")).toBe("text-ink-subtle");
  });
});
