import { describe, expect, it } from "vitest";
import {
  JOBS_DETAIL_SURFACE,
  JOBS_INDEX_SURFACE,
  jobsDetailEgressAnalyticsData,
  jobsDetailEgressAnalyticsEvent,
  jobsDetailIndexAnalyticsData,
  jobsDetailIndexAnalyticsEvent,
  jobsDetailRelatedAnalyticsData,
  jobsDetailRelatedAnalyticsEvent,
  jobsDetailShareCopyAnalyticsData,
  jobsDetailShareCopyAnalyticsEvent,
  jobsErrorRetryAnalyticsData,
  jobsErrorRetryAnalyticsEvent,
  jobsIndexFilterClearAnalyticsData,
  jobsIndexFilterClearAnalyticsEvent,
  jobsIndexFilterSelectAnalyticsData,
  jobsIndexFilterSelectAnalyticsEvent,
  jobsIndexJobAnalyticsData,
  jobsIndexJobAnalyticsEvent,
  jobsIndexPostAnalyticsData,
  jobsIndexPostAnalyticsEvent,
  jobsIndexSortSelectAnalyticsData,
  jobsIndexSortSelectAnalyticsEvent,
  jobsIndexStatAnalyticsData,
  jobsIndexStatAnalyticsEvent,
  jobsIndexStatFilterPatch,
  jobsIndexPostDestination,
  jobsDetailIndexDestination,
  jobsDetailRelatedDestination,
} from "@/lib/jobs-hub-cta-events-lib";

