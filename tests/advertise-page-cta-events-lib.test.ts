import { describe, expect, it } from "vitest";
import {
  ADVERTISE_PAGE_SURFACE,
  advertisePageEgressAnalyticsData,
  advertisePageEgressAnalyticsEvent,
  advertisePageEgressDestination,
  advertisePagePlanSelectAnalyticsData,
  advertisePagePlanSelectAnalyticsEvent,
  advertisePageSubmitAnalyticsData,
  advertisePageSubmitAnalyticsEvent,
} from "@/lib/advertise-page-cta-events-lib";

describe("advertise page cta events lib", () => {
  it("builds advertise page navigation analytics", () => {
    expect(advertisePagePlanSelectAnalyticsEvent()).toBe(
      "advertise_page_plan_select",
    );
    expect(advertisePagePlanSelectAnalyticsData("featured")).toEqual({
      surface: ADVERTISE_PAGE_SURFACE,
      planId: "featured",
    });
    expect(advertisePageSubmitAnalyticsEvent()).toBe(
      "advertise_page_submit_click",
    );
    expect(advertisePageSubmitAnalyticsData("brief")).toEqual({
      surface: ADVERTISE_PAGE_SURFACE,
      planId: "brief",
    });
    expect(advertisePageEgressAnalyticsEvent()).toBe(
      "advertise_page_egress_click",
    );
    expect(advertisePageEgressAnalyticsData("submit")).toEqual({
      surface: ADVERTISE_PAGE_SURFACE,
      destination: "submit",
    });
    expect(advertisePageEgressAnalyticsData("retry")).toEqual({
      surface: ADVERTISE_PAGE_SURFACE,
      destination: "retry",
    });
    expect(advertisePageEgressDestination("submit")).toEqual({ to: "/submit" });
    expect(advertisePageEgressDestination("retry")).toEqual({
      to: "/advertise",
    });
    expect(advertisePageEgressDestination("unknown")).toBeNull();
  });
});
