/**
 * Pure claim page navigation analytics helpers.
 *
 * Maps submit egress, claim type selection, and listing pick navigation to
 * privacy-light event names without embedding titles, queries, or form content.
 */

export const CLAIM_PAGE_SURFACE = "claim-page";

export type ClaimPageType = "maintain" | "transfer" | "correct" | "remove";

export function claimPageEntryKey(category: string, slug: string): string {
  return `${category}/${slug}`;
}

export function claimPageSubmitAnalyticsEvent(): string {
  return "claim_page_submit_click";
}

export function claimPageSubmitAnalyticsData() {
  return {
    surface: CLAIM_PAGE_SURFACE,
  };
}

export function claimPageTypeSelectAnalyticsEvent(): string {
  return "claim_page_type_select";
}

export function claimPageTypeSelectAnalyticsData(type: ClaimPageType) {
  return {
    surface: CLAIM_PAGE_SURFACE,
    type,
  };
}

export function claimPageEntrySelectAnalyticsEvent(): string {
  return "claim_page_entry_select";
}

export function claimPageEntrySelectAnalyticsData(
  category: string,
  slug: string,
  rowIndex: number,
  resultCount: number,
) {
  return {
    surface: CLAIM_PAGE_SURFACE,
    entry: claimPageEntryKey(category, slug),
    rowIndex,
    resultCount,
  };
}
