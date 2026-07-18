/**
 * Pure sponsors section navigation analytics helpers.
 *
 * Maps credit/partner egress, policy cross-links, open-slot inquiry open,
 * and partner form submit to privacy-light event names without embedding
 * URLs, company names, emails, or form free text.
 */

export const SPONSORS_SECTION_SURFACE = "sponsors-section";

export type SponsorsSectionDestination = "legal" | "advertise";

export type SponsorsSectionInquirySource = "header" | "open-slot";

export function sponsorsSectionEgressAnalyticsEvent(): string {
  return "sponsors_section_egress_click";
}

export function sponsorsSectionEgressAnalyticsData(destination: SponsorsSectionDestination) {
  return {
    surface: SPONSORS_SECTION_SURFACE,
    destination,
  };
}

export type SponsorsSectionRouteDestination = { to: "/legal" | "/advertise" };

/** Map a sponsors section egress destination id to an in-app route. */
export function sponsorsSectionEgressDestination(
  destination: string,
): SponsorsSectionRouteDestination | null {
  switch (destination) {
    case "legal":
      return { to: "/legal" };
    case "advertise":
      return { to: "/advertise" };
    default:
      return null;
  }
}

export function sponsorsSectionCreditAnalyticsEvent(): string {
  return "sponsors_section_credit_click";
}

export function sponsorsSectionCreditAnalyticsData(
  sponsorSlug: string,
  kind: string,
  rowIndex: number,
  sponsorCount: number,
) {
  return {
    surface: SPONSORS_SECTION_SURFACE,
    sponsorSlug,
    kind,
    rowIndex,
    sponsorCount,
  };
}

export function sponsorsSectionPartnerAnalyticsEvent(): string {
  return "sponsors_section_partner_click";
}

export function sponsorsSectionPartnerAnalyticsData(
  partnerSlug: string,
  role: string,
  rowIndex: number,
  partnerCount: number,
) {
  return {
    surface: SPONSORS_SECTION_SURFACE,
    partnerSlug,
    role,
    rowIndex,
    partnerCount,
  };
}

export function sponsorsSectionInquiryOpenAnalyticsEvent(): string {
  return "sponsors_section_inquiry_open_click";
}

export function sponsorsSectionInquiryOpenAnalyticsData(
  source: SponsorsSectionInquirySource,
  role: string | null,
) {
  return {
    surface: SPONSORS_SECTION_SURFACE,
    source,
    role,
  };
}

export function sponsorsSectionSubmitAnalyticsEvent(): string {
  return "sponsors_section_submit_click";
}

export function sponsorsSectionSubmitAnalyticsData(hasRole: boolean) {
  return {
    surface: SPONSORS_SECTION_SURFACE,
    hasRole,
  };
}
