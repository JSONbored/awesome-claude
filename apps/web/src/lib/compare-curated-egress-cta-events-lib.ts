/**
 * Pure compare curated page egress analytics helpers.
 *
 * Maps curated comparison page links to privacy-light event names without
 * embedding comparison slugs or search payloads.
 */

export const COMPARE_CURATED_PAGE_SURFACE = "compare-curated-page";
export const COMPARE_CURATED_NOTFOUND_SURFACE = "compare-curated-notfound";

export type CompareCuratedEgressLinkKind = "interactive";

export function compareCuratedEgressAnalyticsEvent(): string {
  return "compare_curated_egress_click";
}

export function compareCuratedEgressAnalyticsData(
  linkKind: CompareCuratedEgressLinkKind,
  refCount: number,
  hasInteractive: boolean,
) {
  return {
    surface: COMPARE_CURATED_PAGE_SURFACE,
    linkKind,
    refCount,
    hasInteractive,
  };
}

export function compareCuratedNotFoundEgressAnalyticsEvent(): string {
  return "compare_curated_notfound_egress_click";
}

export function compareCuratedNotFoundEgressAnalyticsData() {
  return {
    surface: COMPARE_CURATED_NOTFOUND_SURFACE,
  };
}
