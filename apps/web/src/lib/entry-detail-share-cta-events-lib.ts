/**
 * Pure entry detail share menu CTA analytics helpers.
 *
 * Maps share dropdown actions to privacy-light event names without
 * embedding URLs, citations, or other sensitive payloads.
 */

export const ENTRY_DETAIL_SHARE_SURFACE = "detail-share";

export type EntryDetailShareAction =
  | "copy-link"
  | "copy-markdown"
  | "open-llms"
  | "view-og"
  | "open-raycast"
  | "system-share";

export function entryDetailShareEntryKey(category: string, slug: string): string {
  return `${category}/${slug}`;
}

export function entryDetailShareAnalyticsEvent(): string {
  return "detail_share_action";
}

export function entryDetailShareAnalyticsData(
  category: string,
  slug: string,
  action: EntryDetailShareAction,
  surface: string = ENTRY_DETAIL_SHARE_SURFACE,
) {
  return {
    entry: entryDetailShareEntryKey(category, slug),
    surface,
    action,
  };
}
