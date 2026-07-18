import { describe, expect, it } from "vitest";
import {
  HOME_PAGE_SURFACE,
  homeBriefAnalyticsData,
  homeBriefAnalyticsEvent,
  homeBriefDestination,
  homeBrowseSearchDestination,
  homeCategorySelectAnalyticsData,
  homeCategorySelectAnalyticsEvent,
  homeCategorySelectDestination,
  homeCompareRailCtaAnalyticsData,
  homeCompareRailCtaAnalyticsEvent,
  homeCompareRailCtaDestination,
  homeContributeCtaAnalyticsData,
  homeContributeCtaAnalyticsEvent,
  homeContributeCtaDestination,
  homeHeroCtaAnalyticsData,
  homeHeroCtaAnalyticsEvent,
  homeHeroCtaDestination,
  homeHeroExampleSearchAnalyticsData,
  homeHeroExampleSearchAnalyticsEvent,
  homeIntentBrowseSearch,
  homeIntentSelectAnalyticsData,
  homeIntentSelectAnalyticsEvent,
  homePopularSearchAnalyticsData,
  homePopularSearchAnalyticsEvent,
  homePulseChangelogEgressAnalyticsData,
  homePulseChangelogEgressAnalyticsEvent,
  homePulseChangelogRowAnalyticsData,
  homePulseChangelogRowAnalyticsEvent,
  homePulseContributorClickAnalyticsData,
  homePulseContributorClickAnalyticsEvent,
  homePulseContributorsIndexAnalyticsData,
  homePulseContributorsIndexAnalyticsEvent,
  homeRailCtaAnalyticsData,
  homeRailCtaAnalyticsEvent,
  homeRailCtaDestination,
  homeTrustStatAnalyticsData,
  homeTrustStatAnalyticsEvent,
  homeTrustStatDestination,
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
    expect(homePulseChangelogRowAnalyticsEvent()).toBe(
      "home_pulse_changelog_row_click",
    );
    expect(homePulseChangelogRowAnalyticsData("added", 1, 4)).toEqual({
      surface: HOME_PAGE_SURFACE,
      kind: "added",
      rowIndex: 1,
      rowCount: 4,
    });
  });

  it("maps home trust strip stats to browse destinations", () => {
    expect(homeTrustStatDestination("trusted")).toEqual({
      to: "/browse",
      search: { trust: "trusted" },
    });
    expect(homeTrustStatDestination("source-backed")).toEqual({
      to: "/browse",
      search: { source: "source-backed" },
    });
    expect(homeTrustStatDestination("reviewed")).toEqual({
      to: "/browse",
      search: { signal: "reviewed" },
    });
    expect(homeTrustStatDestination("live-signals")).toEqual({
      to: "/trending",
    });
    expect(homeTrustStatDestination("categories")).toEqual({
      to: "/browse",
    });
    expect(homeTrustStatDestination("unknown")).toBeNull();
  });

  it("maps home intent chips to browse search patches", () => {
    expect(homeIntentBrowseSearch("ship-faster")).toEqual({
      category: "agents",
      sort: "popular",
    });
    expect(homeIntentBrowseSearch("review-safely")).toEqual({
      q: "code review",
      trust: "trusted",
      sort: "popular",
    });
    expect(homeIntentBrowseSearch("connect-data")).toEqual({
      category: "mcp",
      sort: "popular",
    });
    expect(homeIntentBrowseSearch("automate")).toEqual({
      q: "automation",
      category: "hooks",
      sort: "popular",
    });
    expect(homeIntentBrowseSearch("harden-agents")).toEqual({
      category: "hooks",
      trust: "trusted",
      sort: "popular",
    });
    expect(homeIntentBrowseSearch("unknown")).toBeNull();
  });

  it("maps home hero and contribute CTAs to destinations", () => {
    expect(homeHeroCtaDestination("browse-all")).toEqual({ to: "/browse" });
    expect(homeHeroCtaDestination("setup-mcp")).toEqual({
      to: "/integrations/$slug",
      params: { slug: "mcp-server" },
    });
    expect(homeHeroCtaDestination("best")).toEqual({ to: "/best" });
    expect(homeHeroCtaDestination("unknown")).toBeNull();
    expect(homeContributeCtaDestination("submit")).toEqual({ to: "/submit" });
    expect(homeContributeCtaDestination("claim")).toEqual({ to: "/claim" });
    expect(homeContributeCtaDestination("api-docs")).toEqual({
      to: "/api-docs",
    });
    expect(homeContributeCtaDestination("unknown")).toBeNull();
  });

  it("maps home browse, category, rail, compare, and brief destinations", () => {
    expect(homeBrowseSearchDestination("mcp browser")).toEqual({
      to: "/browse",
      search: { q: "mcp browser" },
    });
    expect(homeBrowseSearchDestination("")).toBeNull();
    expect(homeCategorySelectDestination("mcp")).toEqual({
      to: "/$category",
      params: { category: "mcp" },
    });
    expect(homeCategorySelectDestination("")).toBeNull();
    expect(homeRailCtaDestination("categories")).toEqual({ to: "/browse" });
    expect(homeRailCtaDestination("popular")).toEqual({ to: "/trending" });
    expect(homeRailCtaDestination("unknown")).toBeNull();
    expect(homeCompareRailCtaDestination("open-compare", "a,b")).toEqual({
      to: "/compare",
      search: { ids: "a,b" },
    });
    expect(homeCompareRailCtaDestination("open-compare", "")).toBeNull();
    expect(homeCompareRailCtaDestination("build-comparison")).toEqual({
      to: "/compare",
    });
    expect(homeBriefDestination("brief")).toEqual({ to: "/brief" });
    expect(homeBriefDestination("unknown")).toBeNull();
  });
});
