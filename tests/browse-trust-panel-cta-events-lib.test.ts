import { describe, expect, it } from "vitest";
import {
  BROWSE_TRUST_PANEL_SURFACE,
  browseTrustCoverageFilterAnalyticsData,
  browseTrustCoverageFilterAnalyticsEvent,
  browseTrustCoverageSignal,
  browseTrustLevelFilterAnalyticsData,
  browseTrustLevelFilterAnalyticsEvent,
} from "@/lib/browse-trust-panel-cta-events-lib";

describe("browse trust panel cta events lib", () => {
  it("builds privacy-light trust panel filter analytics", () => {
    expect(browseTrustLevelFilterAnalyticsEvent()).toBe(
      "browse_trust_level_filter_click",
    );
    expect(browseTrustLevelFilterAnalyticsData("trusted", 4, 20)).toEqual({
      surface: BROWSE_TRUST_PANEL_SURFACE,
      level: "trusted",
      count: 4,
      resultCount: 20,
    });
    expect(browseTrustCoverageFilterAnalyticsEvent()).toBe(
      "browse_trust_coverage_filter_click",
    );
    expect(browseTrustCoverageFilterAnalyticsData("safety", 8, 40, 20)).toEqual(
      {
        surface: BROWSE_TRUST_PANEL_SURFACE,
        coverageId: "safety",
        count: 8,
        percent: 40,
        resultCount: 20,
      },
    );
    expect(browseTrustCoverageSignal("safety")).toBe("safety-notes");
    expect(browseTrustCoverageSignal("privacy")).toBe("privacy-notes");
    expect(browseTrustCoverageSignal("reviewed")).toBe("reviewed");
    expect(browseTrustCoverageSignal("source-backed")).toBe("source-backed");
    expect(browseTrustCoverageSignal("claimed")).toBeNull();
  });
});
