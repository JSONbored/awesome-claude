import { describe, expect, it } from "vitest";
import {
  INSTALL_RISK_BADGE_SURFACE,
  installRiskBadgeAnalyticsData,
  installRiskBadgeAnalyticsEvent,
  installRiskBrowseSearch,
} from "@/lib/install-risk-badge-cta-events-lib";

describe("install risk badge cta events lib", () => {
  it("builds privacy-light install risk analytics for each surface", () => {
    expect(installRiskBadgeAnalyticsEvent()).toBe("install_risk_badge_click");
    expect(installRiskBadgeAnalyticsData("low")).toEqual({
      surface: INSTALL_RISK_BADGE_SURFACE,
      risk: "low",
    });
    expect(installRiskBadgeAnalyticsData("review", "compare-table")).toEqual({
      surface: "compare-table",
      risk: "review",
    });
    expect(installRiskBadgeAnalyticsData("high", "compare-drawer")).toEqual({
      surface: "compare-drawer",
      risk: "high",
    });
    expect(installRiskBadgeAnalyticsData("low", "category-ranking")).toEqual({
      surface: "category-ranking",
      risk: "low",
    });
    expect(installRiskBadgeAnalyticsData("review", "peek-panel")).toEqual({
      surface: "peek-panel",
      risk: "review",
    });
    expect(installRiskBadgeAnalyticsData("high", "compare-tray")).toEqual({
      surface: "compare-tray",
      risk: "high",
    });
    expect(installRiskBadgeAnalyticsData("review", "trending-list")).toEqual({
      surface: "trending-list",
      risk: "review",
    });
    expect(installRiskBadgeAnalyticsData("high", "browse-grid")).toEqual({
      surface: "browse-grid",
      risk: "high",
    });
    expect(installRiskBadgeAnalyticsData("low", "browse-row")).toEqual({
      surface: "browse-row",
      risk: "low",
    });
  });

  it("maps install risk levels to browse trust search patches", () => {
    expect(installRiskBrowseSearch("low")).toEqual({ trust: "trusted" });
    expect(installRiskBrowseSearch("review")).toEqual({ trust: "review" });
    expect(installRiskBrowseSearch("high")).toEqual({ trust: "blocked" });
    expect(installRiskBrowseSearch("unknown")).toBeNull();
  });
});
