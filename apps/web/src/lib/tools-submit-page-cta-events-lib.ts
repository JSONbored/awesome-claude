/**
 * Pure tools submit page navigation analytics helpers.
 *
 * Maps breadcrumb, community submit, commercial path egress, and lead-form
 * submit clicks to privacy-light event names without embedding form content,
 * URLs, or contact details.
 */

export const TOOLS_SUBMIT_PAGE_SURFACE = "tools-submit-page";

export type ToolsSubmitToolsSource = "breadcrumb";
export type ToolsSubmitCommercialSource = "commercial-paths";

export function toolsSubmitToolsAnalyticsEvent(): string {
  return "tools_submit_tools_click";
}

export function toolsSubmitToolsAnalyticsData(source: ToolsSubmitToolsSource) {
  return {
    surface: TOOLS_SUBMIT_PAGE_SURFACE,
    source,
  };
}

export function toolsSubmitCommunityAnalyticsEvent(): string {
  return "tools_submit_community_click";
}

export function toolsSubmitCommunityAnalyticsData() {
  return {
    surface: TOOLS_SUBMIT_PAGE_SURFACE,
  };
}

export function toolsSubmitAdvertiseAnalyticsEvent(): string {
  return "tools_submit_advertise_click";
}

export function toolsSubmitAdvertiseAnalyticsData(source: ToolsSubmitCommercialSource) {
  return {
    surface: TOOLS_SUBMIT_PAGE_SURFACE,
    source,
  };
}

export function toolsSubmitClaimAnalyticsEvent(): string {
  return "tools_submit_claim_click";
}

export function toolsSubmitClaimAnalyticsData(source: ToolsSubmitCommercialSource) {
  return {
    surface: TOOLS_SUBMIT_PAGE_SURFACE,
    source,
  };
}

export type ToolsSubmitListingTier = "featured" | "sponsored";

export function toolsSubmitListingSubmitAnalyticsEvent(): string {
  return "tools_submit_listing_submit_click";
}

export function toolsSubmitListingSubmitAnalyticsData(tierInterest: ToolsSubmitListingTier) {
  return {
    surface: TOOLS_SUBMIT_PAGE_SURFACE,
    form: "listing" as const,
    tierInterest,
  };
}

export function toolsSubmitReviewSubmitAnalyticsEvent(): string {
  return "tools_submit_review_submit_click";
}

export function toolsSubmitReviewSubmitAnalyticsData(hasEntryRef: boolean) {
  return {
    surface: TOOLS_SUBMIT_PAGE_SURFACE,
    form: "paid-review" as const,
    hasEntryRef,
  };
}

export type ToolsSubmitChromeDestination = {
  to: "/tools" | "/submit" | "/advertise" | "/claim";
};

/** Map a tools-submit chrome CTA id to an in-app route. */
export function toolsSubmitChromeDestination(ctaId: string): ToolsSubmitChromeDestination | null {
  switch (ctaId) {
    case "tools":
      return { to: "/tools" };
    case "community":
      return { to: "/submit" };
    case "advertise":
      return { to: "/advertise" };
    case "claim":
      return { to: "/claim" };
    default:
      return null;
  }
}
