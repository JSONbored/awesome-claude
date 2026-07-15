import { describe, expect, it } from "vitest";
import {
  LEGAL_PAGE_SURFACE,
  legalPageEgressAnalyticsData,
  legalPageEgressAnalyticsEvent,
  legalPageSectionAnalyticsData,
  legalPageSectionAnalyticsEvent,
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
});
