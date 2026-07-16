import { describe, expect, it } from "vitest";
import {
  liveVersionBadgeAnalyticsData,
  liveVersionBadgeAnalyticsEvent,
} from "@/lib/live-version-cta-events-lib";

describe("live version cta events lib", () => {
  it("builds privacy-light live version badge analytics", () => {
    expect(liveVersionBadgeAnalyticsEvent()).toBe("live_version_badge_click");
    expect(liveVersionBadgeAnalyticsData("integrations-detail", true)).toEqual({
      surface: "integrations-detail",
      hasLiveVersion: true,
    });
    expect(liveVersionBadgeAnalyticsData("integration-card", false)).toEqual({
      surface: "integration-card",
      hasLiveVersion: false,
    });
  });
});
