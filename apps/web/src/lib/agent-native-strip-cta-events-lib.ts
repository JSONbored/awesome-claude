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
