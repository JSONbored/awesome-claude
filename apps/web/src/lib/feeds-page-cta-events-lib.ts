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

export function feedsPageFeedCopyAnalyticsEvent(): string {
  return "feeds_page_feed_copy_click";
}

export function feedsPageFeedCopyAnalyticsData(
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

export function feedsPageEmailFollowAnalyticsEvent(): string {
  return "feeds_page_email_follow_click";
}

export function feedsPageEmailFollowAnalyticsData(
  feedKey: string,
  feedKind: FeedsPageFeedKind,
  pending: boolean,
) {
  return {
    surface: FEEDS_PAGE_SURFACE,
    feedKey,
    feedKind,
    pending,
  };
}

export function feedsPageEmailExpandAnalyticsEvent(): string {
  return "feeds_page_email_expand_click";
}

export function feedsPageEmailExpandAnalyticsData(feedKey: string, feedKind: FeedsPageFeedKind) {
  return {
    surface: FEEDS_PAGE_SURFACE,
    feedKey,
    feedKind,
  };
}
