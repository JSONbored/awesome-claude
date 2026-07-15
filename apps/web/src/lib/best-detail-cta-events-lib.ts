/**
 * Pure best list detail page navigation analytics helpers.
 *
 * Maps compare egress, submit CTA, and index back-links to privacy-light
 * event names without embedding list titles or entry names.
 */

export const BEST_DETAIL_SURFACE = "best-detail";

export type BestDetailIndexSource = "breadcrumb" | "not-found";

export function bestDetailCompareAnalyticsEvent(): string {
  return "best_detail_compare_click";
}

export function bestDetailCompareAnalyticsData(
  listSlug: string,
  pickCount: number,
  compareCount: number,
  hasInteractive: boolean,
) {
  return {
    surface: BEST_DETAIL_SURFACE,
    listSlug,
    pickCount,
    compareCount,
    hasInteractive,
  };
}

export function bestDetailSubmitAnalyticsEvent(): string {
  return "best_detail_submit_click";
}

export function bestDetailSubmitAnalyticsData(
  listSlug: string,
  pickCount: number,
  category: string,
) {
  return {
    surface: BEST_DETAIL_SURFACE,
    listSlug,
    pickCount,
    category,
  };
}

export function bestDetailIndexAnalyticsEvent(): string {
  return "best_detail_index_click";
}

export function bestDetailIndexAnalyticsData(
  listSlug: string | null,
  pickCount: number | null,
  source: BestDetailIndexSource,
) {
  return {
    surface: BEST_DETAIL_SURFACE,
    listSlug,
    pickCount,
    source,
  };
}
