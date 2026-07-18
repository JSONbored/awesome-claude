/**
 * Pure legal page navigation analytics helpers.
 *
 * Maps section sub-nav and policy egress links to privacy-light event names
 * without embedding section labels, URLs, or contact details.
 */

export const LEGAL_PAGE_SURFACE = "legal-page";

export type LegalPageSectionId =
  | "terms"
  | "privacy"
  | "content"
  | "trademarks"
  | "dmca"
  | "contact";

export type LegalPageDestination =
  | "advertise"
  | "jobs-post"
  | "claim"
  | "github-issues"
  | "github-repo";

export function legalPageSectionAnalyticsEvent(): string {
  return "legal_page_section_click";
}

export function legalPageSectionAnalyticsData(
  sectionId: LegalPageSectionId,
  rowIndex: number,
  sectionCount: number,
) {
  return {
    surface: LEGAL_PAGE_SURFACE,
    sectionId,
    rowIndex,
    sectionCount,
  };
}

export function legalPageEgressAnalyticsEvent(): string {
  return "legal_page_egress_click";
}

export function legalPageEgressAnalyticsData(destination: LegalPageDestination) {
  return {
    surface: LEGAL_PAGE_SURFACE,
    destination,
  };
}

export type LegalPageRouteDestination =
  | { kind: "route"; to: "/advertise" | "/jobs/post" | "/claim" }
  | { kind: "href"; href: string };

/** Map a legal page egress destination id to a route or external href. */
export function legalPageEgressDestination(destination: string): LegalPageRouteDestination | null {
  switch (destination) {
    case "advertise":
      return { kind: "route", to: "/advertise" };
    case "jobs-post":
      return { kind: "route", to: "/jobs/post" };
    case "claim":
      return { kind: "route", to: "/claim" };
    case "github-issues":
      return { kind: "href", href: "https://github.com/jsonbored/awesome-claude/issues" };
    case "github-repo":
      return { kind: "href", href: "https://github.com/jsonbored/awesome-claude" };
    default:
      return null;
  }
}

export type LegalPageSectionDestination = {
  kind: "href";
  href: string;
};

/** Map a legal page section id to an in-page hash destination. */
export function legalPageSectionDestination(sectionId: string): LegalPageSectionDestination | null {
  switch (sectionId) {
    case "terms":
    case "privacy":
    case "content":
    case "trademarks":
    case "dmca":
    case "contact":
      return { kind: "href", href: `#${sectionId}` };
    default:
      return null;
  }
}
