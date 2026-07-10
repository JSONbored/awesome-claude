import { describe, expect, it } from "vitest";
import {
  comparePageDecisionPresetAnalyticsData,
  comparePageDecisionPresetAnalyticsEvent,
  comparePageDecisionPresetSurface,
} from "@/lib/compare-page-decision-preset-cta-events-lib";

describe("compare page decision preset cta events lib", () => {
  it("builds privacy-light compare page preset analytics", () => {
    expect(comparePageDecisionPresetAnalyticsEvent()).toBe(
      "compare_page_preset_select",
    );
    expect(comparePageDecisionPresetSurface("operational-fit")).toBe(
      "compare-page-operational-fit",
    );
    expect(
      comparePageDecisionPresetAnalyticsData("deployment-risk", "balanced", 4),
    ).toEqual({
      surface: "compare-page-deployment-risk",
      panel: "deployment-risk",
      preset: "balanced",
      compareCount: 4,
    });
  });
});
