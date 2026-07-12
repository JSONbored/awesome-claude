/**
 * Pure browse distribution panel analytics helpers.
 *
 * Maps theme-distribution tag egress and freshness stale-entry navigation to
 * privacy-light event names without embedding tag display names or entry titles.
 */

import type { BrowseThemeConcentration } from "@/lib/browse-theme-distribution-lib";

export const BROWSE_THEME_DISTRIBUTION_SURFACE = "browse-theme-distribution";
export const BROWSE_FRESHNESS_DISTRIBUTION_SURFACE = "browse-freshness-distribution";

export function browseThemeDistributionSelectAnalyticsEvent(): string {
  return "browse_theme_distribution_select";
}

export function browseThemeDistributionSelectAnalyticsData(
  tagSlug: string,
  percent: number,
  rank: number,
  concentration: BrowseThemeConcentration,
  scannedCount: number,
) {
  return {
    surface: BROWSE_THEME_DISTRIBUTION_SURFACE,
    tagSlug,
    percent,
    rank,
    concentration,
    scannedCount,
  };
}

export function browseFreshnessStaleEntryAnalyticsEvent(): string {
  return "browse_freshness_stale_entry_click";
}

export function browseFreshnessStaleEntryAnalyticsData(
  entryRef: string,
  ageDays: number,
  verified: boolean,
) {
  return {
    surface: BROWSE_FRESHNESS_DISTRIBUTION_SURFACE,
    entry: entryRef,
    ageDays,
    verified,
  };
}

export function parseBrowseFreshnessEntryRef(
  entryRef: string,
): { category: string; slug: string } | null {
  const slash = entryRef.indexOf("/");
  if (slash <= 0 || slash >= entryRef.length - 1) {
    return null;
  }
  return {
    category: entryRef.slice(0, slash),
    slug: entryRef.slice(slash + 1),
  };
}
