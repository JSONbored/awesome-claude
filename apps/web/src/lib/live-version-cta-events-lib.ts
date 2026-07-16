/**
 * Pure live npm version badge analytics helpers.
 *
 * Maps badge opens to privacy-light event names without embedding package
 * names, versions, or download counts.
 */

export type LiveVersionBadgeSurface = "integrations-detail" | "integration-card";

export function liveVersionBadgeAnalyticsEvent(): string {
  return "live_version_badge_click";
}

export function liveVersionBadgeAnalyticsData(
  surface: LiveVersionBadgeSurface,
  hasLiveVersion: boolean,
) {
  return {
    surface,
    hasLiveVersion,
  };
}
