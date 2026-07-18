import { describe, expect, it } from "vitest";
import {
  JOBS_POST_PAGE_SURFACE,
  jobsPostPageEgressAnalyticsData,
  jobsPostPageEgressAnalyticsEvent,
  jobsPostPageEgressDestination,
  jobsPostPageSubmitAnalyticsData,
  jobsPostPageSubmitAnalyticsEvent,
  jobsPostPageTierSelectAnalyticsData,
  jobsPostPageTierSelectAnalyticsEvent,
} from "@/lib/jobs-post-page-cta-events-lib";

describe("jobs post page cta events lib", () => {
  it("builds jobs post page navigation analytics", () => {
    expect(jobsPostPageTierSelectAnalyticsEvent()).toBe(
      "jobs_post_page_tier_select",
    );
    expect(jobsPostPageTierSelectAnalyticsData("featured")).toEqual({
      surface: JOBS_POST_PAGE_SURFACE,
      tier: "featured",
    });
    expect(jobsPostPageSubmitAnalyticsEvent()).toBe(
      "jobs_post_page_submit_click",
    );
    expect(jobsPostPageSubmitAnalyticsData("sponsored")).toEqual({
      surface: JOBS_POST_PAGE_SURFACE,
      tier: "sponsored",
    });
    expect(jobsPostPageEgressAnalyticsEvent()).toBe(
      "jobs_post_page_egress_click",
    );
    expect(jobsPostPageEgressAnalyticsData("jobs-index")).toEqual({
      surface: JOBS_POST_PAGE_SURFACE,
      destination: "jobs-index",
    });
    expect(jobsPostPageEgressDestination("jobs-index")).toEqual({
      to: "/jobs",
    });
    expect(jobsPostPageEgressDestination("unknown")).toBeNull();
  });
});
