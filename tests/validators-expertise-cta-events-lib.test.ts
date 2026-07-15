import { describe, expect, it } from "vitest";
import {
  VALIDATORS_EXPERTISE_SURFACE,
  validatorsExpertiseFilterAnalyticsData,
  validatorsExpertiseFilterAnalyticsEvent,
} from "@/lib/validators-expertise-cta-events-lib";

describe("validators expertise cta events lib", () => {
  it("builds privacy-light validators expertise filter analytics", () => {
    expect(validatorsExpertiseFilterAnalyticsEvent()).toBe(
      "validators_expertise_filter_click",
    );
    expect(validatorsExpertiseFilterAnalyticsData("all", 12, 8)).toEqual({
      surface: VALIDATORS_EXPERTISE_SURFACE,
      expertiseId: "all",
      matchCount: 12,
      expertiseCount: 8,
    });
    expect(validatorsExpertiseFilterAnalyticsData("MCP", 3, 8)).toEqual({
      surface: VALIDATORS_EXPERTISE_SURFACE,
      expertiseId: "MCP",
      matchCount: 3,
      expertiseCount: 8,
    });
  });
});
