/**
 * Pure home page navigation analytics helpers.
 *
 * Maps hero, trust strip, category, rail, and pulse navigation to privacy-light
 * event names without embedding search queries, titles, or contributor names.
 */

export const HOME_PAGE_SURFACE = "home-page";

export type HomeHeroCtaId = "browse-all" | "setup-mcp" | "best";
export type HomeTrustStatId =
  | "trusted"
  | "source-backed"
  | "reviewed"
  | "live-signals"
  | "categories";
export type HomeCompareRailCtaId = "open-compare" | "build-comparison";
export type HomeContributeCtaId = "submit" | "claim" | "api-docs";

export function homeHeroExampleSearchAnalyticsEvent(): string {
  return "home_hero_example_search";
}

export function homeHeroExampleSearchAnalyticsData(queryLength: number, queryIndex: number) {
  return {
    surface: HOME_PAGE_SURFACE,
    queryLength,
    queryIndex,
  };
}

export function homeHeroCtaAnalyticsEvent(): string {
  return "home_hero_cta_click";
}

export function homeHeroCtaAnalyticsData(ctaId: HomeHeroCtaId) {
  return {
    surface: HOME_PAGE_SURFACE,
    ctaId,
  };
}

export function homeIntentSelectAnalyticsEvent(): string {
  return "home_intent_select";
}

export function homeIntentSelectAnalyticsData(
  intentId: string,
  hasQuery: boolean,
  hasCategory: boolean,
  hasTrust: boolean,
) {
  return {
    surface: HOME_PAGE_SURFACE,
    intentId,
    hasQuery,
    hasCategory,
    hasTrust,
  };
}

export function homeTrustStatAnalyticsEvent(): string {
  return "home_trust_stat_click";
}

export function homeTrustStatAnalyticsData(statId: HomeTrustStatId) {
  return {
    surface: HOME_PAGE_SURFACE,
    statId,
  };
}

export function homeCategorySelectAnalyticsEvent(): string {
  return "home_category_select";
}

export function homeCategorySelectAnalyticsData(category: string, entryCount: number) {
  return {
    surface: HOME_PAGE_SURFACE,
    category,
    entryCount,
  };
}

export function homeRailCtaAnalyticsEvent(): string {
  return "home_rail_cta_click";
}

export function homeRailCtaAnalyticsData(railId: string, destination: string) {
  return {
    surface: HOME_PAGE_SURFACE,
    railId,
    destination,
  };
}

export function homePopularSearchAnalyticsEvent(): string {
  return "home_popular_search_click";
}

export function homePopularSearchAnalyticsData(queryLength: number, queryIndex: number) {
  return {
    surface: HOME_PAGE_SURFACE,
    queryLength,
    queryIndex,
  };
}

export function homeCompareRailCtaAnalyticsEvent(): string {
  return "home_compare_rail_cta_click";
}

export function homeCompareRailCtaAnalyticsData(ctaId: HomeCompareRailCtaId, entryCount: number) {
  return {
    surface: HOME_PAGE_SURFACE,
    ctaId,
    entryCount,
  };
}

export function homeBriefAnalyticsEvent(): string {
  return "home_brief_click";
}

export function homeBriefAnalyticsData(issueNumber: number) {
  return {
    surface: HOME_PAGE_SURFACE,
    issueNumber,
  };
}

export function homeContributeCtaAnalyticsEvent(): string {
  return "home_contribute_cta_click";
}

export function homeContributeCtaAnalyticsData(ctaId: HomeContributeCtaId) {
  return {
    surface: HOME_PAGE_SURFACE,
    ctaId,
  };
}

export function homePulseChangelogEgressAnalyticsEvent(): string {
  return "home_pulse_changelog_egress_click";
}

export function homePulseChangelogEgressAnalyticsData() {
  return {
    surface: HOME_PAGE_SURFACE,
  };
}

export function homePulseContributorsIndexAnalyticsEvent(): string {
  return "home_pulse_contributors_index_click";
}

export function homePulseContributorsIndexAnalyticsData() {
  return {
    surface: HOME_PAGE_SURFACE,
  };
}

export function homePulseContributorClickAnalyticsEvent(): string {
  return "home_pulse_contributor_click";
}

export function homePulseContributorClickAnalyticsData(
  contributorSlug: string,
  rowIndex: number,
  rowCount: number,
) {
  return {
    surface: HOME_PAGE_SURFACE,
    contributorSlug,
    rowIndex,
    rowCount,
  };
}
