import { describe, expect, it } from "vitest";
import {
  HERO_STATUS_ROW_SURFACE,
  heroStatusRowEgressAnalyticsData,
  heroStatusRowEgressAnalyticsEvent,
} from "@/lib/hero-status-row-cta-events-lib";

describe("hero status row cta events lib", () => {
  it("builds hero status row navigation analytics", () => {
    expect(heroStatusRowEgressAnalyticsEvent()).toBe(
      "hero_status_row_egress_click",
    );
    expect(
      heroStatusRowEgressAnalyticsData("mcp-server", 1200, 900, 42),
    ).toEqual({
      surface: HERO_STATUS_ROW_SURFACE,
      destination: "mcp-server",
      resourceCount: 1200,
      reviewedCount: 900,
      briefNumber: 42,
    });
    expect(heroStatusRowEgressAnalyticsData("brief", 10, 8, 1)).toEqual({
      surface: HERO_STATUS_ROW_SURFACE,
      destination: "brief",
      resourceCount: 10,
      reviewedCount: 8,
      briefNumber: 1,
    });
  });
});
