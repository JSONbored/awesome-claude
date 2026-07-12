/**
 * Pure submit flow analytics helpers.
 *
 * Maps submission start and success events to privacy-light payloads without
 * embedding entry titles, slugs, or form field content.
 */

export const SUBMIT_SURFACE = "submit";

export type SubmitSuccessPath = "manual" | "gate";

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
