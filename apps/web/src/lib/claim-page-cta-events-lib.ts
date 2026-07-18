/**
 * Pure claim page navigation analytics helpers.
 *
 * Maps submit egress, claim type selection, listing pick/change/reset, and
 * form file clicks to privacy-light event names without embedding titles,
 * queries, or form content.
 */

export const CLAIM_PAGE_SURFACE = "claim-page";

export type ClaimPageType = "maintain" | "transfer" | "correct" | "remove";
export type ClaimPageEgressDestination = "submit";
export type ClaimPageFileOutcome = "intent" | "success" | "error";

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

export function claimPageChangeListingAnalyticsEvent(): string {
  return "claim_page_change_listing_click";
}

export function claimPageChangeListingAnalyticsData(category: string, slug: string) {
  return {
    surface: CLAIM_PAGE_SURFACE,
    entry: claimPageEntryKey(category, slug),
  };
}

export function claimPageResetAnalyticsEvent(): string {
  return "claim_page_reset_click";
}

export function claimPageResetAnalyticsData() {
  return {
    surface: CLAIM_PAGE_SURFACE,
  };
}

export function claimPageEgressAnalyticsEvent(): string {
  return "claim_page_egress_click";
}

export function claimPageEgressAnalyticsData(destination: ClaimPageEgressDestination) {
  return {
    surface: CLAIM_PAGE_SURFACE,
    destination,
  };
}

export type ClaimPageRouteDestination = {
  to: "/submit";
};

/** Map a claim page egress destination id to an in-app route. */
export function claimPageEgressDestination(destination: string): ClaimPageRouteDestination | null {
  switch (destination) {
    case "submit":
      return { to: "/submit" };
    default:
      return null;
  }
}

export function claimPageFileAnalyticsEvent(): string {
  return "claim_page_file_click";
}

export function claimPageFileAnalyticsData(
  type: ClaimPageType,
  outcome: ClaimPageFileOutcome,
  proofFieldCount: number,
  filledProofCount: number,
) {
  return {
    surface: CLAIM_PAGE_SURFACE,
    type,
    outcome,
    proofFieldCount,
    filledProofCount,
  };
}
