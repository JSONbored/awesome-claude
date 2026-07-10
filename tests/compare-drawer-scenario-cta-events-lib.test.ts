import { describe, expect, it } from "vitest";
import {
  compareDrawerScenarioAnalyticsData,
  compareDrawerScenarioAnalyticsEvent,
  compareDrawerScenarioSurface,
} from "@/lib/compare-drawer-scenario-cta-events-lib";

describe("compare drawer scenario cta events lib", () => {
  it("builds privacy-light compare drawer scenario analytics", () => {
    expect(compareDrawerScenarioAnalyticsEvent()).toBe(
      "compare_drawer_scenario_select",
    );
    expect(compareDrawerScenarioSurface()).toBe(
      "compare-drawer-scenario-ranking",
    );
    expect(compareDrawerScenarioAnalyticsData("speed-first", 2)).toEqual({
      surface: "compare-drawer-scenario-ranking",
      scenario: "speed-first",
      compareCount: 2,
    });
  });
});
