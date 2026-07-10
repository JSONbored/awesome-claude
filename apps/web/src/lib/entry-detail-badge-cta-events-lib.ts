/**
 * Pure entry detail badge CTA analytics helpers.
 *
 * Maps README badge markdown copy actions to privacy-light event names
 * without embedding the copied markdown payload.
 */

export const ENTRY_DETAIL_BADGE_SURFACE = "detail-badge";

export function entryDetailBadgeEntryKey(category: string, slug: string): string {
  return `${category}/${slug}`;
}

export function entryDetailBadgeCopyAnalyticsEvent(): string {
  return "detail_badge_markdown_copy";
}

export function entryDetailBadgeCopyAnalyticsData(category: string, slug: string) {
  return {
    entry: entryDetailBadgeEntryKey(category, slug),
    surface: ENTRY_DETAIL_BADGE_SURFACE,
  };
}
