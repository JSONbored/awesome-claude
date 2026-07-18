/**
 * Pure hero status row navigation analytics helpers.
 *
 * Maps MCP badge and weekly brief egress to privacy-light event names without
 * embedding package versions or calendar strings.
 */

export const HERO_STATUS_ROW_SURFACE = "hero-status-row";

export type HeroStatusRowDestination = "mcp-server" | "brief";

export function heroStatusRowEgressAnalyticsEvent(): string {
  return "hero_status_row_egress_click";
}

export function heroStatusRowEgressAnalyticsData(
  destination: HeroStatusRowDestination,
  resourceCount: number,
  reviewedCount: number,
  briefNumber: number,
) {
  return {
    surface: HERO_STATUS_ROW_SURFACE,
    destination,
    resourceCount,
    reviewedCount,
    briefNumber,
  };
}

export type HeroStatusRowRouteDestination =
  | { to: "/integrations/$slug"; params: { slug: string } }
  | { to: "/brief" };

/** Map a hero status row egress id to an in-app route. */
export function heroStatusRowDestination(
  destination: string,
): HeroStatusRowRouteDestination | null {
  switch (destination) {
    case "mcp-server":
      return { to: "/integrations/$slug", params: { slug: "mcp-server" } };
    case "brief":
      return { to: "/brief" };
    default:
      return null;
  }
}
