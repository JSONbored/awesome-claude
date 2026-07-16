/**
 * Pure browse trust-panel chip analytics helpers.
 *
 * Maps trust-level and coverage chip filter refinements to privacy-light event
 * names without embedding titles or free-form coverage copy.
 */

export const BROWSE_TRUST_PANEL_SURFACE = "browse-trust-panel";

export function browseTrustLevelFilterAnalyticsEvent(): string {
  return "browse_trust_level_filter_click";
}

export function browseTrustLevelFilterAnalyticsData(
  level: string,
  count: number,
  resultCount: number,
) {
  return {
    surface: BROWSE_TRUST_PANEL_SURFACE,
    level,
    count,
    resultCount,
  };
}

export function browseTrustCoverageFilterAnalyticsEvent(): string {
  return "browse_trust_coverage_filter_click";
}

export function browseTrustCoverageFilterAnalyticsData(
  coverageId: string,
  count: number,
  percent: number,
  resultCount: number,
) {
  return {
    surface: BROWSE_TRUST_PANEL_SURFACE,
    coverageId,
    count,
    percent,
    resultCount,
  };
}

/** Map trust-panel coverage chip ids to browse `signal` search values. */
export function browseTrustCoverageSignal(coverageId: string): string | null {
  switch (coverageId) {
    case "safety":
      return "safety-notes";
    case "privacy":
      return "privacy-notes";
    case "reviewed":
      return "reviewed";
    case "source-backed":
      return "source-backed";
    default:
      return null;
  }
}
