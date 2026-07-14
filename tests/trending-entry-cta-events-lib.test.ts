import { describe, expect, it } from "vitest";
import {
  TRENDING_LIST_SURFACE,
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
});
