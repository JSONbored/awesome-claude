import { describe, expect, it } from "vitest";
import {
  INTEGRATION_CARD_SURFACE,
  integrationCardCopyAnalyticsData,
  integrationCardCopyAnalyticsEvent,
} from "@/lib/integration-card-cta-events-lib";

describe("integration card cta events lib", () => {
  it("builds integration card navigation analytics", () => {
    expect(integrationCardCopyAnalyticsEvent()).toBe(
      "integration_card_copy_click",
    );
    expect(
      integrationCardCopyAnalyticsData("mcp-server", "mcp", "live"),
    ).toEqual({
      surface: INTEGRATION_CARD_SURFACE,
      integrationSlug: "mcp-server",
      surfaceKind: "mcp",
      status: "live",
    });
  });
});
