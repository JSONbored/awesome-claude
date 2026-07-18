import { describe, expect, it } from "vitest";
import {
  FEEDS_PAGE_SURFACE,
  feedsPageApiDocsAnalyticsData,
  feedsPageApiDocsAnalyticsEvent,
  feedsPageFeedCopyAnalyticsData,
  feedsPageFeedCopyAnalyticsEvent,
  feedsPageEmailExpandAnalyticsData,
  feedsPageEmailExpandAnalyticsEvent,
  feedsPageEmailFollowAnalyticsData,
  feedsPageEmailFollowAnalyticsEvent,
  feedsPageFeedOpenAnalyticsData,
  feedsPageFeedOpenAnalyticsEvent,
  feedsPageApiDocsDestination,
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
    expect(feedsPageFeedCopyAnalyticsEvent()).toBe(
      "feeds_page_feed_copy_click",
    );
    expect(feedsPageFeedCopyAnalyticsData("mcp", "category", 2, 12)).toEqual({
      surface: FEEDS_PAGE_SURFACE,
      feedKey: "mcp",
      feedKind: "category",
      rowIndex: 2,
      sectionCount: 12,
    });
    expect(feedsPageEmailFollowAnalyticsEvent()).toBe(
      "feeds_page_email_follow_click",
    );
    expect(
      feedsPageEmailFollowAnalyticsData("changelog", "changelog", true),
    ).toEqual({
      surface: FEEDS_PAGE_SURFACE,
      feedKey: "changelog",
      feedKind: "changelog",
      pending: true,
    });
    expect(feedsPageEmailExpandAnalyticsEvent()).toBe(
      "feeds_page_email_expand_click",
    );
    expect(feedsPageEmailExpandAnalyticsData("mcp", "category")).toEqual({
      surface: FEEDS_PAGE_SURFACE,
      feedKey: "mcp",
      feedKind: "category",
    });
  });

  it("maps feeds page api docs destinations", () => {
    expect(feedsPageApiDocsDestination("api-docs")).toEqual({
      to: "/api-docs",
    });
    expect(feedsPageApiDocsDestination("unknown")).toBeNull();
  });
});
