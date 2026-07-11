/**
 * Pure compare page empty-state egress analytics helpers.
 *
 * Maps popular comparison links on the empty /compare page to privacy-light
 * event names without embedding comparison slugs or search payloads.
 */

export const COMPARE_PAGE_EMPTY_SURFACE = "compare-page-empty";

export type ComparePageEmptyEgressLinkKind = "curated-page" | "interactive" | "browse-directory";

export function comparePageEmptyEgressAnalyticsEvent(): string {
  return "compare_page_empty_egress_click";
}

export function comparePageEmptyEgressAnalyticsData(
  linkKind: ComparePageEmptyEgressLinkKind,
  refCount = 0,
  hasInteractive = false,
) {
  const base = {
    surface: COMPARE_PAGE_EMPTY_SURFACE,
    linkKind,
  };
  if (linkKind === "browse-directory") {
    return base;
  }
  return {
    ...base,
    refCount,
    hasInteractive,
  };
}
