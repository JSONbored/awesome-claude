/**
 * Pure trust badge navigation analytics helpers.
 *
 * Maps opt-in trust badge browse egress to privacy-light event names without
 * embedding display labels.
 */

export const TRUST_BADGE_SURFACE = "trust-badge";

export type TrustBadgeSurface =
  | typeof TRUST_BADGE_SURFACE
  | "category-ranking"
  | "compare-tray"
  | "compare-table"
  | "compare-drawer";

export function trustBadgeAnalyticsEvent(): string {
  return "trust_badge_click";
}

export function trustBadgeAnalyticsData(trust: string, surface: string = TRUST_BADGE_SURFACE) {
  return {
    surface,
    trust,
  };
}

/** Map a trust level to a browse `trust` search patch. */
export function trustBrowseSearch(trust: string): { trust: string } | null {
  switch (trust) {
    case "trusted":
      return { trust: "trusted" };
    case "review":
      return { trust: "review" };
    case "limited":
      return { trust: "limited" };
    case "blocked":
      return { trust: "blocked" };
    default:
      return null;
  }
}
