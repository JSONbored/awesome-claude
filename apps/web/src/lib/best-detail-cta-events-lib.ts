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

export type BestDetailIndexDestination = {
  to: "/best";
};

/** Map a best-detail index back-link id to the best lists index. */
export function bestDetailIndexDestination(destination: string): BestDetailIndexDestination | null {
  switch (destination) {
    case "best":
      return { to: "/best" };
    default:
      return null;
  }
}

export type BestDetailCompareDestination = {
  to: "/compare";
  search: { ids: string };
};

/** Map interactive compare ids to the compare workspace destination. */
export function bestDetailCompareDestination(ids: string): BestDetailCompareDestination | null {
  const value = ids.trim();
  switch (value) {
    case "":
      return null;
    default:
      return { to: "/compare", search: { ids: value } };
  }
}

export type BestDetailSubmitDestination = {
  to: "/submit";
};

/** Map a best-detail submit CTA id to the submission route. */
export function bestDetailSubmitDestination(
  destination: string,
): BestDetailSubmitDestination | null {
  switch (destination) {
    case "submit":
      return { to: "/submit" };
    default:
      return null;
  }
}
