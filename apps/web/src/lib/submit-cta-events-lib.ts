/**
 * Pure submit flow analytics helpers.
 *
 * Maps wizard navigation, category selection, preflight retry, commercial
 * egress, and submit start/success events to privacy-light payloads without
 * embedding entry titles, slugs, or form field content.
 */

export const SUBMIT_SURFACE = "submit";

export type SubmitSuccessPath = "manual" | "gate";
export type SubmitStepDirection = "back" | "continue";
export type SubmitEgressDestination = "advertise" | "jobs-post";

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

export function submitCategorySelectAnalyticsEvent(): string {
  return "submit_category_select";
}

export function submitCategorySelectAnalyticsData(
  category: string,
  webOnly: boolean,
  categoryCount: number,
) {
  return {
    surface: SUBMIT_SURFACE,
    category,
    webOnly,
    categoryCount,
  };
}

export function submitStepAnalyticsEvent(): string {
  return "submit_step_click";
}

export function submitStepAnalyticsData(
  direction: SubmitStepDirection,
  fromStep: number,
  toStep: number,
  category: string,
  stepCount: number,
) {
  return {
    surface: SUBMIT_SURFACE,
    direction,
    fromStep,
    toStep,
    category,
    stepCount,
  };
}

export function submitPreflightRetryAnalyticsEvent(): string {
  return "submit_preflight_retry_click";
}

export function submitPreflightRetryAnalyticsData(category: string, step: number) {
  return {
    surface: SUBMIT_SURFACE,
    category,
    step,
  };
}

export function submitEgressAnalyticsEvent(): string {
  return "submit_egress_click";
}

export function submitEgressAnalyticsData(destination: SubmitEgressDestination) {
  return {
    surface: SUBMIT_SURFACE,
    destination,
  };
}

export type SubmitEgressRouteDestination = {
  to: "/advertise" | "/jobs/post";
};

/** Map a submit commercial egress destination id to an in-app route. */
export function submitEgressDestination(destination: string): SubmitEgressRouteDestination | null {
  switch (destination) {
    case "advertise":
      return { to: "/advertise" };
    case "jobs-post":
      return { to: "/jobs/post" };
    default:
      return null;
  }
}

export type SubmitCompletionDestination = "status";
export type SubmitDraftCopySource = "manual" | "wizard";

export function submitCompletionEgressAnalyticsEvent(): string {
  return "submit_completion_egress_click";
}

export function submitCompletionEgressAnalyticsData(
  category: string,
  destination: SubmitCompletionDestination,
) {
  return {
    surface: SUBMIT_SURFACE,
    category,
    destination,
  };
}

export function submitDraftCopyAnalyticsEvent(): string {
  return "submit_draft_copy_click";
}

export function submitDraftCopyAnalyticsData(category: string, source: SubmitDraftCopySource) {
  return {
    surface: SUBMIT_SURFACE,
    category,
    source,
  };
}

export type SubmitPreflightNextActionRoute = "fix_required" | "route_away" | "manual_review";

export function submitPreflightNextActionAnalyticsEvent(): string {
  return "submit_preflight_next_action_click";
}

export function submitPreflightNextActionAnalyticsData(
  category: string,
  routeSuggestion: SubmitPreflightNextActionRoute,
) {
  return {
    surface: SUBMIT_SURFACE,
    category,
    routeSuggestion,
  };
}
