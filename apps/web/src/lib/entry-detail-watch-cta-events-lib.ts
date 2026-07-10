/**
 * Pure entry detail watch button analytics helpers.
 *
 * Maps watch/unwatch toggles to privacy-light event names without
 * embedding entry titles or other sensitive payloads.
 */

import type { WatchKind } from "@/lib/watch-types-lib";

export const ENTRY_DETAIL_WATCH_SURFACE = "detail-watch";

export function entryDetailWatchEntryKey(category: string, slug: string): string {
  return `${category}/${slug}`;
}

export function entryDetailWatchAnalyticsEvent(watching: boolean): string {
  return watching ? "detail_watch_add" : "detail_watch_remove";
}

export function entryDetailWatchAnalyticsData(
  category: string,
  slug: string,
  kind: WatchKind = "entry",
) {
  return {
    entry: entryDetailWatchEntryKey(category, slug),
    surface: ENTRY_DETAIL_WATCH_SURFACE,
    kind,
  };
}
