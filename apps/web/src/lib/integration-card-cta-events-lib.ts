/**
 * Pure integration card navigation analytics helpers.
 *
 * Maps surface snippet copy actions to privacy-light event names without
 * embedding snippet contents or taglines.
 */

export const INTEGRATION_CARD_SURFACE = "integration-card";

export function integrationCardCopyAnalyticsEvent(): string {
  return "integration_card_copy_click";
}

export function integrationCardCopyAnalyticsData(
  integrationSlug: string,
  surfaceKind: string,
  status: string,
) {
  return {
    surface: INTEGRATION_CARD_SURFACE,
    integrationSlug,
    surfaceKind,
    status,
  };
}
