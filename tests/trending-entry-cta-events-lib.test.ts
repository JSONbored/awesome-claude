import { describe, expect, it } from "vitest";
import {
  TRENDING_LIST_SURFACE,
  TRENDING_PAGE_SURFACE,
  trendingCategoryFilterAnalyticsData,
  trendingCategoryFilterAnalyticsEvent,
  trendingChromeAnalyticsData,
  trendingChromeAnalyticsEvent,
  trendingChromeDestination,
  trendingFilterResetAnalyticsData,
  trendingFilterResetAnalyticsEvent,
  trendingListEntryAnalyticsData,
  trendingListEntryAnalyticsEvent,
  trendingRankingReasonOpenAnalyticsData,
  trendingRankingReasonOpenAnalyticsEvent,
  trendingShareAnalyticsData,
  trendingShareAnalyticsEvent,
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
    expect(trendingChromeDestination("rss")).toEqual({
      kind: "href",
      href: "/feeds/trending.xml",
    });
    expect(trendingChromeDestination("brief")).toEqual({
      kind: "route",
      to: "/brief",
    });
    expect(trendingChromeDestination("browse")).toEqual({
      kind: "route",
      to: "/browse",
    });
    expect(trendingChromeDestination("unknown")).toBeNull();
  });

  it("builds privacy-light trending share and ranking reason analytics", () => {
    expect(trendingShareAnalyticsEvent()).toBe("trending_share_click");
    expect(
      trendingShareAnalyticsData("7d", "mcp", "live", "copy-link"),
    ).toEqual({
      surface: TRENDING_PAGE_SURFACE,
      window: "7d",
      categoryFilter: "mcp",
      mode: "live",
      action: "copy-link",
    });
    expect(
      trendingShareAnalyticsData("all", "", "fallback", "system-share"),
    ).toEqual({
      surface: TRENDING_PAGE_SURFACE,
      window: "all",
      categoryFilter: "",
      mode: "fallback",
      action: "system-share",
    });
    expect(trendingRankingReasonOpenAnalyticsEvent()).toBe(
      "trending_ranking_reason_open",
    );
    expect(
      trendingRankingReasonOpenAnalyticsData(
        "mcp",
        "browser",
        "7d",
        "mcp",
        "live",
        3,
        true,
      ),
    ).toEqual({
      entry: "mcp/browser",
      surface: TRENDING_LIST_SURFACE,
      window: "7d",
      categoryFilter: "mcp",
      mode: "live",
      reasonCount: 3,
      hasLiveScore: true,
    });
    expect(
      trendingRankingReasonOpenAnalyticsData(
        "skills",
        "demo",
        "30d",
        "",
        "fallback",
        0,
        false,
      ),
    ).toEqual({
      entry: "skills/demo",
      surface: TRENDING_LIST_SURFACE,
      window: "30d",
      categoryFilter: "",
      mode: "fallback",
      reasonCount: 0,
      hasLiveScore: false,
    });
  });
});
