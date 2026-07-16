import { describe, expect, it } from "vitest";
import {
  badgeChromeCategoryAnalyticsData,
  badgeChromeCategoryAnalyticsEvent,
  badgeChromeInstallRiskAnalyticsData,
  badgeChromeInstallRiskAnalyticsEvent,
  badgeChromeNotesAnalyticsData,
  badgeChromeNotesAnalyticsEvent,
  badgeChromeSourceAnalyticsData,
  badgeChromeSourceAnalyticsEvent,
  badgeChromeTrustAnalyticsData,
  badgeChromeTrustAnalyticsEvent,
} from "@/lib/badge-chrome-cta-events-lib";

describe("badge chrome cta events lib", () => {
  it("builds privacy-light badge chrome analytics", () => {
    expect(badgeChromeTrustAnalyticsEvent()).toBe("badge_trust_browse_click");
    expect(
      badgeChromeTrustAnalyticsData("trusted", "detail-sticky-meta"),
    ).toEqual({
      surface: "detail-sticky-meta",
      trust: "trusted",
    });
    expect(badgeChromeSourceAnalyticsEvent()).toBe("badge_source_browse_click");
    expect(
      badgeChromeSourceAnalyticsData("source-backed", "peek-panel"),
    ).toEqual({
      surface: "peek-panel",
      source: "source-backed",
    });
    expect(badgeChromeCategoryAnalyticsEvent()).toBe(
      "badge_category_browse_click",
    );
    expect(badgeChromeCategoryAnalyticsData("mcp", "peek-panel")).toEqual({
      surface: "peek-panel",
      category: "mcp",
    });
    expect(badgeChromeNotesAnalyticsEvent()).toBe("badge_notes_scroll_click");
    expect(
      badgeChromeNotesAnalyticsData("safety", true, "detail-sticky-meta"),
    ).toEqual({
      surface: "detail-sticky-meta",
      noteKind: "safety",
      present: true,
    });
    expect(badgeChromeInstallRiskAnalyticsEvent()).toBe(
      "badge_install_risk_scroll_click",
    );
    expect(badgeChromeInstallRiskAnalyticsData("review", "peek-panel")).toEqual(
      {
        surface: "peek-panel",
        risk: "review",
      },
    );
  });
});
