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
  badgeChromeTrustBrowseDestination,
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
    expect(badgeChromeTrustAnalyticsData("review", "trending-list")).toEqual({
      surface: "trending-list",
      trust: "review",
    });
    expect(
      badgeChromeSourceAnalyticsData("source-backed", "trending-list"),
    ).toEqual({
      surface: "trending-list",
      source: "source-backed",
    });
    expect(badgeChromeCategoryAnalyticsData("mcp", "trending-list")).toEqual({
      surface: "trending-list",
      category: "mcp",
    });
    expect(badgeChromeTrustAnalyticsData("trusted", "trending-podium")).toEqual(
      {
        surface: "trending-podium",
        trust: "trusted",
      },
    );
    expect(
      badgeChromeSourceAnalyticsData("first-party", "trending-podium"),
    ).toEqual({
      surface: "trending-podium",
      source: "first-party",
    });
    expect(
      badgeChromeCategoryAnalyticsData("skills", "trending-podium"),
    ).toEqual({
      surface: "trending-podium",
      category: "skills",
    });
    expect(
      badgeChromeTrustAnalyticsData("limited", "validators-attention"),
    ).toEqual({
      surface: "validators-attention",
      trust: "limited",
    });
    expect(
      badgeChromeSourceAnalyticsData("unverified", "validators-attention"),
    ).toEqual({
      surface: "validators-attention",
      source: "unverified",
    });
    expect(
      badgeChromeCategoryAnalyticsData("hooks", "validators-attention"),
    ).toEqual({
      surface: "validators-attention",
      category: "hooks",
    });
    expect(
      badgeChromeTrustAnalyticsData("trusted", "validators-recent-reviewed"),
    ).toEqual({
      surface: "validators-recent-reviewed",
      trust: "trusted",
    });
    expect(
      badgeChromeCategoryAnalyticsData("mcp", "validators-recent-reviewed"),
    ).toEqual({
      surface: "validators-recent-reviewed",
      category: "mcp",
    });
    expect(badgeChromeTrustAnalyticsData("review", "hub-highlights")).toEqual({
      surface: "hub-highlights",
      trust: "review",
    });
    expect(
      badgeChromeTrustAnalyticsData("trusted", "category-ranking"),
    ).toEqual({
      surface: "category-ranking",
      trust: "trusted",
    });
  });

  it("maps trust levels to browse destinations", () => {
    expect(badgeChromeTrustBrowseDestination("trusted")).toEqual({
      to: "/browse",
      search: { trust: "trusted" },
    });
    expect(badgeChromeTrustBrowseDestination("review")).toEqual({
      to: "/browse",
      search: { trust: "review" },
    });
    expect(badgeChromeTrustBrowseDestination("limited")).toEqual({
      to: "/browse",
      search: { trust: "limited" },
    });
    expect(badgeChromeTrustBrowseDestination("blocked")).toEqual({
      to: "/browse",
      search: { trust: "blocked" },
    });
    expect(badgeChromeTrustBrowseDestination("unknown")).toBeNull();
    expect(badgeChromeTrustBrowseDestination("")).toBeNull();
  });
});
