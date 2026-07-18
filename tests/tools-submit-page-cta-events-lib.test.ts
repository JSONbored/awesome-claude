import { describe, expect, it } from "vitest";
import {
  TOOLS_SUBMIT_PAGE_SURFACE,
  toolsSubmitAdvertiseAnalyticsData,
  toolsSubmitAdvertiseAnalyticsEvent,
  toolsSubmitChromeDestination,
  toolsSubmitClaimAnalyticsData,
  toolsSubmitClaimAnalyticsEvent,
  toolsSubmitCommunityAnalyticsData,
  toolsSubmitCommunityAnalyticsEvent,
  toolsSubmitListingSubmitAnalyticsData,
  toolsSubmitListingSubmitAnalyticsEvent,
  toolsSubmitReviewSubmitAnalyticsData,
  toolsSubmitReviewSubmitAnalyticsEvent,
  toolsSubmitToolsAnalyticsData,
  toolsSubmitToolsAnalyticsEvent,
} from "@/lib/tools-submit-page-cta-events-lib";

describe("tools submit page cta events lib", () => {
  it("builds tools submit page navigation analytics", () => {
    expect(toolsSubmitToolsAnalyticsEvent()).toBe("tools_submit_tools_click");
    expect(toolsSubmitToolsAnalyticsData("breadcrumb")).toEqual({
      surface: TOOLS_SUBMIT_PAGE_SURFACE,
      source: "breadcrumb",
    });
    expect(toolsSubmitCommunityAnalyticsEvent()).toBe(
      "tools_submit_community_click",
    );
    expect(toolsSubmitCommunityAnalyticsData()).toEqual({
      surface: TOOLS_SUBMIT_PAGE_SURFACE,
    });
    expect(toolsSubmitAdvertiseAnalyticsEvent()).toBe(
      "tools_submit_advertise_click",
    );
    expect(toolsSubmitAdvertiseAnalyticsData("commercial-paths")).toEqual({
      surface: TOOLS_SUBMIT_PAGE_SURFACE,
      source: "commercial-paths",
    });
    expect(toolsSubmitClaimAnalyticsEvent()).toBe("tools_submit_claim_click");
    expect(toolsSubmitClaimAnalyticsData("commercial-paths")).toEqual({
      surface: TOOLS_SUBMIT_PAGE_SURFACE,
      source: "commercial-paths",
    });
    expect(toolsSubmitChromeDestination("tools")).toEqual({ to: "/tools" });
    expect(toolsSubmitChromeDestination("community")).toEqual({
      to: "/submit",
    });
    expect(toolsSubmitChromeDestination("advertise")).toEqual({
      to: "/advertise",
    });
    expect(toolsSubmitChromeDestination("claim")).toEqual({ to: "/claim" });
    expect(toolsSubmitChromeDestination("unknown")).toBeNull();
  });

  it("builds tools submit form submit analytics", () => {
    expect(toolsSubmitListingSubmitAnalyticsEvent()).toBe(
      "tools_submit_listing_submit_click",
    );
    expect(toolsSubmitListingSubmitAnalyticsData("featured")).toEqual({
      surface: TOOLS_SUBMIT_PAGE_SURFACE,
      form: "listing",
      tierInterest: "featured",
    });
    expect(toolsSubmitListingSubmitAnalyticsData("sponsored")).toEqual({
      surface: TOOLS_SUBMIT_PAGE_SURFACE,
      form: "listing",
      tierInterest: "sponsored",
    });
    expect(toolsSubmitReviewSubmitAnalyticsEvent()).toBe(
      "tools_submit_review_submit_click",
    );
    expect(toolsSubmitReviewSubmitAnalyticsData(true)).toEqual({
      surface: TOOLS_SUBMIT_PAGE_SURFACE,
      form: "paid-review",
      hasEntryRef: true,
    });
    expect(toolsSubmitReviewSubmitAnalyticsData(false)).toEqual({
      surface: TOOLS_SUBMIT_PAGE_SURFACE,
      form: "paid-review",
      hasEntryRef: false,
    });
  });
});
