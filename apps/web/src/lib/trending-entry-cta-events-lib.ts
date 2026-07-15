/**
 * Pure trending page navigation analytics helpers.
 *
 * Maps trending list navigation, category filter chips, reset, RSS, and footer
 * cross-links to privacy-light event names without embedding entry titles or
 * signal reason copy.
 */

export const TRENDING_LIST_SURFACE = "trending-list";
export const TRENDING_PAGE_SURFACE = "trending-page";

export type TrendingListWindow = "7d" | "30d" | "all";
export type TrendingListMode = "live" | "fallback" | "unavailable";
export type TrendingChromeDestination = "rss" | "brief" | "browse";
export type TrendingChromePlacement = "header" | "footer" | "empty";

export function trendingListEntryKey(category: string, slug: string): string {
  return `${category}/${slug}`;
}

export function trendingListEntryAnalyticsEvent(): string {
  return "trending_list_entry_click";
}

export function trendingListEntryAnalyticsData(
  category: string,
  slug: string,
  rank: number,
  listCount: number,
  window: TrendingListWindow,
  categoryFilter: string,
  mode: TrendingListMode,
) {
  return {
    entry: trendingListEntryKey(category, slug),
    surface: TRENDING_LIST_SURFACE,
    rank,
    listCount,
    window,
    categoryFilter,
    mode,
  };
}

export function trendingCategoryFilterAnalyticsEvent(): string {
  return "trending_category_filter_click";
}

export function trendingCategoryFilterAnalyticsData(
  categoryFilter: string,
  active: boolean,
  matchCount: number,
  totalCount: number,
  window: TrendingListWindow,
  mode: TrendingListMode,
) {
  return {
    surface: TRENDING_PAGE_SURFACE,
    categoryFilter,
    active,
    matchCount,
    totalCount,
    window,
    mode,
  };
}

export function trendingFilterResetAnalyticsEvent(): string {
  return "trending_filter_reset_click";
}

export function trendingFilterResetAnalyticsData(
  previousCategoryFilter: string,
  previousWindow: TrendingListWindow,
  mode: TrendingListMode,
) {
  return {
    surface: TRENDING_PAGE_SURFACE,
    previousCategoryFilter,
    previousWindow,
    mode,
  };
}

export function trendingChromeAnalyticsEvent(): string {
  return "trending_chrome_click";
}

export function trendingChromeAnalyticsData(
  destination: TrendingChromeDestination,
  placement: TrendingChromePlacement,
  window: TrendingListWindow,
  categoryFilter: string,
  mode: TrendingListMode,
) {
  return {
    surface: TRENDING_PAGE_SURFACE,
    destination,
    placement,
    window,
    categoryFilter,
    mode,
  };
}
