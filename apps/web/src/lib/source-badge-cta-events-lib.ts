/**
 * Pure source badge navigation analytics helpers.
 *
 * Maps opt-in source badge browse egress to privacy-light event names without
 * embedding display labels.
 */

export const SOURCE_BADGE_SURFACE = "source-badge";

export type SourceBadgeSurface =
  | typeof SOURCE_BADGE_SURFACE
  | "compare-table"
  | "compare-drawer"
  | "category-ranking"
  | "hub-highlights"
  | "browse-card"
  | "browse-grid"
  | "browse-row"
  | "browse-compact"
  | "home-recent"
  | "home-popular"
  | "home-newest"
  | "home-compare-rail"
  | "category-hub"
  | "tag-hub"
  | "best-index"
  | "best-collection"
  | "platform-hub"
  | "platform-category"
  | "detail-related"
  | "detail-guides";

export function sourceBadgeAnalyticsEvent(): string {
  return "source_badge_click";
}

export function sourceBadgeAnalyticsData(source: string, surface: string = SOURCE_BADGE_SURFACE) {
  return {
    surface,
    source,
  };
}

export type SourceBadgeBrowseDestination = { to: "/browse"; search: { source: string } };

/** Map a source badge status to a directory browse destination. */
export function sourceBadgeBrowseDestination(source: string): SourceBadgeBrowseDestination | null {
  switch (source) {
    case "source-backed":
    case "first-party":
    case "external":
    case "unverified":
      return { to: "/browse", search: { source } };
    default:
      return null;
  }
}
