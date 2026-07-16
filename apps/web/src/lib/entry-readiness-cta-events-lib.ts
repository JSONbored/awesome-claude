/**
 * Pure entry readiness rail analytics helpers.
 *
 * Maps readiness row navigation to privacy-light event names without embedding
 * trust labels, source strings, or free-form note copy.
 */

export const ENTRY_READINESS_SURFACE = "detail-rail";

export type EntryReadinessRowId = "trust" | "source" | "safety" | "reviewed";

export function entryReadinessEntryKey(category: string, slug: string): string {
  return `${category}/${slug}`;
}

export function entryReadinessRowAnalyticsEvent(): string {
  return "entry_readiness_row_click";
}

export function entryReadinessRowAnalyticsData(
  category: string,
  slug: string,
  rowId: EntryReadinessRowId,
  ok: boolean,
  destination: string,
) {
  return {
    entry: entryReadinessEntryKey(category, slug),
    surface: ENTRY_READINESS_SURFACE,
    rowId,
    ok,
    destination,
  };
}
