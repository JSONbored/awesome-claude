import { describe, expect, it } from "vitest";
import {
  TOOLS_SUBMIT_PAGE_SURFACE,
  toolsSubmitAdvertiseAnalyticsData,
  toolsSubmitAdvertiseAnalyticsEvent,
  toolsSubmitClaimAnalyticsData,
  toolsSubmitClaimAnalyticsEvent,
  toolsSubmitCommunityAnalyticsData,
  toolsSubmitCommunityAnalyticsEvent,
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
  });
});
