import { describe, expect, it } from "vitest";
import {
  TRENDING_LIST_SURFACE,
  TRENDING_PAGE_SURFACE,
  trendingCategoryFilterAnalyticsData,
  trendingCategoryFilterAnalyticsEvent,
  trendingChromeAnalyticsData,
  trendingChromeAnalyticsEvent,
  trendingFilterResetAnalyticsData,
  trendingFilterResetAnalyticsEvent,
  trendingListEntryAnalyticsData,
  trendingListEntryAnalyticsEvent,
} from "@/lib/trending-entry-cta-events-lib";

describe("trending entry cta events lib", () => {
  it("builds privacy-light trending list entry egress analytics", () => {
    expect(trendingListEntryAnalyticsEvent()).toBe("trending_list_entry_click");
    expect(
      trendingListEntryAnalyticsData(
        "mcp",
        "browser",
        4,
        12,
        "7d",
        "mcp",
        "live",
      ),
    ).toEqual({
      entry: "mcp/browser",
      surface: TRENDING_LIST_SURFACE,
      rank: 4,
      listCount: 12,
      window: "7d",
      categoryFilter: "mcp",
      mode: "live",
    });
    expect(
      trendingListEntryAnalyticsData(
        "skills",
        "demo",
        8,
        20,
        "all",
        "",
        "fallback",
      ),
    ).toEqual({
      entry: "skills/demo",
      surface: TRENDING_LIST_SURFACE,
      rank: 8,
      listCount: 20,
      window: "all",
      categoryFilter: "",
      mode: "fallback",
    });
  });

  it("builds privacy-light trending chrome and filter analytics", () => {
    expect(trendingCategoryFilterAnalyticsEvent()).toBe(
      "trending_category_filter_click",
    );
    expect(
      trendingCategoryFilterAnalyticsData("mcp", true, 4, 20, "7d", "live"),
    ).toEqual({
      surface: TRENDING_PAGE_SURFACE,
      categoryFilter: "mcp",
      active: true,
      matchCount: 4,
      totalCount: 20,
      window: "7d",
      mode: "live",
    });
    expect(trendingFilterResetAnalyticsEvent()).toBe(
      "trending_filter_reset_click",
    );
    expect(
      trendingFilterResetAnalyticsData("agents", "30d", "fallback"),
    ).toEqual({
      surface: TRENDING_PAGE_SURFACE,
      previousCategoryFilter: "agents",
      previousWindow: "30d",
      mode: "fallback",
    });
    expect(trendingChromeAnalyticsEvent()).toBe("trending_chrome_click");
    expect(
      trendingChromeAnalyticsData("rss", "header", "7d", "", "live"),
    ).toEqual({
      surface: TRENDING_PAGE_SURFACE,
      destination: "rss",
      placement: "header",
      window: "7d",
      categoryFilter: "",
      mode: "live",
    });
    expect(
      trendingChromeAnalyticsData(
        "brief",
        "footer",
        "all",
        "mcp",
        "unavailable",
      ),
    ).toEqual({
      surface: TRENDING_PAGE_SURFACE,
      destination: "brief",
      placement: "footer",
      window: "all",
      categoryFilter: "mcp",
      mode: "unavailable",
    });
  });
});
