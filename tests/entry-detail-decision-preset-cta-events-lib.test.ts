import { describe, expect, it } from "vitest";
import {
  detailDecisionPresetAnalyticsData,
  detailDecisionPresetAnalyticsEvent,
  detailDecisionPresetSurface,
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
  });
});
