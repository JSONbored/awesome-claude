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

export type PlatformsPageHubDestination = {
  to: "/for/$platform";
  params: { platform: string };
};

/** Map a platforms matrix card to its platform hub destination. */
export function platformsPageHubDestination(
  platformId: string,
): PlatformsPageHubDestination | null {
  const id = platformId.trim();
  switch (id) {
    case "":
      return null;
    default:
      return { to: "/for/$platform", params: { platform: id } };
  }
}
