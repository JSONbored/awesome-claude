import { describe, expect, it } from "vitest";
import {
  SOURCE_BADGE_SURFACE,
  sourceBadgeAnalyticsData,
  sourceBadgeAnalyticsEvent,
} from "@/lib/source-badge-cta-events-lib";

describe("source badge cta events lib", () => {
  it("builds privacy-light source badge analytics for each surface", () => {
    expect(sourceBadgeAnalyticsEvent()).toBe("source_badge_click");
    expect(sourceBadgeAnalyticsData("source-backed")).toEqual({
      surface: SOURCE_BADGE_SURFACE,
      source: "source-backed",
    });
    expect(sourceBadgeAnalyticsData("first-party", "compare-table")).toEqual({
      surface: "compare-table",
      source: "first-party",
    });
    expect(sourceBadgeAnalyticsData("external", "compare-drawer")).toEqual({
      surface: "compare-drawer",
      source: "external",
    });
    expect(sourceBadgeAnalyticsData("unverified", "category-ranking")).toEqual({
      surface: "category-ranking",
      source: "unverified",
    });
  });
});
