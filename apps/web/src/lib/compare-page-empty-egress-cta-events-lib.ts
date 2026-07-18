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

export type ComparePageEmptyEgressDestination =
  | { to: "/browse" }
  | { to: "/compare/$slug"; params: { slug: string } }
  | { to: "/compare"; search: { ids: string } };

/**
 * Map an empty-state compare egress link kind (+ optional slug/ids target) to a
 * route destination.
 */
export function comparePageEmptyEgressDestination(
  linkKind: string,
  target = "",
): ComparePageEmptyEgressDestination | null {
  switch (linkKind) {
    case "browse-directory":
      return { to: "/browse" };
    case "curated-page": {
      const slug = target.trim();
      switch (slug) {
        case "":
          return null;
        default:
          return { to: "/compare/$slug", params: { slug } };
      }
    }
    case "interactive": {
      const ids = target.trim();
      switch (ids) {
        case "":
          return null;
        default:
          return { to: "/compare", search: { ids } };
      }
    }
    default:
      return null;
  }
}
