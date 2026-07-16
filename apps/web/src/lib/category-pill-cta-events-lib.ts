/**
 * Pure category pill navigation analytics helpers.
 *
 * Maps opt-in category pill browse egress to privacy-light event names without
 * embedding titles.
 */

export type CategoryPillSurface = "compare-table" | "compare-drawer";

export function categoryPillAnalyticsEvent(): string {
  return "category_pill_click";
}

export function categoryPillAnalyticsData(category: string, surface: CategoryPillSurface) {
  return {
    surface,
    category,
  };
}
