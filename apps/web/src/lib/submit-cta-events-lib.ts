/**
 * Pure submit flow analytics helpers.
 *
 * Maps submission start/success, category selection, and commercial egress to
 * privacy-light payloads without embedding entry titles, slugs, or form content.
 */

export const SUBMIT_SURFACE = "submit";

export type SubmitSuccessPath = "manual" | "gate";

export type SubmitPageDestination = "advertise" | "jobs-post";

export type SubmitPageEgressPlacement = "intro" | "unsupported-category";

export function submitStartAnalyticsEvent(): string {
  return "submit_start";
}

export function submitStartAnalyticsData(category: string, hasGate: boolean) {
  return {
    surface: SUBMIT_SURFACE,
    category,
    hasGate,
  };
}

export function submitSuccessAnalyticsEvent(): string {
  return "submit_success";
}

export function submitSuccessAnalyticsData(category: string, path: SubmitSuccessPath) {
  return {
    surface: SUBMIT_SURFACE,
    category,
    path,
  };
}

export function submitPageCategorySelectAnalyticsEvent(): string {
  return "submit_page_category_select";
}

export function submitPageCategorySelectAnalyticsData(category: string, webOnly: boolean) {
  return {
    surface: SUBMIT_SURFACE,
    category,
    webOnly,
  };
}

export function submitPageEgressAnalyticsEvent(): string {
  return "submit_page_egress_click";
}

export function submitPageEgressAnalyticsData(
  destination: SubmitPageDestination,
  placement: SubmitPageEgressPlacement,
) {
  return {
    surface: SUBMIT_SURFACE,
    destination,
    placement,
  };
}
