/**
 * Pure provenance block CTA analytics helpers.
 *
 * Maps detail-rail provenance outbound links to privacy-light event names
 * without embedding full URLs or other sensitive fields.
 */

export const PROVENANCE_DETAIL_RAIL_SURFACE = "detail-provenance";

export type ProvenanceLinkKind = "submission" | "import-pr";

export function provenanceLinkEntryKey(category: string, slug: string): string {
  return `${category}/${slug}`;
}

export function provenanceLinkAnalyticsEvent(): string {
  return "detail_provenance_open";
}

export function provenanceLinkAnalyticsData(
  category: string,
  slug: string,
  kind: ProvenanceLinkKind,
  host: string,
  surface: string = PROVENANCE_DETAIL_RAIL_SURFACE,
) {
  return {
    entry: provenanceLinkEntryKey(category, slug),
    surface,
    link: kind,
    host,
  };
}
