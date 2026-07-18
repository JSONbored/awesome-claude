import { describe, expect, it } from "vitest";
import {
  PLATFORMS_PAGE_SURFACE,
  platformsPageHubAnalyticsData,
  platformsPageHubAnalyticsEvent,
  platformsPageHubDestination,
} from "@/lib/platforms-page-cta-events-lib";

describe("platforms page cta events lib", () => {
  it("builds platforms page hub navigation analytics", () => {
    expect(platformsPageHubAnalyticsEvent()).toBe("platforms_page_hub_click");
    expect(platformsPageHubAnalyticsData("cursor", 1, 12, 8)).toEqual({
      surface: PLATFORMS_PAGE_SURFACE,
      platformId: "cursor",
      rowIndex: 1,
      platformCount: 12,
      matrixEntryCount: 8,
    });
  });

  it("maps platforms page hub destinations", () => {
    expect(platformsPageHubDestination("cursor")).toEqual({
      to: "/for/$platform",
      params: { platform: "cursor" },
    });
    expect(platformsPageHubDestination("")).toBeNull();
    expect(platformsPageHubDestination("  ")).toBeNull();
  });
});
