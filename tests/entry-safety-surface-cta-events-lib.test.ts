import { describe, expect, it } from "vitest";
import {
  ENTRY_SAFETY_SURFACE_PANEL_SURFACE,
  entrySafetySurfaceEntryKey,
  entrySafetySurfaceKindSelectAnalyticsData,
  entrySafetySurfaceKindSelectAnalyticsEvent,
} from "@/lib/entry-safety-surface-cta-events-lib";

describe("entry safety surface cta events lib", () => {
  it("builds privacy-light safety surface analytics payloads", () => {
    expect(entrySafetySurfaceEntryKey("mcp", "browser")).toBe("mcp/browser");
    expect(entrySafetySurfaceKindSelectAnalyticsEvent()).toBe(
      "detail_safety_surface_kind_select",
    );
    expect(
      entrySafetySurfaceKindSelectAnalyticsData(
        "mcp",
        "browser",
        "credentials",
        true,
        2,
        4,
        true,
      ),
    ).toEqual({
      entry: "mcp/browser",
      surface: ENTRY_SAFETY_SURFACE_PANEL_SURFACE,
      kind: "credentials",
      active: true,
      itemCount: 2,
      coverageCount: 4,
      sensitive: true,
    });
    expect(
      entrySafetySurfaceKindSelectAnalyticsData(
        "mcp",
        "browser",
        "network",
        false,
        5,
        4,
        true,
      ),
    ).toEqual({
      entry: "mcp/browser",
      surface: ENTRY_SAFETY_SURFACE_PANEL_SURFACE,
      kind: "network",
      active: false,
      itemCount: 5,
      coverageCount: 4,
      sensitive: true,
    });
  });
});
