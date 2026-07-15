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
