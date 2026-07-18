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

export type AboutPageRouteDestination = {
  to:
    | "/integrations"
    | "/api-docs"
    | "/quality"
    | "/submit"
    | "/claim"
    | "/contributors"
    | "/advertise"
    | "/jobs/post";
};

/** Map an about page egress destination id to an in-app route. */
export function aboutPageEgressDestination(destination: string): AboutPageRouteDestination | null {
  switch (destination) {
    case "integrations":
      return { to: "/integrations" };
    case "api-docs":
      return { to: "/api-docs" };
    case "quality":
      return { to: "/quality" };
    case "submit":
      return { to: "/submit" };
    case "claim":
      return { to: "/claim" };
    case "contributors":
      return { to: "/contributors" };
    case "advertise":
      return { to: "/advertise" };
    case "jobs-post":
      return { to: "/jobs/post" };
    default:
      return null;
  }
}
