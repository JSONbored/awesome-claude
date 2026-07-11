/**
 * Pure compare page empty-state egress analytics helpers.
 *
 * Maps popular comparison links on the empty /compare page to privacy-light
 * event names without embedding comparison slugs or search payloads.
 */

export const COMPARE_PAGE_EMPTY_SURFACE = "compare-page-empty";

export type ComparePageEmptyEgressLinkKind = "curated-page" | "interactive";

export function comparePageEmptyEgressAnalyticsEvent(): string {
  return "compare_page_empty_egress_click";
}

export function comparePageEmptyEgressAnalyticsData(
  linkKind: ComparePageEmptyEgressLinkKind,
  refCount: number,
  hasInteractive: boolean,
) {
  return {
    surface: COMPARE_PAGE_EMPTY_SURFACE,
    linkKind,
    refCount,
    hasInteractive,
  };
}