describe("jobs hub cta events lib", () => {
  it("builds jobs index navigation analytics", () => {
    expect(jobsIndexPostAnalyticsEvent()).toBe("jobs_index_post_click");
    expect(jobsIndexPostAnalyticsData(24, "header")).toEqual({
      surface: JOBS_INDEX_SURFACE,
      jobCount: 24,
      source: "header",
    });
    expect(jobsIndexJobAnalyticsEvent()).toBe("jobs_index_job_click");
    expect(
      jobsIndexJobAnalyticsData("senior-mcp", "featured", 0, 24, "row"),
    ).toEqual({
      surface: JOBS_INDEX_SURFACE,
      jobSlug: "senior-mcp",
      tier: "featured",
      rowIndex: 0,
      jobCount: 24,
      variant: "row",
    });
  });

  it("builds jobs index filter and sort analytics", () => {
    expect(jobsIndexFilterSelectAnalyticsEvent()).toBe(
      "jobs_index_filter_select",
    );
    expect(
      jobsIndexFilterSelectAnalyticsData("tier", "featured", true, 6, 24),
    ).toEqual({
      surface: JOBS_INDEX_SURFACE,
      axis: "tier",
      value: "featured",
      active: true,
      matchCount: 6,
      jobCount: 24,
    });
    expect(jobsIndexSortSelectAnalyticsEvent()).toBe("jobs_index_sort_select");
    expect(jobsIndexSortSelectAnalyticsData("newest", 12, 24)).toEqual({
      surface: JOBS_INDEX_SURFACE,
      sort: "newest",
      matchCount: 12,
      jobCount: 24,
    });
    expect(jobsIndexFilterClearAnalyticsEvent()).toBe(
      "jobs_index_filter_clear",
    );
    expect(jobsIndexFilterClearAnalyticsData(3, 24, 24)).toEqual({
      surface: JOBS_INDEX_SURFACE,
      activeFilterCount: 3,
      matchCount: 24,
      jobCount: 24,
    });
  });

  it("builds jobs detail navigation analytics", () => {
    expect(jobsDetailIndexAnalyticsEvent()).toBe("jobs_detail_index_click");
    expect(
      jobsDetailIndexAnalyticsData("senior-mcp", "featured", "breadcrumb"),
    ).toEqual({
      surface: JOBS_DETAIL_SURFACE,
      jobSlug: "senior-mcp",
      tier: "featured",
      source: "breadcrumb",
    });
    expect(jobsDetailIndexAnalyticsData(null, null, "not-found")).toEqual({
      surface: JOBS_DETAIL_SURFACE,
      jobSlug: null,
      tier: null,
      source: "not-found",
    });
    expect(jobsDetailRelatedAnalyticsEvent()).toBe("jobs_detail_related_click");
    expect(
      jobsDetailRelatedAnalyticsData("senior-mcp", "platform-eng", 1, 4),
    ).toEqual({
      surface: JOBS_DETAIL_SURFACE,
      jobSlug: "senior-mcp",
      relatedSlug: "platform-eng",
      rowIndex: 1,
      relatedCount: 4,
    });
    expect(jobsDetailEgressAnalyticsEvent()).toBe("jobs_detail_egress_click");
    expect(
      jobsDetailEgressAnalyticsData("senior-mcp", "featured", "apply"),
    ).toEqual({
      surface: JOBS_DETAIL_SURFACE,
      jobSlug: "senior-mcp",
      tier: "featured",
      destination: "apply",
    });
    expect(
      jobsDetailEgressAnalyticsData("senior-mcp", "standard", "company"),
    ).toEqual({
      surface: JOBS_DETAIL_SURFACE,
      jobSlug: "senior-mcp",
      tier: "standard",
      destination: "company",
    });
    expect(
      jobsDetailEgressAnalyticsData("senior-mcp", "free", "source"),
    ).toEqual({
      surface: JOBS_DETAIL_SURFACE,
      jobSlug: "senior-mcp",
      tier: "free",
      destination: "source",
    });
    expect(jobsErrorRetryAnalyticsEvent()).toBe("jobs_error_retry_click");
    expect(jobsErrorRetryAnalyticsData("jobs-index")).toEqual({
      surface: "jobs-index",
    });
    expect(jobsErrorRetryAnalyticsData("jobs-detail")).toEqual({
      surface: "jobs-detail",
    });
    expect(jobsDetailShareCopyAnalyticsEvent()).toBe(
      "jobs_detail_share_copy_click",
    );
    expect(jobsDetailShareCopyAnalyticsData("senior-mcp", "featured")).toEqual({
      surface: JOBS_DETAIL_SURFACE,
      jobSlug: "senior-mcp",
      tier: "featured",
    });
  });

  it("maps jobs index headline stats to filter patches", () => {
    expect(jobsIndexStatAnalyticsEvent()).toBe("jobs_index_stat_click");
    expect(jobsIndexStatAnalyticsData("remote", 8, 24)).toEqual({
      surface: JOBS_INDEX_SURFACE,
      statId: "remote",
      count: 8,
      jobCount: 24,
    });
    expect(jobsIndexStatFilterPatch("total")).toEqual({
      q: "",
      tier: "all",
      remote: "all",
      type: "all",
      freshOnly: false,
      featuredOnly: false,
    });
    expect(jobsIndexStatFilterPatch("remote")).toEqual({ remote: "remote" });
    expect(jobsIndexStatFilterPatch("fresh")).toEqual({ freshOnly: true });
    expect(jobsIndexStatFilterPatch("featured")).toEqual({
      featuredOnly: true,
    });
    expect(jobsIndexStatFilterPatch("unknown")).toBeNull();
  });

  it("maps jobs hub route destinations", () => {
    expect(jobsIndexPostDestination("post")).toEqual({ to: "/jobs/post" });
    expect(jobsIndexPostDestination("unknown")).toBeNull();
    expect(jobsDetailIndexDestination("jobs")).toEqual({ to: "/jobs" });
    expect(jobsDetailIndexDestination("unknown")).toBeNull();
    expect(jobsDetailRelatedDestination("staff-engineer")).toEqual({
      to: "/jobs/$slug",
      params: { slug: "staff-engineer" },
    });
    expect(jobsDetailRelatedDestination("")).toBeNull();
  });
});
