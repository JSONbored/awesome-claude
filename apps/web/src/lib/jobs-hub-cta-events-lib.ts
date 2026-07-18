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
export type JobsIndexFilterAxis = "tier" | "remote" | "type" | "fresh" | "featured";
export type JobsIndexSortMode = "default" | "newest" | "salary";

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

export type JobsDetailEgressDestination = "apply" | "company" | "source";

export function jobsDetailEgressAnalyticsEvent(): string {
  return "jobs_detail_egress_click";
}

export function jobsDetailEgressAnalyticsData(
  jobSlug: string,
  tier: string,
  destination: JobsDetailEgressDestination,
) {
  return {
    surface: JOBS_DETAIL_SURFACE,
    jobSlug,
    tier,
    destination,
  };
}

export function jobsIndexFilterSelectAnalyticsEvent(): string {
  return "jobs_index_filter_select";
}

export function jobsIndexFilterSelectAnalyticsData(
  axis: JobsIndexFilterAxis,
  value: string,
  active: boolean,
  matchCount: number,
  jobCount: number,
) {
  return {
    surface: JOBS_INDEX_SURFACE,
    axis,
    value,
    active,
    matchCount,
    jobCount,
  };
}

export function jobsIndexSortSelectAnalyticsEvent(): string {
  return "jobs_index_sort_select";
}

export function jobsIndexSortSelectAnalyticsData(
  sort: JobsIndexSortMode,
  matchCount: number,
  jobCount: number,
) {
  return {
    surface: JOBS_INDEX_SURFACE,
    sort,
    matchCount,
    jobCount,
  };
}

export function jobsIndexFilterClearAnalyticsEvent(): string {
  return "jobs_index_filter_clear";
}

export function jobsIndexFilterClearAnalyticsData(
  activeFilterCount: number,
  matchCount: number,
  jobCount: number,
) {
  return {
    surface: JOBS_INDEX_SURFACE,
    activeFilterCount,
    matchCount,
    jobCount,
  };
}

export type JobsErrorSurface = "jobs-index" | "jobs-detail";

export function jobsErrorRetryAnalyticsEvent(): string {
  return "jobs_error_retry_click";
}

export function jobsErrorRetryAnalyticsData(surface: JobsErrorSurface) {
  return {
    surface,
  };
}

export function jobsDetailShareCopyAnalyticsEvent(): string {
  return "jobs_detail_share_copy_click";
}

export function jobsDetailShareCopyAnalyticsData(jobSlug: string, tier: string) {
  return {
    surface: JOBS_DETAIL_SURFACE,
    jobSlug,
    tier,
  };
}

export type JobsIndexStatId = "total" | "remote" | "fresh" | "featured";

export type JobsIndexStatFilterPatch = {
  q?: string;
  tier?: string;
  remote?: string;
  type?: string;
  freshOnly?: boolean;
  featuredOnly?: boolean;
};

export function jobsIndexStatAnalyticsEvent(): string {
  return "jobs_index_stat_click";
}

export function jobsIndexStatAnalyticsData(statId: string, count: number, jobCount: number) {
  return {
    surface: JOBS_INDEX_SURFACE,
    statId,
    count,
    jobCount,
  };
}

/** Map a headline jobs stat to a filter patch applied on click. */
export function jobsIndexStatFilterPatch(statId: string): JobsIndexStatFilterPatch | null {
  switch (statId) {
    case "total":
      return {
        q: "",
        tier: "all",
        remote: "all",
        type: "all",
        freshOnly: false,
        featuredOnly: false,
      };
    case "remote":
      return { remote: "remote" };
    case "fresh":
      return { freshOnly: true };
    case "featured":
      return { featuredOnly: true };
    default:
      return null;
  }
}

export type JobsIndexPostDestination = {
  to: "/jobs/post";
};

/** Map a jobs index post CTA id to the job post route. */
export function jobsIndexPostDestination(destination: string): JobsIndexPostDestination | null {
  switch (destination) {
    case "post":
      return { to: "/jobs/post" };
    default:
      return null;
  }
}

export type JobsDetailIndexDestination = {
  to: "/jobs";
};

/** Map a jobs detail index egress id to the jobs index. */
export function jobsDetailIndexDestination(destination: string): JobsDetailIndexDestination | null {
  switch (destination) {
    case "jobs":
      return { to: "/jobs" };
    default:
      return null;
  }
}

export type JobsDetailRelatedDestination = {
  to: "/jobs/$slug";
  params: { slug: string };
};

/** Map a related job slug to a jobs detail destination. */
export function jobsDetailRelatedDestination(slug: string): JobsDetailRelatedDestination | null {
  const id = slug.trim();
  switch (id) {
    case "":
      return null;
    default:
      return { to: "/jobs/$slug", params: { slug: id } };
  }
}
