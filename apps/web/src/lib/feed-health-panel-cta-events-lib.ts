/**
 * Pure feed health panel navigation analytics helpers.
 *
 * Maps health JSON egress, per-feed open/copy, and see-all navigation to
 * privacy-light event names without embedding full feed URLs or etags.
 */

export const FEED_HEALTH_PANEL_SURFACE = "feed-health-panel";

export function feedHealthJsonAnalyticsEvent(): string {
  return "feed_health_json_click";
}

export function feedHealthJsonAnalyticsData(feedCount: number, currentCount: number) {
  return {
    surface: FEED_HEALTH_PANEL_SURFACE,
    feedCount,
    currentCount,
  };
}

export function feedHealthFeedOpenAnalyticsEvent(): string {
  return "feed_health_feed_open_click";
}

export function feedHealthFeedOpenAnalyticsData(
  feedId: string,
  isCurrent: boolean,
  rowIndex: number,
  visibleCount: number,
) {
  return {
    surface: FEED_HEALTH_PANEL_SURFACE,
    feedId,
    isCurrent,
    rowIndex,
    visibleCount,
  };
}

export function feedHealthCopyAnalyticsEvent(): string {
  return "feed_health_copy_click";
}

export function feedHealthCopyAnalyticsData(feedId: string, isCurrent: boolean) {
  return {
    surface: FEED_HEALTH_PANEL_SURFACE,
    feedId,
    isCurrent,
  };
}

export function feedHealthSeeAllAnalyticsEvent(): string {
  return "feed_health_see_all_click";
}

export function feedHealthSeeAllAnalyticsData(feedCount: number, visibleCount: number) {
  return {
    surface: FEED_HEALTH_PANEL_SURFACE,
    feedCount,
    visibleCount,
  };
}
