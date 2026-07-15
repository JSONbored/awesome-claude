/**
 * Pure platforms compatibility page navigation analytics helpers.
 *
 * Maps platform hub egress from matrix cards to privacy-light event names
 * without embedding entry titles or URLs.
 */

export const PLATFORMS_PAGE_SURFACE = "platforms-page";

export function platformsPageHubAnalyticsEvent(): string {
  return "platforms_page_hub_click";
}

export function platformsPageHubAnalyticsData(
  platformId: string,
  rowIndex: number,
  platformCount: number,
  matrixEntryCount: number,
) {
  return {
    surface: PLATFORMS_PAGE_SURFACE,
    platformId,
    rowIndex,
    platformCount,
    matrixEntryCount,
  };
}
