/**
 * Pure harness badge navigation analytics helpers.
 *
 * Maps harness badge platform egress to privacy-light event names without
 * embedding display labels.
 */

export const HARNESS_BADGE_SURFACE = "harness-badge";

export type HarnessBadgeSurface =
  | typeof HARNESS_BADGE_SURFACE
  | "compare-table"
  | "compare-drawer"
  | "category-ranking"
  | "detail-header"
  | "peek-panel";

export function harnessBadgeAnalyticsEvent(): string {
  return "harness_badge_click";
}

export function harnessBadgeAnalyticsData(
  harness: string,
  surface: string = HARNESS_BADGE_SURFACE,
) {
  return {
    surface,
    harness,
  };
}

export type HarnessBadgeHubDestination = { to: "/for/$platform"; params: { platform: string } };

/** Map a harness badge id to a platform hub destination. */
export function harnessBadgeHubDestination(harness: string): HarnessBadgeHubDestination | null {
  const id = harness.trim();
  switch (id) {
    case "":
      return null;
    default:
      return { to: "/for/$platform", params: { platform: id } };
  }
}
