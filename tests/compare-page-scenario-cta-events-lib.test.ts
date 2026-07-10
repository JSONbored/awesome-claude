import { describe, expect, it } from "vitest";
import {
  comparePageScenarioAnalyticsData,
  comparePageScenarioAnalyticsEvent,
  comparePageScenarioSurface,
} from "@/lib/compare-page-scenario-cta-events-lib";

describe("compare page scenario cta events lib", () => {
  it("builds privacy-light compare page scenario analytics", () => {
    expect(comparePageScenarioAnalyticsEvent()).toBe(
      "compare_page_scenario_select",
    );
    expect(comparePageScenarioSurface()).toBe("compare-page-scenario-ranking");
    expect(comparePageScenarioAnalyticsData("safety-first", 3)).toEqual({
      surface: "compare-page-scenario-ranking",
      scenario: "safety-first",
      compareCount: 3,
    });
  });
});
