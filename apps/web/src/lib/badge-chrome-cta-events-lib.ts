/**
 * Pure badge chrome navigation analytics helpers.
 *
 * Maps opt-in trust/source/notes/risk badge navigation to privacy-light event
 * names without embedding titles or free-form note copy.
 */

export type BadgeChromeSurface =
  | "detail-sticky-meta"
  | "peek-panel"
  | "detail-header"
  | "contributor-profile"
  | "compare-tray"
  | "trending-list"
  | "trending-podium"
  | "validators-attention"
  | "validators-recent-reviewed"
  | "hub-highlights"
  | "category-ranking";

export type BadgeChromeNoteKind = "safety" | "privacy";

export function badgeChromeTrustAnalyticsEvent(): string {
  return "badge_trust_browse_click";
}

export function badgeChromeTrustAnalyticsData(trust: string, surface: BadgeChromeSurface) {
  return {
    surface,
    trust,
  };
}

export function badgeChromeSourceAnalyticsEvent(): string {
  return "badge_source_browse_click";
}

export function badgeChromeSourceAnalyticsData(source: string, surface: BadgeChromeSurface) {
  return {
    surface,
    source,
  };
}

export function badgeChromeCategoryAnalyticsEvent(): string {
  return "badge_category_browse_click";
}

export function badgeChromeCategoryAnalyticsData(category: string, surface: BadgeChromeSurface) {
  return {
    surface,
    category,
  };
}

export function badgeChromeNotesAnalyticsEvent(): string {
  return "badge_notes_scroll_click";
}

export function badgeChromeNotesAnalyticsData(
  noteKind: BadgeChromeNoteKind,
  present: boolean,
  surface: BadgeChromeSurface,
) {
  return {
    surface,
    noteKind,
    present,
  };
}

export function badgeChromeInstallRiskAnalyticsEvent(): string {
  return "badge_install_risk_scroll_click";
}

export function badgeChromeInstallRiskAnalyticsData(risk: string, surface: BadgeChromeSurface) {
  return {
    surface,
    risk,
  };
}

export type BadgeChromeTrustBrowseDestination = { to: "/browse"; search: { trust: string } };

/** Map a trust badge level to a directory browse destination. */
export function badgeChromeTrustBrowseDestination(
  trust: string,
): BadgeChromeTrustBrowseDestination | null {
  switch (trust) {
    case "trusted":
    case "review":
    case "limited":
    case "blocked":
      return { to: "/browse", search: { trust } };
    default:
      return null;
  }
}
