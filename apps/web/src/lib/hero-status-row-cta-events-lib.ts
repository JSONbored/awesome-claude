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
