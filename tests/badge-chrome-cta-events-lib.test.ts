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
    expect(
      badgeChromeSourceAnalyticsData("first-party", "detail-header"),
    ).toEqual({
      surface: "detail-header",
      source: "first-party",
    });
    expect(
      badgeChromeSourceAnalyticsData("source-backed", "detail-sticky-meta"),
    ).toEqual({
      surface: "detail-sticky-meta",
      source: "source-backed",
    });
    expect(
      badgeChromeSourceAnalyticsData("source-backed", "contributor-profile"),
    ).toEqual({
      surface: "contributor-profile",
      source: "source-backed",
    });
    expect(
      badgeChromeTrustAnalyticsData("verified", "contributor-profile"),
    ).toEqual({
      surface: "contributor-profile",
      trust: "verified",
    });
    expect(badgeChromeTrustAnalyticsData("trusted", "compare-tray")).toEqual({
      surface: "compare-tray",
      trust: "trusted",
    });
    expect(
      badgeChromeSourceAnalyticsData("unverified", "compare-tray"),
    ).toEqual({
      surface: "compare-tray",
      source: "unverified",
    });
    expect(badgeChromeCategoryAnalyticsEvent()).toBe(
      "badge_category_browse_click",
    );
    expect(badgeChromeCategoryAnalyticsData("mcp", "peek-panel")).toEqual({
      surface: "peek-panel",
      category: "mcp",
    });
    expect(badgeChromeCategoryAnalyticsData("skills", "detail-header")).toEqual(
      {
        surface: "detail-header",
        category: "skills",
      },
    );
    expect(
      badgeChromeCategoryAnalyticsData("hooks", "contributor-profile"),
    ).toEqual({
      surface: "contributor-profile",
      category: "hooks",
    });
    expect(badgeChromeNotesAnalyticsEvent()).toBe("badge_notes_scroll_click");
    expect(
      badgeChromeNotesAnalyticsData("safety", true, "detail-sticky-meta"),
    ).toEqual({
      surface: "detail-sticky-meta",
      noteKind: "safety",
      present: true,
    });
    expect(
      badgeChromeNotesAnalyticsData("privacy", false, "detail-header"),
    ).toEqual({
      surface: "detail-header",
      noteKind: "privacy",
      present: false,
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
    expect(
      badgeChromeInstallRiskAnalyticsData("high", "detail-header"),
    ).toEqual({
      surface: "detail-header",
      risk: "high",
    });
  });
});
