/**
 * Pure entry detail compare egress analytics helpers.
 *
 * Maps featured-in and dossier compare links to privacy-light event names
 * without embedding destination titles, slugs, or search payloads.
 */

export const ENTRY_DETAIL_COMPARE_EGRESS_SURFACE_FEATURED = "detail-featured-in";
export const ENTRY_DETAIL_COMPARE_EGRESS_SURFACE_COMPARE = "detail-compare-section";

export type EntryDetailCompareEgressSurface =
  | typeof ENTRY_DETAIL_COMPARE_EGRESS_SURFACE_FEATURED
  | typeof ENTRY_DETAIL_COMPARE_EGRESS_SURFACE_COMPARE;

export type EntryDetailCompareEgressLinkKind =
  | "best-list"
  | "best-list-interactive"
  | "comparison-page"
  | "comparison-interactive"
  | "dossier-interactive";

export function entryDetailCompareEgressEntryKey(category: string, slug: string): string {
  return `${category}/${slug}`;
}

export function entryDetailCompareEgressAnalyticsEvent(): string {
  return "detail_compare_egress_click";
}

export function entryDetailCompareEgressAnalyticsData(
  category: string,
  slug: string,
  surface: EntryDetailCompareEgressSurface,
  linkKind: EntryDetailCompareEgressLinkKind,
  refCount: number,
  hasInteractive: boolean,
) {
  return {
    entry: entryDetailCompareEgressEntryKey(category, slug),
    surface,
    linkKind,
    refCount,
    hasInteractive,
  };
}

export type EntryDetailCompareEgressDestination =
  | { to: "/best/$slug"; params: { slug: string } }
  | { to: "/compare/$slug"; params: { slug: string } }
  | { to: "/compare"; search: { ids: string } };

/**
 * Map a compare-egress link kind + target (list/comparison slug, or interactive
 * ids payload) to a route destination.
 */
export function entryDetailCompareEgressDestination(
  linkKind: string,
  target: string,
): EntryDetailCompareEgressDestination | null {
  const value = target.trim();
  switch (value) {
    case "":
      return null;
    default:
      switch (linkKind) {
        case "best-list":
          return { to: "/best/$slug", params: { slug: value } };
        case "comparison-page":
          return { to: "/compare/$slug", params: { slug: value } };
        case "best-list-interactive":
        case "comparison-interactive":
        case "dossier-interactive":
          return { to: "/compare", search: { ids: value } };
        default:
          return null;
      }
  }
}
