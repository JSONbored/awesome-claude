import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import { reviewCompareSignal } from "@/lib/compare-entry-signals";
import {
  compareTableDecisionRowDiverges,
  compareTableDivergingDecisionLabels,
  displayCompareSignal,
  signalToneClassForDisplay,
} from "@/lib/compare-table-signals-ui-lib";

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

describe("compare table signals ui lib", () => {
  it("detects when table decision rows diverge across compared entries", () => {
    expect(
      compareTableDecisionRowDiverges(reviewCompareSignal, [
        entry(),
        entry({ reviewedBy: "maintainer", reviewedAt: "2026-01-02" }),
      ]),
    ).toBe(true);
    expect(
      compareTableDecisionRowDiverges(reviewCompareSignal, [
        entry(),
        entry({ slug: "other" }),
      ]),
    ).toBe(false);
  });

  it("returns diverging table decision row labels", () => {
    expect(compareTableDivergingDecisionLabels([entry()])).toEqual([]);
    expect(
      compareTableDivergingDecisionLabels([
        entry(),
        entry({ reviewedBy: "maintainer", reviewedAt: "2026-01-02" }),
      ]),
    ).toEqual(["Review status"]);
  });

  it("re-exports compare signal display helpers for table cells", () => {
    const signal = reviewCompareSignal(entry());
    expect(displayCompareSignal(signal).label).toBe("Not reviewed");
    expect(signalToneClassForDisplay(signal)).toBe("text-ink-subtle");
    expect(signalToneClassForDisplay(undefined)).toBe("text-ink-subtle");
  });
});
