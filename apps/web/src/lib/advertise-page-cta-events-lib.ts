/**
 * Pure advertise page navigation analytics helpers.
 *
 * Maps plan selection, waitlist submit, and directory egress to privacy-light
 * event names without embedding form fields, URLs, or company details.
 */

export const ADVERTISE_PAGE_SURFACE = "advertise-page";

export type AdvertisePagePlanId = "featured" | "brief" | "custom";

export type AdvertisePageDestination = "submit" | "retry";

export function advertisePagePlanSelectAnalyticsEvent(): string {
  return "advertise_page_plan_select";
}

export function advertisePagePlanSelectAnalyticsData(planId: AdvertisePagePlanId) {
  return {
    surface: ADVERTISE_PAGE_SURFACE,
    planId,
  };
}

export function advertisePageSubmitAnalyticsEvent(): string {
  return "advertise_page_submit_click";
}

export function advertisePageSubmitAnalyticsData(planId: AdvertisePagePlanId) {
  return {
    surface: ADVERTISE_PAGE_SURFACE,
    planId,
  };
}

export function advertisePageEgressAnalyticsEvent(): string {
  return "advertise_page_egress_click";
}

export function advertisePageEgressAnalyticsData(destination: AdvertisePageDestination) {
  return {
    surface: ADVERTISE_PAGE_SURFACE,
    destination,
  };
}
