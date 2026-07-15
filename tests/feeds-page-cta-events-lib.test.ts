import { describe, expect, it } from "vitest";
import {
  FEEDS_PAGE_SURFACE,
  feedsPageApiDocsAnalyticsData,
  feedsPageApiDocsAnalyticsEvent,
  feedsPageFeedOpenAnalyticsData,
  feedsPageFeedOpenAnalyticsEvent,
} from "@/lib/feeds-page-cta-events-lib";

describe("feeds page cta events lib", () => {
  it("builds feeds page navigation analytics", () => {
    expect(feedsPageFeedOpenAnalyticsEvent()).toBe(
      "feeds_page_feed_open_click",
    );
    expect(feedsPageFeedOpenAnalyticsData("mcp", "category", 2, 12)).toEqual({
      surface: FEEDS_PAGE_SURFACE,
      feedKey: "mcp",
      feedKind: "category",
      rowIndex: 2,
      sectionCount: 12,
    });
    expect(feedsPageApiDocsAnalyticsEvent()).toBe("feeds_page_api_docs_click");
    expect(feedsPageApiDocsAnalyticsData()).toEqual({
      surface: FEEDS_PAGE_SURFACE,
    });
  });
});
