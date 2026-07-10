import { describe, expect, it } from "vitest";
import {
  compareDrawerDecisionPresetAnalyticsData,
  compareDrawerDecisionPresetAnalyticsEvent,
  compareDrawerDecisionPresetSurface,
} from "@/lib/compare-drawer-decision-preset-cta-events-lib";

describe("compare drawer decision preset cta events lib", () => {
  it("builds privacy-light compare drawer preset analytics", () => {
    expect(compareDrawerDecisionPresetAnalyticsEvent()).toBe(
      "compare_drawer_preset_select",
    );
    expect(compareDrawerDecisionPresetSurface("rollout-readiness")).toBe(
      "compare-drawer-rollout-readiness",
    );
    expect(
      compareDrawerDecisionPresetAnalyticsData("rollout-readiness", "team", 3),
    ).toEqual({
      surface: "compare-drawer-rollout-readiness",
      panel: "rollout-readiness",
      preset: "team",
      compareCount: 3,
    });
    expect(
      compareDrawerDecisionPresetAnalyticsData(
        "mitigation-priority",
        "strict",
        2,
      ),
    ).toEqual({
      surface: "compare-drawer-mitigation-priority",
      panel: "mitigation-priority",
      preset: "strict",
      compareCount: 2,
    });
  });
});
