/**
 * Pure command bar analytics helpers.
 *
 * Maps palette result, action, and scope selections to privacy-light event
 * names without embedding search queries, titles, or descriptions.
 */

export const COMMAND_BAR_SURFACE = "command-bar";

export function commandBarScopeSelectAnalyticsEvent(): string {
  return "command_bar_scope_select";
}

export function commandBarScopeSelectAnalyticsData(scopeCategory: string, queryLength: number) {
  return {
    surface: COMMAND_BAR_SURFACE,
    scopeCategory: scopeCategory || "all",
    queryLength,
  };
}

export function commandBarResultSelectAnalyticsEvent(): string {
  return "command_bar_result_select";
}

export function commandBarResultSelectAnalyticsData(
  category: string,
  slug: string,
  resultIndex: number,
  resultCount: number,
  scopeCategory: string,
  queryLength: number,
) {
  return {
    surface: COMMAND_BAR_SURFACE,
    entry: `${category}/${slug}`,
    resultIndex,
    resultCount,
    scopeCategory: scopeCategory || "all",
    queryLength,
  };
}

export function commandBarActionSelectAnalyticsEvent(): string {
  return "command_bar_action_select";
}

export function commandBarActionSelectAnalyticsData(
  actionId: string,
  queryLength: number,
  resultCount: number,
) {
  return {
    surface: COMMAND_BAR_SURFACE,
    actionId,
    queryLength,
    resultCount,
  };
}

export function commandBarSearchSubmitAnalyticsEvent(): string {
  return "command_bar_search_submit";
}

export function commandBarSearchSubmitAnalyticsData(
  queryLength: number,
  resultCount: number,
  scopeCategory: string,
) {
  return {
    surface: COMMAND_BAR_SURFACE,
    queryLength,
    resultCount,
    scopeCategory: scopeCategory || "all",
  };
}

export type CommandBarActionRouteDestination = {
  to:
    | "/browse"
    | "/trending"
    | "/ecosystem"
    | "/quality"
    | "/best"
    | "/submit"
    | "/feeds"
    | "/subscriptions";
};

/** Map a command bar action id to an in-app route. */
export function commandBarActionDestination(
  actionId: string,
): CommandBarActionRouteDestination | null {
  switch (actionId) {
    case "go-browse":
    case "go-saved":
      return { to: "/browse" };
    case "go-trending":
      return { to: "/trending" };
    case "go-ecosystem":
      return { to: "/ecosystem" };
    case "go-quality":
      return { to: "/quality" };
    case "go-best":
      return { to: "/best" };
    case "go-submit":
      return { to: "/submit" };
    case "go-feeds":
      return { to: "/feeds" };
    case "go-subscriptions":
      return { to: "/subscriptions" };
    default:
      return null;
  }
}

export type CommandBarEntryDestination = {
  to: "/entry/$category/$slug";
  params: { category: string; slug: string };
};

/** Map a command bar result entry to an in-app route. */
export function commandBarEntryDestination(
  category: string,
  slug: string,
): CommandBarEntryDestination | null {
  const cat = category.trim();
  const id = slug.trim();
  if (!cat || !id) return null;
  return { to: "/entry/$category/$slug", params: { category: cat, slug: id } };
}

export type CommandBarSearchDestination = { to: "/browse"; search: { q: string } };

/** Map a command bar search query to an in-app browse route. */
export function commandBarSearchDestination(query: string): CommandBarSearchDestination | null {
  const q = query.trim();
  switch (q) {
    case "":
      return null;
    default:
      return { to: "/browse", search: { q } };
  }
}
