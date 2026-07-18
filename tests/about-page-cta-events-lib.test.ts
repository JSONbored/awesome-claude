import { describe, expect, it } from "vitest";
import {
  ABOUT_PAGE_SURFACE,
  aboutPageEgressAnalyticsData,
  aboutPageEgressAnalyticsEvent,
  aboutPageEgressDestination,
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

  it("maps about page egress destinations", () => {
    expect(aboutPageEgressDestination("integrations")).toEqual({
      to: "/integrations",
    });
    expect(aboutPageEgressDestination("api-docs")).toEqual({ to: "/api-docs" });
    expect(aboutPageEgressDestination("quality")).toEqual({ to: "/quality" });
    expect(aboutPageEgressDestination("submit")).toEqual({ to: "/submit" });
    expect(aboutPageEgressDestination("claim")).toEqual({ to: "/claim" });
    expect(aboutPageEgressDestination("contributors")).toEqual({
      to: "/contributors",
    });
    expect(aboutPageEgressDestination("advertise")).toEqual({
      to: "/advertise",
    });
    expect(aboutPageEgressDestination("jobs-post")).toEqual({
      to: "/jobs/post",
    });
    expect(aboutPageEgressDestination("unknown")).toBeNull();
  });
});
