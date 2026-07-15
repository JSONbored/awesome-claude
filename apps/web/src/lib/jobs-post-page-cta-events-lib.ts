/**
 * Pure jobs post page navigation analytics helpers.
 *
 * Maps tier selection, waitlist submit, and jobs hub egress to privacy-light
 * event names without embedding form fields, company details, or URLs.
 */

export const JOBS_POST_PAGE_SURFACE = "jobs-post-page";

export type JobsPostPageTierId = "free" | "standard" | "featured" | "sponsored";

export type JobsPostPageDestination = "jobs" | "retry";

export function jobsPostPageTierSelectAnalyticsEvent(): string {
  return "jobs_post_page_tier_select";
}

export function jobsPostPageTierSelectAnalyticsData(tierId: JobsPostPageTierId) {
  return {
    surface: JOBS_POST_PAGE_SURFACE,
    tierId,
  };
}

export function jobsPostPageSubmitAnalyticsEvent(): string {
  return "jobs_post_page_submit_click";
}

export function jobsPostPageSubmitAnalyticsData(tierId: JobsPostPageTierId) {
  return {
    surface: JOBS_POST_PAGE_SURFACE,
    tierId,
  };
}

export function jobsPostPageEgressAnalyticsEvent(): string {
  return "jobs_post_page_egress_click";
}

export function jobsPostPageEgressAnalyticsData(destination: JobsPostPageDestination) {
  return {
    surface: JOBS_POST_PAGE_SURFACE,
    destination,
  };
}
