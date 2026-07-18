/**
 * Pure agent-native strip navigation analytics helpers.
 *
 * Maps integration egress and snippet copy actions to privacy-light event names
 * without embedding full command strings or destination URLs.
 */

export const AGENT_NATIVE_STRIP_SURFACE = "agent-native-strip";

export type AgentNativeStripCardId = "mcp" | "raycast" | "llms";

export type AgentNativeStripDestination =
  | "integrations-mcp"
  | "integrations-raycast"
  | "api-docs"
  | "ecosystem";

export function agentNativeStripEgressAnalyticsEvent(): string {
  return "agent_native_strip_egress_click";
}

export function agentNativeStripEgressAnalyticsData(destination: AgentNativeStripDestination) {
  return {
    surface: AGENT_NATIVE_STRIP_SURFACE,
    destination,
  };
}

export function agentNativeStripCopyAnalyticsEvent(): string {
  return "agent_native_strip_copy_click";
}

export function agentNativeStripCopyAnalyticsData(cardId: AgentNativeStripCardId) {
  return {
    surface: AGENT_NATIVE_STRIP_SURFACE,
    cardId,
  };
}

export type AgentNativeStripRouteDestination =
  | { to: "/integrations/$slug"; params: { slug: string } }
  | { to: "/api-docs" }
  | { to: "/ecosystem" };

/** Map an agent-native strip egress destination id to an in-app route. */
export function agentNativeStripEgressDestination(
  destination: string,
): AgentNativeStripRouteDestination | null {
  switch (destination) {
    case "integrations-mcp":
      return { to: "/integrations/$slug", params: { slug: "mcp-server" } };
    case "integrations-raycast":
      return { to: "/integrations/$slug", params: { slug: "raycast" } };
    case "api-docs":
      return { to: "/api-docs" };
    case "ecosystem":
      return { to: "/ecosystem" };
    default:
      return null;
  }
}
