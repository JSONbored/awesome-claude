import { describe, expect, it } from "vitest";
import {
  JOBS_DETAIL_SURFACE,
  JOBS_INDEX_SURFACE,
  jobsDetailIndexAnalyticsData,
  jobsDetailIndexAnalyticsEvent,
  jobsDetailRelatedAnalyticsData,
  jobsDetailRelatedAnalyticsEvent,
  jobsIndexJobAnalyticsData,
  jobsIndexJobAnalyticsEvent,
  jobsIndexPostAnalyticsData,
  jobsIndexPostAnalyticsEvent,
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
  });
});
