import { describe, expect, it } from "vitest";
import {
  TRUST_BADGE_SURFACE,
  trustBadgeAnalyticsData,
  trustBadgeAnalyticsEvent,
  trustBrowseSearch,
} from "@/lib/trust-badge-cta-events-lib";

describe("trust badge cta events lib", () => {
  it("builds privacy-light trust badge analytics for each surface", () => {
    expect(trustBadgeAnalyticsEvent()).toBe("trust_badge_click");
    expect(trustBadgeAnalyticsData("trusted")).toEqual({
      surface: TRUST_BADGE_SURFACE,
      trust: "trusted",
    });
    expect(trustBadgeAnalyticsData("review", "category-ranking")).toEqual({
      surface: "category-ranking",
      trust: "review",
    });
    expect(trustBadgeAnalyticsData("limited", "compare-tray")).toEqual({
      surface: "compare-tray",
      trust: "limited",
    });
    expect(trustBadgeAnalyticsData("blocked", "compare-table")).toEqual({
      surface: "compare-table",
      trust: "blocked",
    });
    expect(trustBadgeAnalyticsData("trusted", "compare-drawer")).toEqual({
      surface: "compare-drawer",
      trust: "trusted",
    });
  });

  it("maps trust levels to browse trust search patches", () => {
    expect(trustBrowseSearch("trusted")).toEqual({ trust: "trusted" });
    expect(trustBrowseSearch("review")).toEqual({ trust: "review" });
    expect(trustBrowseSearch("limited")).toEqual({ trust: "limited" });
    expect(trustBrowseSearch("blocked")).toEqual({ trust: "blocked" });
    expect(trustBrowseSearch("unknown")).toBeNull();
  });
});
