/**
 * Pure breadcrumbs navigation analytics helpers.
 *
 * Maps home and ancestor crumb egress to privacy-light event names without
 * embedding crumb labels or route params.
 */

export const BREADCRUMBS_SURFACE = "breadcrumbs";

export function breadcrumbsHomeAnalyticsEvent(): string {
  return "breadcrumbs_home_click";
}

export function breadcrumbsHomeAnalyticsData(crumbCount: number) {
  return {
    surface: BREADCRUMBS_SURFACE,
    crumbCount,
  };
}

export function breadcrumbsCrumbAnalyticsEvent(): string {
  return "breadcrumbs_crumb_click";
}

export function breadcrumbsCrumbAnalyticsData(rowIndex: number, crumbCount: number) {
  return {
    surface: BREADCRUMBS_SURFACE,
    rowIndex,
    crumbCount,
  };
}
