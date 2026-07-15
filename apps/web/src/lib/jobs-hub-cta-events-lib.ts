/**
 * Pure jobs hub navigation analytics helpers.
 *
 * Maps job card, post CTA, and detail cross-links to privacy-light event names
 * without embedding job titles, company names, or URLs.
 */

export const JOBS_INDEX_SURFACE = "jobs-index";
export const JOBS_DETAIL_SURFACE = "jobs-detail";

export type JobsIndexPostSource = "header" | "sidebar";
export type JobsIndexJobVariant = "row" | "rail";
export type JobsDetailIndexSource = "breadcrumb" | "not-found" | "see-all";

export function jobsIndexPostAnalyticsEvent(): string {
  return "jobs_index_post_click";
}

export function jobsIndexPostAnalyticsData(jobCount: number, source: JobsIndexPostSource) {
  return {
    surface: JOBS_INDEX_SURFACE,
    jobCount,
    source,
  };
}

export function jobsIndexJobAnalyticsEvent(): string {
  return "jobs_index_job_click";
}

export function jobsIndexJobAnalyticsData(
  jobSlug: string,
  tier: string,
  rowIndex: number,
  jobCount: number,
  variant: JobsIndexJobVariant,
) {
  return {
    surface: JOBS_INDEX_SURFACE,
    jobSlug,
    tier,
    rowIndex,
    jobCount,
    variant,
  };
}

export function jobsDetailIndexAnalyticsEvent(): string {
  return "jobs_detail_index_click";
}

export function jobsDetailIndexAnalyticsData(
  jobSlug: string | null,
  tier: string | null,
  source: JobsDetailIndexSource,
) {
  return {
    surface: JOBS_DETAIL_SURFACE,
    jobSlug,
    tier,
    source,
  };
}

export function jobsDetailRelatedAnalyticsEvent(): string {
  return "jobs_detail_related_click";
}

export function jobsDetailRelatedAnalyticsData(
  jobSlug: string,
  relatedSlug: string,
  rowIndex: number,
  relatedCount: number,
) {
  return {
    surface: JOBS_DETAIL_SURFACE,
    jobSlug,
    relatedSlug,
    rowIndex,
    relatedCount,
  };
}
