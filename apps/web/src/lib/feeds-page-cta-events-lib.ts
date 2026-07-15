/**
 * Pure feeds page navigation analytics helpers.
 *
 * Maps feed open egress and API docs cross-links to privacy-light event names
 * without embedding full feed URLs.
 */

export const FEEDS_PAGE_SURFACE = "feeds-page";

export type FeedsPageFeedKind = "site-wide" | "category" | "changelog" | "llms";

export function feedsPageFeedOpenAnalyticsEvent(): string {
  return "feeds_page_feed_open_click";
}

export function feedsPageFeedOpenAnalyticsData(
  feedKey: string,
  feedKind: FeedsPageFeedKind,
  rowIndex: number,
  sectionCount: number,
) {
  return {
    surface: FEEDS_PAGE_SURFACE,
    feedKey,
    feedKind,
    rowIndex,
    sectionCount,
  };
}

export function feedsPageApiDocsAnalyticsEvent(): string {
  return "feeds_page_api_docs_click";
}

export function feedsPageApiDocsAnalyticsData() {
  return {
    surface: FEEDS_PAGE_SURFACE,
  };
}
