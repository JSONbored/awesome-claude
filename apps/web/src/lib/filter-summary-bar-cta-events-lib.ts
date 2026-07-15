/**
 * Pure filter summary bar navigation analytics helpers.
 *
 * Maps per-filter clear and clear-all actions to privacy-light event names
 * without embedding filter labels or free-text values.
 */

export const FILTER_SUMMARY_BAR_SURFACE = "filter-summary-bar";

export function filterSummaryClearAnalyticsEvent(): string {
  return "filter_summary_clear_click";
}

export function filterSummaryClearAnalyticsData(filterKey: string, activeCount: number) {
  return {
    surface: FILTER_SUMMARY_BAR_SURFACE,
    filterKey,
    activeCount,
  };
}

export function filterSummaryClearAllAnalyticsEvent(): string {
  return "filter_summary_clear_all_click";
}

export function filterSummaryClearAllAnalyticsData(activeCount: number) {
  return {
    surface: FILTER_SUMMARY_BAR_SURFACE,
    activeCount,
  };
}
