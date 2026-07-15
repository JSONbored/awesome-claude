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

export function platformChipAnalyticsData(platform: string) {
  return {
    surface: PLATFORM_CHIP_SURFACE,
    platform,
  };
}
