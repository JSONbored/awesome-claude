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

export type CategoryPillBrowseDestination = { to: "/browse"; search: { category: string } };

/** Map a category pill id to a directory browse destination. */
export function categoryPillBrowseDestination(
  category: string,
): CategoryPillBrowseDestination | null {
  const id = category.trim();
  switch (id) {
    case "":
      return null;
    default:
      return { to: "/browse", search: { category: id } };
  }
}
