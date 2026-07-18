import { describe, expect, it } from "vitest";
import {
  AGENT_NATIVE_STRIP_SURFACE,
  agentNativeStripCopyAnalyticsData,
  agentNativeStripCopyAnalyticsEvent,
  agentNativeStripEgressAnalyticsData,
  agentNativeStripEgressAnalyticsEvent,
  agentNativeStripEgressDestination,
} from "@/lib/agent-native-strip-cta-events-lib";

describe("agent native strip cta events lib", () => {
  it("builds agent-native strip navigation analytics", () => {
    expect(agentNativeStripEgressAnalyticsEvent()).toBe(
      "agent_native_strip_egress_click",
    );
    expect(agentNativeStripEgressAnalyticsData("ecosystem")).toEqual({
      surface: AGENT_NATIVE_STRIP_SURFACE,
      destination: "ecosystem",
    });
    expect(agentNativeStripEgressAnalyticsData("integrations-mcp")).toEqual({
      surface: AGENT_NATIVE_STRIP_SURFACE,
      destination: "integrations-mcp",
    });
    expect(agentNativeStripEgressAnalyticsData("integrations-raycast")).toEqual(
      {
        surface: AGENT_NATIVE_STRIP_SURFACE,
        destination: "integrations-raycast",
      },
    );
    expect(agentNativeStripEgressAnalyticsData("api-docs")).toEqual({
      surface: AGENT_NATIVE_STRIP_SURFACE,
      destination: "api-docs",
    });
    expect(agentNativeStripCopyAnalyticsEvent()).toBe(
      "agent_native_strip_copy_click",
    );
    expect(agentNativeStripCopyAnalyticsData("mcp")).toEqual({
      surface: AGENT_NATIVE_STRIP_SURFACE,
      cardId: "mcp",
    });
    expect(agentNativeStripCopyAnalyticsData("raycast")).toEqual({
      surface: AGENT_NATIVE_STRIP_SURFACE,
      cardId: "raycast",
    });
    expect(agentNativeStripCopyAnalyticsData("llms")).toEqual({
      surface: AGENT_NATIVE_STRIP_SURFACE,
      cardId: "llms",
    });
  });

  it("maps agent-native strip egress destinations", () => {
    expect(agentNativeStripEgressDestination("integrations-mcp")).toEqual({
      to: "/integrations/$slug",
      params: { slug: "mcp-server" },
    });
    expect(agentNativeStripEgressDestination("integrations-raycast")).toEqual({
      to: "/integrations/$slug",
      params: { slug: "raycast" },
    });
    expect(agentNativeStripEgressDestination("api-docs")).toEqual({
      to: "/api-docs",
    });
    expect(agentNativeStripEgressDestination("ecosystem")).toEqual({
      to: "/ecosystem",
    });
    expect(agentNativeStripEgressDestination("")).toBeNull();
    expect(agentNativeStripEgressDestination("unknown")).toBeNull();
  });
});
