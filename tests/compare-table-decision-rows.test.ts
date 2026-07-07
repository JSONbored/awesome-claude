import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import {
  compareDecisionDivergingCount,
  compareDecisionSummary,
  comparisonDecisionRows,
  displayCompareSignal,
  divergingDecisionRowLabels,
  hasCompareDecisionDivergence,
  signalToneClassForDisplay,
} from "@/lib/compare-table-decision-rows";

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

describe("compare table decision rows", () => {
  it("mirrors compare drawer decision rows with divergence helpers", () => {
    const rows = comparisonDecisionRows();
    expect(rows.map((row) => row.label)).toEqual([
      "Review status",
      "Package trust",
      "Source provenance",
      "Submitter",
    ]);
    expect(rows.every((row) => typeof row.diverges === "function")).toBe(true);
  });

  it("returns no diverging labels for fewer than two compared entries", () => {
    expect(divergingDecisionRowLabels([])).toEqual([]);
    expect(divergingDecisionRowLabels([entry()])).toEqual([]);
    expect(hasCompareDecisionDivergence([entry()])).toBe(false);
    expect(compareDecisionSummary([entry()])).toEqual({
      comparedCount: 1,
      divergingCount: 0,
      divergingLabels: [],
    });
  });

  it("detects diverging review and package trust rows across entries", () => {
    const reviewed = entry({ reviewed: true });
    const verified = entry({ packageVerified: true });
    const baseline = entry();

    expect(divergingDecisionRowLabels([reviewed, baseline])).toEqual([
      "Review status",
    ]);
    expect(divergingDecisionRowLabels([verified, baseline])).toEqual([
      "Package trust",
    ]);
    expect(hasCompareDecisionDivergence([reviewed, baseline])).toBe(true);
    const entries = [reviewed, baseline];
    const summary = compareDecisionSummary(entries);
    expect(summary).toEqual({
      comparedCount: 2,
      divergingCount: 1,
      divergingLabels: ["Review status"],
    });
    expect(summary.divergingCount).toBe(compareDecisionDivergingCount(entries));
    expect(hasCompareDecisionDivergence(entries)).toBe(
      compareDecisionDivergingCount(entries) > 0,
    );
  });

  it("detects submitter present-versus-missing divergence", () => {
    expect(
      divergingDecisionRowLabels([
        entry({ submittedBy: "kiannidev" }),
        entry(),
      ]),
    ).toEqual(["Submitter"]);
  });

  it("formats compare signal display and tone classes for table cells", () => {
    expect(displayCompareSignal(undefined)).toEqual({
      tone: "missing",
      label: "—",
    });
    expect(
      signalToneClassForDisplay({
        tone: "verified",
        label: "Package verified",
      }),
    ).toBe("text-trust-trusted");
    expect(
      signalToneClassForDisplay({ tone: "present", label: "Checksum present" }),
    ).toBe("text-ink");
    expect(signalToneClassForDisplay(undefined)).toBe("text-ink-subtle");
  });
});
