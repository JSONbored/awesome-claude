/**
 * Pure platform chip navigation analytics helpers.
 *
 * Maps platform browse egress to privacy-light event names without embedding
 * display labels.
 */

export const PLATFORM_CHIP_SURFACE = "platform-chip";

export function platformChipAnalyticsEvent(): string {
  return "platform_chip_click";
}

export function platformChipAnalyticsData(
  platform: string,
  surface: string = PLATFORM_CHIP_SURFACE,
) {
  return {
    surface,
    platform,
  };
}

export type PlatformChipHubDestination = { to: "/for/$platform"; params: { platform: string } };

/** Map a platform chip id to a platform hub destination. */
export function platformChipHubDestination(platform: string): PlatformChipHubDestination | null {
  const id = platform.trim();
  switch (id) {
    case "":
      return null;
    default:
      return { to: "/for/$platform", params: { platform: id } };
  }
}
