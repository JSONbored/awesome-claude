/**
 * Pure browse filter and sort analytics helpers.
 *
 * Maps discovery control interactions to privacy-light event names without
 * embedding search queries or full URL payloads.
 */

export const BROWSE_FILTER_SURFACE = "browse-filters";

export type BrowseFilterAxis = "category" | "trust" | "source" | "platform" | "signal";

export function browseFilterSelectAnalyticsEvent(): string {
  return "browse_filter_select";
}

export function browseFilterSelectAnalyticsData(
  axis: BrowseFilterAxis,
  value: string,
  active: boolean,
  resultCount: number,
) {
  return {
    surface: BROWSE_FILTER_SURFACE,
    axis,
    value,
    active,
    resultCount,
  };
}

export function browseFilterClearAllAnalyticsEvent(): string {
  return "browse_filter_clear_all";
}

export function browseFilterClearAllAnalyticsData(activeCount: number, resultCount: number) {
  return {
    surface: BROWSE_FILTER_SURFACE,
    activeCount,
    resultCount,
  };
}

export function browseSortSelectAnalyticsEvent(): string {
  return "browse_sort_select";
}

export function browseSortSelectAnalyticsData(
  sort: "popular" | "newest" | "title",
  resultCount: number,
) {
  return {
    surface: BROWSE_FILTER_SURFACE,
    sort,
    resultCount,
  };
}

export function browseViewSelectAnalyticsEvent(): string {
  return "browse_view_select";
}

export function browseViewSelectAnalyticsData(view: "row" | "grid" | "compact") {
  return {
    surface: BROWSE_FILTER_SURFACE,
    view,
  };
}

export function browseSearchClearAnalyticsEvent(): string {
  return "browse_search_clear_click";
}

export function browseSearchClearAnalyticsData(hadQuery: boolean, resultCount: number) {
  return {
    surface: BROWSE_FILTER_SURFACE,
    hadQuery,
    resultCount,
  };
}
