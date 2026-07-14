/**
 * Pure trending page entry egress analytics helpers.
 *
 * Maps trending list navigation below the podium to privacy-light event names
 * without embedding entry titles or signal reason copy.
 */

export const TRENDING_LIST_SURFACE = "trending-list";

export type TrendingListWindow = "7d" | "30d" | "all";
export type TrendingListMode = "live" | "fallback" | "unavailable";

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
