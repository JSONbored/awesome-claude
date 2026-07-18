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

export function browseFreshnessBucketAnalyticsEvent(): string {
  return "browse_freshness_bucket_click";
}

export function browseFreshnessBucketAnalyticsData(
  bucketId: string,
  count: number,
  percent: number,
  scannedCount: number,
) {
  return {
    surface: BROWSE_FRESHNESS_DISTRIBUTION_SURFACE,
    bucketId,
    count,
    percent,
    scannedCount,
  };
}

/** Map a freshness bucket id to a browse signal hint for analytics context. */
export function browseFreshnessBucketSignal(bucketId: string): string | null {
  switch (bucketId) {
    case "fresh":
      return "fresh";
    case "recent":
      return "recent";
    case "aging":
      return "aging";
    case "stale":
      return "stale";
    default:
      return null;
  }
}

export type BrowseFreshnessBucketBrowseSearch = {
  sort?: "popular" | "newest" | "title";
};

export type BrowseFreshnessBucketDestination =
  | { to: "/browse"; search: BrowseFreshnessBucketBrowseSearch }
  | { to: "/quality"; hash: "freshness" };

/** Map a freshness bucket id to browse sort or quality freshness egress. */
export function browseFreshnessBucketDestination(
  bucketId: string,
): BrowseFreshnessBucketDestination | null {
  switch (bucketId) {
    case "fresh":
      return { to: "/browse", search: { sort: "newest" } };
    case "recent":
      return { to: "/browse", search: { sort: "newest" } };
    case "aging":
      return { to: "/quality", hash: "freshness" };
    case "stale":
      return { to: "/quality", hash: "freshness" };
    default:
      return null;
  }
}
