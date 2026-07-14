/**
 * Pure hub entry egress analytics helpers.
 *
 * Maps highlight, trending podium, and category ranking entry navigation to
 * privacy-light event names without embedding entry titles or hub copy.
 */

import type { HighlightKind } from "@/lib/hub-highlights-lib";

export const HUB_HIGHLIGHTS_SURFACE = "hub-highlights";
export const HUB_TRENDING_PODIUM_SURFACE = "hub-trending-podium";
export const HUB_CATEGORY_RANKING_SURFACE = "hub-category-ranking";

export function hubEntryKey(category: string, slug: string): string {
  return `${category}/${slug}`;
}

export function hubHighlightEntryAnalyticsEvent(): string {
  return "hub_highlight_entry_click";
}

export function hubHighlightEntryAnalyticsData(
  category: string,
  slug: string,
  kind: HighlightKind,
  highlightCount: number,
) {
  return {
    entry: hubEntryKey(category, slug),
    surface: HUB_HIGHLIGHTS_SURFACE,
    kind,
    highlightCount,
  };
}

export function hubTrendingPodiumEntryAnalyticsEvent(): string {
  return "hub_trending_podium_entry_click";
}

export function hubTrendingPodiumEntryAnalyticsData(
  category: string,
  slug: string,
  rank: number,
  podiumCount: number,
) {
  return {
    entry: hubEntryKey(category, slug),
    surface: HUB_TRENDING_PODIUM_SURFACE,
    rank,
    podiumCount,
  };
}

export function hubCategoryRankingEntryAnalyticsEvent(): string {
  return "hub_category_ranking_entry_click";
}

export function hubCategoryRankingEntryAnalyticsData(
  category: string,
  slug: string,
  rowIndex: number,
  rowCount: number,
) {
  return {
    entry: hubEntryKey(category, slug),
    surface: HUB_CATEGORY_RANKING_SURFACE,
    rowIndex,
    rowCount,
  };
}
