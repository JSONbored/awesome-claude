import { describe, expect, it } from "vitest";
import {
  ABOUT_PAGE_SURFACE,
  aboutPageEgressAnalyticsData,
  aboutPageEgressAnalyticsEvent,
} from "@/lib/about-page-cta-events-lib";

describe("about page cta events lib", () => {
  it("builds about page egress navigation analytics", () => {
    expect(aboutPageEgressAnalyticsEvent()).toBe("about_page_egress_click");
    expect(aboutPageEgressAnalyticsData("integrations")).toEqual({
      surface: ABOUT_PAGE_SURFACE,
      destination: "integrations",
    });
    expect(aboutPageEgressAnalyticsData("jobs-post")).toEqual({
      surface: ABOUT_PAGE_SURFACE,
      destination: "jobs-post",
    });
  });
});
