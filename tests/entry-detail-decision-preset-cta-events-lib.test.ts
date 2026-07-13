import { describe, expect, it } from "vitest";
import {
  detailCompareBenchmarkEntryAnalyticsData,
  detailCompareBenchmarkEntryAnalyticsEvent,
  detailDecisionPresetAnalyticsData,
  detailDecisionPresetAnalyticsEvent,
  detailDecisionPresetSurface,
  detailDecisionTimelineBenchmarkEntryAnalyticsData,
  detailDecisionTimelineBenchmarkEntryAnalyticsEvent,
  detailEvidenceMatrixBenchmarkEntryAnalyticsData,
  detailEvidenceMatrixBenchmarkEntryAnalyticsEvent,
  parseDetailEntryRef,
} from "@/lib/entry-detail-decision-preset-cta-events-lib";

describe("entry detail decision preset cta events lib", () => {
  it("builds privacy-light decision preset analytics", () => {
    expect(detailDecisionPresetAnalyticsEvent()).toBe(
      "detail_decision_preset_select",
    );
    expect(detailDecisionPresetSurface("adoption-plan")).toBe(
      "detail-adoption-plan",
    );
    expect(
      detailDecisionPresetAnalyticsData(
        "mcp",
        "browser",
        "adoption-plan",
        "balanced-rollout",
      ),
    ).toEqual({
      entry: "mcp/browser",
      surface: "detail-adoption-plan",
      panel: "adoption-plan",
      preset: "balanced-rollout",
    });
    expect(
      detailDecisionPresetAnalyticsData(
        "skills",
        "demo",
        "compare-benchmark",
        "strict",
      ),
    ).toEqual({
      entry: "skills/demo",
      surface: "detail-compare-benchmark",
      panel: "compare-benchmark",
      preset: "strict",
    });
    expect(detailCompareBenchmarkEntryAnalyticsEvent()).toBe(
      "detail_compare_benchmark_entry_click",
    );
    expect(
      detailCompareBenchmarkEntryAnalyticsData(
        "mcp",
        "browser",
        "agents/foo",
        "security",
        "stronger",
        84,
        12,
        3,
      ),
    ).toEqual({
      entry: "mcp/browser",
      surface: "detail-compare-benchmark",
      peer: "agents/foo",
      preset: "security",
      verdict: "stronger",
      totalScore: 84,
      delta: 12,
      peerCount: 3,
    });
    expect(parseDetailEntryRef("mcp/browser")).toEqual({
      category: "mcp",
      slug: "browser",
    });
    expect(parseDetailEntryRef("invalid")).toBeNull();
    expect(detailDecisionTimelineBenchmarkEntryAnalyticsEvent()).toBe(
      "detail_decision_timeline_benchmark_entry_click",
    );
    expect(
      detailDecisionTimelineBenchmarkEntryAnalyticsData(
        "mcp",
        "browser",
        "agents/foo",
        "balanced",
        72,
        -4,
        2,
      ),
    ).toEqual({
      entry: "mcp/browser",
      surface: "detail-decision-timeline",
      peer: "agents/foo",
      preset: "balanced",
      score: 72,
      delta: -4,
      peerCount: 2,
    });
    expect(detailEvidenceMatrixBenchmarkEntryAnalyticsEvent()).toBe(
      "detail_evidence_matrix_benchmark_entry_click",
    );
    expect(
      detailEvidenceMatrixBenchmarkEntryAnalyticsData(
        "skills",
        "demo",
        "mcp/bar",
        "strict",
        88,
        true,
        4,
      ),
    ).toEqual({
      entry: "skills/demo",
      surface: "detail-evidence-matrix",
      peer: "mcp/bar",
      preset: "strict",
      score: 88,
      strongerThanTarget: true,
      peerCount: 4,
    });
  });
});
