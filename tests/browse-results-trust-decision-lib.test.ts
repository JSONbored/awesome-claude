import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import {
  browseResultsTrustDecisionUiState,
  browseTrustCoverageChips,
  browseTrustLevelBreakdown,
  browseTrustPanelDecisionHint,
} from "@/lib/browse-results-trust-decision-lib";

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

describe("browse results trust decision lib", () => {
  it("hides the panel until enough results are present", () => {
    expect(
      browseResultsTrustDecisionUiState([entry(), entry({ slug: "two" })]),
    ).toEqual({
      showPanel: false,
    });
  });

  it("summarizes trust level mix and coverage chips", () => {
    const results = [
      entry({
        trust: "trusted",
        safetyNotes: "Careful",
        reviewed: true,
        source: "source-backed",
      }),
      entry({ slug: "two", trust: "review", claimed: true }),
      entry({ slug: "three", trust: "limited", privacyNotes: "Local only" }),
    ];

    expect(browseTrustLevelBreakdown(results)).toEqual([
      { level: "trusted", count: 1 },
      { level: "review", count: 1 },
      { level: "limited", count: 1 },
    ]);

    const coverage = browseTrustCoverageChips(results);
    expect(coverage.find((chip) => chip.id === "safety")).toMatchObject({
      count: 1,
      total: 3,
      percent: 33,
    });
    expect(coverage.find((chip) => chip.id === "claimed")?.count).toBe(1);
  });

  it("builds divergence and compare guidance for mixed trust sets", () => {
    const results = [
      entry({ trust: "trusted", reviewed: true, source: "source-backed" }),
      entry({ slug: "two", trust: "review", source: "unverified" }),
      entry({ slug: "three", trust: "limited", source: "unverified" }),
    ];

    const state = browseResultsTrustDecisionUiState(results, 0);
    expect(state.showPanel).toBe(true);
    if (!state.showPanel) return;

    expect(state.hasMixedTrust).toBe(true);
    expect(state.divergingCount).toBeGreaterThan(0);
    expect(state.decisionHint).toContain("Signals differ");
  });

  it("prioritizes compare nudge when entries are already selected", () => {
    const results = [
      entry({ trust: "trusted", reviewed: true }),
      entry({ slug: "two", trust: "trusted", reviewed: true }),
      entry({ slug: "three", trust: "trusted", reviewed: true }),
    ];

    const state = browseResultsTrustDecisionUiState(results, 2);
    expect(state.showPanel).toBe(true);
    if (!state.showPanel) return;

    expect(state.compareNudge).toContain("2 entries selected");
  });

  it("builds divergence hints from decision row labels", () => {
    expect(
      browseTrustPanelDecisionHint(
        [
          entry({ trust: "trusted", reviewed: true }),
          entry({ slug: "two", trust: "review", reviewed: false }),
        ],
        2,
        ["Review status", "Source provenance"],
      ),
    ).toContain("Review status");
  });

  it("returns an empty coverage chip list for zero results", () => {
    expect(browseTrustCoverageChips([])).toEqual([]);
  });

  it("classifies high and neutral coverage chip emphasis", () => {
    const results = [
      entry({
        trust: "trusted",
        safetyNotes: "Careful",
        privacyNotes: "Local only",
        reviewed: true,
        source: "source-backed",
        claimed: true,
      }),
      entry({
        slug: "two",
        trust: "trusted",
        safetyNotes: "Careful",
        privacyNotes: "Local only",
        reviewed: true,
        source: "source-backed",
        claimed: true,
      }),
      entry({
        slug: "three",
        trust: "trusted",
        safetyNotes: "Careful",
        privacyNotes: "Local only",
        reviewed: true,
        source: "source-backed",
        claimed: true,
      }),
    ];
    const coverage = browseTrustCoverageChips(results);
    expect(coverage.find((chip) => chip.id === "safety")).toMatchObject({
      emphasis: "high",
      percent: 100,
    });
    expect(coverage.find((chip) => chip.id === "reviewed")?.emphasis).toBe(
      "high",
    );
  });

  it("warns about weak trust-signal coverage when multiple chips are low", () => {
    const sparse = [
      entry(),
      entry({ slug: "two" }),
      entry({ slug: "three" }),
      entry({ slug: "four" }),
    ];
    expect(browseTrustPanelDecisionHint(sparse, 0, [])).toContain(
      "of results have key trust signals",
    );
  });

  it("prefers side-by-side compare copy when diverging labels exist and compare is ready", () => {
    expect(
      browseTrustPanelDecisionHint([entry(), entry({ slug: "two" })], 2, [
        "Review status",
      ]),
    ).toContain("open compare to review side by side");
  });

  it("falls back to mixed-trust guidance when labels do not diverge", () => {
    expect(
      browseTrustPanelDecisionHint(
        [
          entry({ trust: "trusted" }),
          entry({ slug: "two", trust: "review" }),
          entry({ slug: "three", trust: "limited" }),
        ],
        0,
        [],
      ),
    ).toContain("Mixed trust levels");
  });
});
