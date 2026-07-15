import { describe, expect, it } from "vitest";
import {
  SPONSORS_SECTION_SURFACE,
  sponsorsSectionCreditAnalyticsData,
  sponsorsSectionCreditAnalyticsEvent,
  sponsorsSectionEgressAnalyticsData,
  sponsorsSectionEgressAnalyticsEvent,
  sponsorsSectionInquiryOpenAnalyticsData,
  sponsorsSectionInquiryOpenAnalyticsEvent,
  sponsorsSectionPartnerAnalyticsData,
  sponsorsSectionPartnerAnalyticsEvent,
  sponsorsSectionSubmitAnalyticsData,
  sponsorsSectionSubmitAnalyticsEvent,
} from "@/lib/sponsors-section-cta-events-lib";

describe("sponsors section cta events lib", () => {
  it("builds sponsors section navigation analytics", () => {
    expect(sponsorsSectionEgressAnalyticsEvent()).toBe(
      "sponsors_section_egress_click",
    );
    expect(sponsorsSectionEgressAnalyticsData("legal")).toEqual({
      surface: SPONSORS_SECTION_SURFACE,
      destination: "legal",
    });
    expect(sponsorsSectionEgressAnalyticsData("advertise")).toEqual({
      surface: SPONSORS_SECTION_SURFACE,
      destination: "advertise",
    });
    expect(sponsorsSectionCreditAnalyticsEvent()).toBe(
      "sponsors_section_credit_click",
    );
    expect(sponsorsSectionCreditAnalyticsData("vercel", "infra", 2, 6)).toEqual(
      {
        surface: SPONSORS_SECTION_SURFACE,
        sponsorSlug: "vercel",
        kind: "infra",
        rowIndex: 2,
        sponsorCount: 6,
      },
    );
    expect(sponsorsSectionPartnerAnalyticsEvent()).toBe(
      "sponsors_section_partner_click",
    );
    expect(
      sponsorsSectionPartnerAnalyticsData("acme", "compute", 0, 3),
    ).toEqual({
      surface: SPONSORS_SECTION_SURFACE,
      partnerSlug: "acme",
      role: "compute",
      rowIndex: 0,
      partnerCount: 3,
    });
    expect(sponsorsSectionInquiryOpenAnalyticsEvent()).toBe(
      "sponsors_section_inquiry_open_click",
    );
    expect(sponsorsSectionInquiryOpenAnalyticsData("header", null)).toEqual({
      surface: SPONSORS_SECTION_SURFACE,
      source: "header",
      role: null,
    });
    expect(
      sponsorsSectionInquiryOpenAnalyticsData("open-slot", "tooling"),
    ).toEqual({
      surface: SPONSORS_SECTION_SURFACE,
      source: "open-slot",
      role: "tooling",
    });
    expect(sponsorsSectionSubmitAnalyticsEvent()).toBe(
      "sponsors_section_submit_click",
    );
    expect(sponsorsSectionSubmitAnalyticsData(true)).toEqual({
      surface: SPONSORS_SECTION_SURFACE,
      hasRole: true,
    });
  });
});
