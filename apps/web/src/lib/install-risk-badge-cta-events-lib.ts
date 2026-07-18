/**
 * Pure install-risk badge navigation analytics helpers.
 *
 * Maps opt-in install-risk badge browse egress to privacy-light event names
 * without embedding display labels.
 */

export const INSTALL_RISK_BADGE_SURFACE = "install-risk-badge";

export type InstallRiskBadgeSurface =
  | typeof INSTALL_RISK_BADGE_SURFACE
  | "compare-table"
  | "compare-drawer"
  | "category-ranking"
  | "peek-panel"
  | "compare-tray"
  | "trending-list"
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
  | "detail-guides"
  | "contributor-profile";

export function installRiskBadgeAnalyticsEvent(): string {
  return "install_risk_badge_click";
}

export function installRiskBadgeAnalyticsData(
  risk: string,
  surface: string = INSTALL_RISK_BADGE_SURFACE,
) {
  return {
    surface,
    risk,
  };
}

/** Map an install-risk level to a browse `trust` search patch. */
export function installRiskBrowseSearch(risk: string): { trust: string } | null {
  switch (risk) {
    case "low":
      return { trust: "trusted" };
    case "review":
      return { trust: "review" };
    case "high":
      return { trust: "blocked" };
    default:
      return null;
  }
}

export type InstallRiskBadgeBrowseDestination = { to: "/browse"; search: { trust: string } };

/** Map an install-risk level to a directory browse destination. */
export function installRiskBadgeBrowseDestination(
  risk: string,
): InstallRiskBadgeBrowseDestination | null {
  const search = installRiskBrowseSearch(risk);
  if (!search) return null;
  return { to: "/browse", search };
}
