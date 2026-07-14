import { describe, expect, it } from "vitest";
import {
  HOME_PAGE_SURFACE,
  homeBriefAnalyticsData,
  homeBriefAnalyticsEvent,
  homeCategorySelectAnalyticsData,
  homeCategorySelectAnalyticsEvent,
  homeCompareRailCtaAnalyticsData,
  homeCompareRailCtaAnalyticsEvent,
  homeContributeCtaAnalyticsData,
  homeContributeCtaAnalyticsEvent,
  homeHeroCtaAnalyticsData,
  homeHeroCtaAnalyticsEvent,
  homeHeroExampleSearchAnalyticsData,
  homeHeroExampleSearchAnalyticsEvent,
  homeIntentSelectAnalyticsData,
  homeIntentSelectAnalyticsEvent,
  homePopularSearchAnalyticsData,
  homePopularSearchAnalyticsEvent,
  homePulseChangelogEgressAnalyticsData,
  homePulseChangelogEgressAnalyticsEvent,
  homePulseContributorClickAnalyticsData,
  homePulseContributorClickAnalyticsEvent,
  homePulseContributorsIndexAnalyticsData,
  homePulseContributorsIndexAnalyticsEvent,
  homeRailCtaAnalyticsData,
  homeRailCtaAnalyticsEvent,
  homeTrustStatAnalyticsData,
  homeTrustStatAnalyticsEvent,
} from "@/lib/home-page-cta-events-lib";

describe("home page cta events lib", () => {
  it("exposes privacy-light hero and intent navigation events", () => {
    expect(homeHeroExampleSearchAnalyticsEvent()).toBe(
      "home_hero_example_search",
    );
    expect(homeHeroExampleSearchAnalyticsData(12, 1)).toEqual({
      surface: HOME_PAGE_SURFACE,
      queryLength: 12,
      queryIndex: 1,
    });
    expect(homeHeroCtaAnalyticsEvent()).toBe("home_hero_cta_click");
    expect(homeHeroCtaAnalyticsData("setup-mcp")).toEqual({
      surface: HOME_PAGE_SURFACE,
      ctaId: "setup-mcp",
    });
    expect(homeIntentSelectAnalyticsEvent()).toBe("home_intent_select");
    expect(
      homeIntentSelectAnalyticsData("ship-faster", false, true, false),
    ).toEqual({
      surface: HOME_PAGE_SURFACE,
      intentId: "ship-faster",
      hasQuery: false,
      hasCategory: true,
      hasTrust: false,
    });
  });

  it("exposes trust, category, and rail navigation events", () => {
    expect(homeTrustStatAnalyticsEvent()).toBe("home_trust_stat_click");
    expect(homeTrustStatAnalyticsData("trusted")).toEqual({
      surface: HOME_PAGE_SURFACE,
      statId: "trusted",
    });
    expect(homeCategorySelectAnalyticsEvent()).toBe("home_category_select");
    expect(homeCategorySelectAnalyticsData("mcp", 42)).toEqual({
      surface: HOME_PAGE_SURFACE,
      category: "mcp",
      entryCount: 42,
    });
    expect(homeRailCtaAnalyticsEvent()).toBe("home_rail_cta_click");
    expect(homeRailCtaAnalyticsData("popular", "/trending")).toEqual({
      surface: HOME_PAGE_SURFACE,
      railId: "popular",
      destination: "/trending",
    });
    expect(homePopularSearchAnalyticsEvent()).toBe("home_popular_search_click");
    expect(homePopularSearchAnalyticsData(11, 2)).toEqual({
      surface: HOME_PAGE_SURFACE,
      queryLength: 11,
      queryIndex: 2,
    });
  });

  it("exposes compare, brief, contribute, and pulse navigation events", () => {
    expect(homeCompareRailCtaAnalyticsEvent()).toBe(
      "home_compare_rail_cta_click",
    );
    expect(homeCompareRailCtaAnalyticsData("open-compare", 4)).toEqual({
      surface: HOME_PAGE_SURFACE,
      ctaId: "open-compare",
      entryCount: 4,
    });
    expect(homeBriefAnalyticsEvent()).toBe("home_brief_click");
    expect(homeBriefAnalyticsData(12)).toEqual({
      surface: HOME_PAGE_SURFACE,
      issueNumber: 12,
    });
    expect(homeContributeCtaAnalyticsEvent()).toBe("home_contribute_cta_click");
    expect(homeContributeCtaAnalyticsData("submit")).toEqual({
      surface: HOME_PAGE_SURFACE,
      ctaId: "submit",
    });
    expect(homePulseChangelogEgressAnalyticsEvent()).toBe(
      "home_pulse_changelog_egress_click",
    );
    expect(homePulseChangelogEgressAnalyticsData()).toEqual({
      surface: HOME_PAGE_SURFACE,
    });
    expect(homePulseContributorsIndexAnalyticsEvent()).toBe(
      "home_pulse_contributors_index_click",
    );
    expect(homePulseContributorsIndexAnalyticsData()).toEqual({
      surface: HOME_PAGE_SURFACE,
    });
    expect(homePulseContributorClickAnalyticsEvent()).toBe(
      "home_pulse_contributor_click",
    );
    expect(homePulseContributorClickAnalyticsData("alice", 0, 4)).toEqual({
      surface: HOME_PAGE_SURFACE,
      contributorSlug: "alice",
      rowIndex: 0,
      rowCount: 4,
    });
  });
});
