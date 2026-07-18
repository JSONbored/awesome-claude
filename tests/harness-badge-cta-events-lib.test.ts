import { describe, expect, it } from "vitest";
import {
  HARNESS_BADGE_SURFACE,
  harnessBadgeAnalyticsData,
  harnessBadgeAnalyticsEvent,
  harnessBadgeHubDestination,
} from "@/lib/harness-badge-cta-events-lib";

describe("harness badge cta events lib", () => {
  it("builds privacy-light harness badge analytics for each surface", () => {
    expect(harnessBadgeAnalyticsEvent()).toBe("harness_badge_click");
    expect(harnessBadgeAnalyticsData("claude-code")).toEqual({
      surface: HARNESS_BADGE_SURFACE,
      harness: "claude-code",
    });
    expect(harnessBadgeAnalyticsData("cursor", "compare-table")).toEqual({
      surface: "compare-table",
      harness: "cursor",
    });
    expect(
      harnessBadgeAnalyticsData("claude-desktop", "compare-drawer"),
    ).toEqual({
      surface: "compare-drawer",
      harness: "claude-desktop",
    });
    expect(harnessBadgeAnalyticsData("vscode", "category-ranking")).toEqual({
      surface: "category-ranking",
      harness: "vscode",
    });
    expect(harnessBadgeAnalyticsData("claude-code", "detail-header")).toEqual({
      surface: "detail-header",
      harness: "claude-code",
    });
    expect(harnessBadgeAnalyticsData("cursor", "peek-panel")).toEqual({
      surface: "peek-panel",
      harness: "cursor",
    });
  });

  it("maps harness ids to hub destinations", () => {
    expect(harnessBadgeHubDestination("claude-code")).toEqual({
      to: "/for/$platform",
      params: { platform: "claude-code" },
    });
    expect(harnessBadgeHubDestination("  cursor  ")).toEqual({
      to: "/for/$platform",
      params: { platform: "cursor" },
    });
    expect(harnessBadgeHubDestination("")).toBeNull();
    expect(harnessBadgeHubDestination("   ")).toBeNull();
  });
});
