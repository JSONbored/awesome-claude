import { describe, expect, it } from "vitest";
import {
  HOW_IT_WORKS_SURFACE,
  howItWorksStepAnalyticsData,
  howItWorksStepAnalyticsEvent,
} from "@/lib/how-it-works-cta-events-lib";

describe("how it works cta events lib", () => {
  it("builds privacy-light how-it-works step analytics", () => {
    expect(howItWorksStepAnalyticsEvent()).toBe("how_it_works_step_click");
    expect(howItWorksStepAnalyticsData("search", "browse", 0, 3)).toEqual({
      surface: HOW_IT_WORKS_SURFACE,
      stepId: "search",
      destination: "browse",
      stepIndex: 0,
      stepCount: 3,
    });
    expect(howItWorksStepAnalyticsData("inspect", "quality", 1, 3)).toEqual({
      surface: HOW_IT_WORKS_SURFACE,
      stepId: "inspect",
      destination: "quality",
      stepIndex: 1,
      stepCount: 3,
    });
    expect(howItWorksStepAnalyticsData("copy", "platforms", 2, 3)).toEqual({
      surface: HOW_IT_WORKS_SURFACE,
      stepId: "copy",
      destination: "platforms",
      stepIndex: 2,
      stepCount: 3,
    });
  });
});
