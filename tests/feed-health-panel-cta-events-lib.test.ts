import { describe, expect, it } from "vitest";
import {
  FEED_HEALTH_PANEL_SURFACE,
  feedHealthCopyAnalyticsData,
  feedHealthCopyAnalyticsEvent,
  feedHealthFeedOpenAnalyticsData,
  feedHealthFeedOpenAnalyticsEvent,
  feedHealthJsonAnalyticsData,
  feedHealthJsonAnalyticsEvent,
  feedHealthSeeAllAnalyticsData,
  feedHealthSeeAllAnalyticsEvent,
} from "@/lib/feed-health-panel-cta-events-lib";

describe("feed health panel cta events lib", () => {
  it("builds feed health panel navigation analytics", () => {
    expect(feedHealthJsonAnalyticsEvent()).toBe("feed_health_json_click");
    expect(feedHealthJsonAnalyticsData(12, 10)).toEqual({
      surface: FEED_HEALTH_PANEL_SURFACE,
      feedCount: 12,
      currentCount: 10,
    });
    expect(feedHealthFeedOpenAnalyticsEvent()).toBe(
      "feed_health_feed_open_click",
    );
    expect(feedHealthFeedOpenAnalyticsData("site", true, 0, 5)).toEqual({
      surface: FEED_HEALTH_PANEL_SURFACE,
      feedId: "site",
      isCurrent: true,
      rowIndex: 0,
      visibleCount: 5,
    });
    expect(feedHealthCopyAnalyticsEvent()).toBe("feed_health_copy_click");
    expect(feedHealthCopyAnalyticsData("changelog", false)).toEqual({
      surface: FEED_HEALTH_PANEL_SURFACE,
      feedId: "changelog",
      isCurrent: false,
    });
    expect(feedHealthSeeAllAnalyticsEvent()).toBe("feed_health_see_all_click");
    expect(feedHealthSeeAllAnalyticsData(12, 5)).toEqual({
      surface: FEED_HEALTH_PANEL_SURFACE,
      feedCount: 12,
      visibleCount: 5,
    });
  });
});
