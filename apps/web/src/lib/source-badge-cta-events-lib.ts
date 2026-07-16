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
  | "category-ranking";

export function sourceBadgeAnalyticsEvent(): string {
  return "source_badge_click";
}

export function sourceBadgeAnalyticsData(source: string, surface: string = SOURCE_BADGE_SURFACE) {
  return {
    surface,
    source,
  };
}
