/**
 * Pure about page navigation analytics helpers.
 *
 * Maps contribute and registry surface egress links to privacy-light event names
 * without embedding page copy or contributor details.
 */

export const ABOUT_PAGE_SURFACE = "about-page";

export type AboutPageDestination =
  | "integrations"
  | "api-docs"
  | "quality"
  | "submit"
  | "claim"
  | "contributors"
  | "advertise"
  | "jobs-post";

export function aboutPageEgressAnalyticsEvent(): string {
  return "about_page_egress_click";
}

export function aboutPageEgressAnalyticsData(destination: AboutPageDestination) {
  return {
    surface: ABOUT_PAGE_SURFACE,
    destination,
  };
}
