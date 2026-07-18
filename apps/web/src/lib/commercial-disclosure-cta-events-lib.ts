/**
 * Pure commercial disclosure navigation analytics helpers.
 *
 * Maps legal-policy egress to privacy-light event names without embedding
 * disclosure copy.
 */

export const COMMERCIAL_DISCLOSURE_SURFACE = "commercial-disclosure";

export type CommercialDisclosureDestination = "legal";

export function commercialDisclosureEgressAnalyticsEvent(): string {
  return "commercial_disclosure_egress_click";
}

export function commercialDisclosureEgressAnalyticsData(
  destination: CommercialDisclosureDestination,
) {
  return {
    surface: COMMERCIAL_DISCLOSURE_SURFACE,
    destination,
  };
}

export type CommercialDisclosureRouteDestination = { to: "/legal" };

/** Map a commercial disclosure egress destination id to an in-app route. */
export function commercialDisclosureEgressDestination(
  destination: string,
): CommercialDisclosureRouteDestination | null {
  switch (destination) {
    case "legal":
      return { to: "/legal" };
    default:
      return null;
  }
}
