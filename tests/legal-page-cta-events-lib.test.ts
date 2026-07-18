import { describe, expect, it } from "vitest";
import {
  LEGAL_PAGE_SURFACE,
  legalPageEgressAnalyticsData,
  legalPageEgressAnalyticsEvent,
  legalPageEgressDestination,
  legalPageSectionAnalyticsData,
  legalPageSectionAnalyticsEvent,
  legalPageSectionDestination,
} from "@/lib/legal-page-cta-events-lib";

describe("legal page cta events lib", () => {
  it("builds legal page navigation analytics", () => {
    expect(legalPageSectionAnalyticsEvent()).toBe("legal_page_section_click");
    expect(legalPageSectionAnalyticsData("privacy", 1, 6)).toEqual({
      surface: LEGAL_PAGE_SURFACE,
      sectionId: "privacy",
      rowIndex: 1,
      sectionCount: 6,
    });
    expect(legalPageEgressAnalyticsEvent()).toBe("legal_page_egress_click");
    expect(legalPageEgressAnalyticsData("advertise")).toEqual({
      surface: LEGAL_PAGE_SURFACE,
      destination: "advertise",
    });
    expect(legalPageEgressAnalyticsData("github-issues")).toEqual({
      surface: LEGAL_PAGE_SURFACE,
      destination: "github-issues",
    });
  });

  it("maps legal page egress and section destinations", () => {
    expect(legalPageEgressDestination("advertise")).toEqual({
      kind: "route",
      to: "/advertise",
    });
    expect(legalPageEgressDestination("jobs-post")).toEqual({
      kind: "route",
      to: "/jobs/post",
    });
    expect(legalPageEgressDestination("claim")).toEqual({
      kind: "route",
      to: "/claim",
    });
    expect(legalPageEgressDestination("github-issues")).toEqual({
      kind: "href",
      href: "https://github.com/jsonbored/awesome-claude/issues",
    });
    expect(legalPageEgressDestination("github-repo")).toEqual({
      kind: "href",
      href: "https://github.com/jsonbored/awesome-claude",
    });
    expect(legalPageEgressDestination("unknown")).toBeNull();
    expect(legalPageSectionDestination("terms")).toEqual({
      kind: "href",
      href: "#terms",
    });
    expect(legalPageSectionDestination("privacy")).toEqual({
      kind: "href",
      href: "#privacy",
    });
    expect(legalPageSectionDestination("content")).toEqual({
      kind: "href",
      href: "#content",
    });
    expect(legalPageSectionDestination("trademarks")).toEqual({
      kind: "href",
      href: "#trademarks",
    });
    expect(legalPageSectionDestination("dmca")).toEqual({
      kind: "href",
      href: "#dmca",
    });
    expect(legalPageSectionDestination("contact")).toEqual({
      kind: "href",
      href: "#contact",
    });
    expect(legalPageSectionDestination("unknown")).toBeNull();
  });
});
