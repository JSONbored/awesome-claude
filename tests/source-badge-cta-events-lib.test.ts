import { describe, expect, it } from "vitest";
import {
  SOURCE_BADGE_SURFACE,
  sourceBadgeAnalyticsData,
  sourceBadgeAnalyticsEvent,
  sourceBadgeBrowseDestination,
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
    expect(sourceBadgeAnalyticsData("source-backed", "hub-highlights")).toEqual(
      {
        surface: "hub-highlights",
        source: "source-backed",
      },
    );
    expect(sourceBadgeAnalyticsData("first-party", "browse-grid")).toEqual({
      surface: "browse-grid",
      source: "first-party",
    });
    expect(sourceBadgeAnalyticsData("external", "browse-row")).toEqual({
      surface: "browse-row",
      source: "external",
    });
    expect(sourceBadgeAnalyticsData("unverified", "home-recent")).toEqual({
      surface: "home-recent",
      source: "unverified",
    });
  });

  it("maps source badge statuses to browse destinations", () => {
    expect(sourceBadgeBrowseDestination("source-backed")).toEqual({
      to: "/browse",
      search: { source: "source-backed" },
    });
    expect(sourceBadgeBrowseDestination("first-party")).toEqual({
      to: "/browse",
      search: { source: "first-party" },
    });
    expect(sourceBadgeBrowseDestination("external")).toEqual({
      to: "/browse",
      search: { source: "external" },
    });
    expect(sourceBadgeBrowseDestination("unverified")).toEqual({
      to: "/browse",
      search: { source: "unverified" },
    });
    expect(sourceBadgeBrowseDestination("unknown")).toBeNull();
    expect(sourceBadgeBrowseDestination("")).toBeNull();
  });
});
