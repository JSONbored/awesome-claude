import { describe, expect, it } from "vitest";
import {
  PLATFORM_CHIP_SURFACE,
  platformChipAnalyticsData,
  platformChipAnalyticsEvent,
} from "@/lib/platform-chip-cta-events-lib";

describe("platform chip cta events lib", () => {
  it("builds platform chip navigation analytics", () => {
    expect(platformChipAnalyticsEvent()).toBe("platform_chip_click");
    expect(platformChipAnalyticsData("claude-code")).toEqual({
      surface: PLATFORM_CHIP_SURFACE,
      platform: "claude-code",
    });
    expect(
      platformChipAnalyticsData("claude-desktop", "compare-table"),
    ).toEqual({
      surface: "compare-table",
      platform: "claude-desktop",
    });
    expect(platformChipAnalyticsData("raycast", "peek-panel")).toEqual({
      surface: "peek-panel",
      platform: "raycast",
    });
    expect(platformChipAnalyticsData("claude-code", "detail-header")).toEqual({
      surface: "detail-header",
      platform: "claude-code",
    });
  });
});
