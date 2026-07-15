/**
 * Pure jobs post page navigation analytics helpers.
 *
 * Maps tier selection, listing submit, and jobs-index egress to privacy-light
 * event names without embedding form fields, URLs, or company details.
 */

export const JOBS_POST_PAGE_SURFACE = "jobs-post-page";

export type JobsPostPageTier = "free" | "standard" | "featured" | "sponsored";

export type JobsPostPageDestination = "jobs-index";

export function jobsPostPageTierSelectAnalyticsEvent(): string {
  return "jobs_post_page_tier_select";
}

export function jobsPostPageTierSelectAnalyticsData(tier: JobsPostPageTier) {
  return {
    surface: JOBS_POST_PAGE_SURFACE,
    tier,
  };
}

export function jobsPostPageSubmitAnalyticsEvent(): string {
  return "jobs_post_page_submit_click";
}

export function jobsPostPageSubmitAnalyticsData(tier: JobsPostPageTier) {
  return {
    surface: JOBS_POST_PAGE_SURFACE,
    tier,
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
