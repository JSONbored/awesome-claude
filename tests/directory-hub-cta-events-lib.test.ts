import { describe, expect, it } from "vitest";
import {
  BEST_INDEX_SURFACE,
  CATEGORY_HUB_SURFACE,
  PLATFORM_INDEX_SURFACE,
  bestIndexListAnalyticsData,
  bestIndexListAnalyticsEvent,
  categoryHubBrowseAnalyticsData,
  categoryHubBrowseAnalyticsEvent,
  categoryHubSeeAllAnalyticsData,
  categoryHubSeeAllAnalyticsEvent,
  platformIndexSelectAnalyticsData,
  platformIndexSelectAnalyticsEvent,
} from "@/lib/directory-hub-cta-events-lib";

describe("directory hub cta events lib", () => {
  it("builds category hub navigation analytics", () => {
    expect(categoryHubBrowseAnalyticsEvent()).toBe("category_hub_browse_click");
    expect(categoryHubBrowseAnalyticsData("mcp", 42)).toEqual({
      surface: CATEGORY_HUB_SURFACE,
      category: "mcp",
      entryCount: 42,
    });
    expect(categoryHubSeeAllAnalyticsEvent()).toBe(
      "category_hub_see_all_click",
    );
    expect(categoryHubSeeAllAnalyticsData("skills", 18)).toEqual({
      surface: CATEGORY_HUB_SURFACE,
      category: "skills",
      entryCount: 18,
    });
  });

  it("builds best index list navigation analytics", () => {
    expect(bestIndexListAnalyticsEvent()).toBe("best_index_list_click");
    expect(bestIndexListAnalyticsData("mcp-servers", 8, 1, 6)).toEqual({
      surface: BEST_INDEX_SURFACE,
      listSlug: "mcp-servers",
      pickCount: 8,
      rowIndex: 1,
      listCount: 6,
    });
  });

  it("builds platform index navigation analytics", () => {
    expect(platformIndexSelectAnalyticsEvent()).toBe("platform_index_select");
    expect(platformIndexSelectAnalyticsData("claude-code", 120, 0, 7)).toEqual({
      surface: PLATFORM_INDEX_SURFACE,
      platformId: "claude-code",
      entryCount: 120,
      rowIndex: 0,
      platformCount: 7,
    });
  });
});
