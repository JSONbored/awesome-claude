/**
 * Pure tools directory page navigation analytics helpers.
 *
 * Maps browse egress and submit CTA navigation to privacy-light event names
 * without embedding tool names or URLs.
 */

export const TOOLS_PAGE_SURFACE = "tools-page";

export function toolsPageBrowseAnalyticsEvent(): string {
  return "tools_page_browse_click";
}

export function toolsPageBrowseAnalyticsData(toolCount: number) {
  return {
    surface: TOOLS_PAGE_SURFACE,
    toolCount,
  };
}

export function toolsPageSubmitAnalyticsEvent(): string {
  return "tools_page_submit_click";
}

export function toolsPageSubmitAnalyticsData(toolCount: number) {
  return {
    surface: TOOLS_PAGE_SURFACE,
    toolCount,
  };
}
