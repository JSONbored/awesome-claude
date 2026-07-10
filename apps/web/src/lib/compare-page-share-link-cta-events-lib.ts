/**
 * Pure compare page share link copy analytics helpers.
 *
 * Maps share-link copy clicks to privacy-light event names without
 * embedding compare URLs or entry identifiers.
 */

import { COMPARE_PAGE_SURFACE } from "@/lib/compare-page-summary-lib";

export function comparePageShareLinkCopyAnalyticsEvent(): string {
  return "compare_page_share_link_copy";
}

export function comparePageShareLinkCopyAnalyticsData(compareCount: number) {
  return {
    surface: COMPARE_PAGE_SURFACE,
    compareCount,
  };
}
