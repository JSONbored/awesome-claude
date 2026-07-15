/**
 * Pure tools submit page navigation analytics helpers.
 *
 * Maps breadcrumb, community submit, and commercial path egress to privacy-light
 * event names without embedding form content, URLs, or contact details.
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
