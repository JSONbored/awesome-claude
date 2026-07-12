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
