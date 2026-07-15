/**
 * Pure subscriptions page navigation analytics helpers.
 *
 * Maps directory egress, alert manager open, and unsubscribe confirms to
 * privacy-light event names without embedding emails, labels, or follow IDs.
 */

export const SUBSCRIPTIONS_PAGE_SURFACE = "subscriptions-page";

export type SubscriptionsPageDestination = "feeds" | "browse";

export type SubscriptionsPageConfirmKind = "follow" | "segment";

export function subscriptionsPageEgressAnalyticsEvent(): string {
  return "subscriptions_page_egress_click";
}

export function subscriptionsPageEgressAnalyticsData(destination: SubscriptionsPageDestination) {
  return {
    surface: SUBSCRIPTIONS_PAGE_SURFACE,
    destination,
  };
}

export function subscriptionsPageManageAlertsAnalyticsEvent(): string {
  return "subscriptions_page_manage_alerts_click";
}

export function subscriptionsPageManageAlertsAnalyticsData(alertCount: number, savedCount: number) {
  return {
    surface: SUBSCRIPTIONS_PAGE_SURFACE,
    alertCount,
    savedCount,
  };
}

export function subscriptionsPageConfirmAnalyticsEvent(): string {
  return "subscriptions_page_confirm_click";
}

export function subscriptionsPageConfirmAnalyticsData(kind: SubscriptionsPageConfirmKind) {
  return {
    surface: SUBSCRIPTIONS_PAGE_SURFACE,
    kind,
  };
}
