import { describe, expect, it } from "vitest";
import {
  browseDecisionPresetAnalyticsData,
  browseDecisionPresetAnalyticsEvent,
  browseDecisionPresetSurface,
} from "@/lib/browse-decision-preset-cta-events-lib";

describe("browse decision preset cta events lib", () => {
  it("builds privacy-light browse preset analytics", () => {
    expect(browseDecisionPresetAnalyticsEvent()).toBe(
      "browse_decision_preset_select",
    );
    expect(browseDecisionPresetSurface("adoption-queue")).toBe(
      "browse-adoption-queue",
    );
    expect(
      browseDecisionPresetAnalyticsData("adoption-queue", "security-first", 42),
    ).toEqual({
      surface: "browse-adoption-queue",
      panel: "adoption-queue",
      preset: "security-first",
      resultCount: 42,
    });
    expect(
      browseDecisionPresetAnalyticsData("decision-confidence", "strict", 8),
    ).toEqual({
      surface: "browse-decision-confidence",
      panel: "decision-confidence",
      preset: "strict",
      resultCount: 8,
    });
  });
});
