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

export function homePulseChangelogRowAnalyticsEvent(): string {
  return "home_pulse_changelog_row_click";
}

export function homePulseChangelogRowAnalyticsData(
  kind: string,
  rowIndex: number,
  rowCount: number,
) {
  return {
    surface: HOME_PAGE_SURFACE,
    kind,
    rowIndex,
    rowCount,
  };
}

/** Browse/trending destination for a home trust-strip headline stat. */
export type HomeTrustStatDestination = {
  to: "/browse" | "/trending";
  search?: {
    trust?: string;
    source?: string;
    signal?: string;
  };
};

export function homeTrustStatDestination(statId: string): HomeTrustStatDestination | null {
  switch (statId) {
    case "trusted":
      return { to: "/browse", search: { trust: "trusted" } };
    case "source-backed":
      return { to: "/browse", search: { source: "source-backed" } };
    case "reviewed":
      return { to: "/browse", search: { signal: "reviewed" } };
    case "live-signals":
      return { to: "/trending" };
    case "categories":
      return { to: "/browse" };
    default:
      return null;
  }
}

/** Browse search patch for a home intent chip. */
export type HomeIntentBrowseSearch = {
  q?: string;
  category?: string;
  trust?: string;
  source?: string;
  platform?: string;
  sort?: "popular" | "newest" | "title";
};

export function homeIntentBrowseSearch(intentId: string): HomeIntentBrowseSearch | null {
  switch (intentId) {
    case "ship-faster":
      return { category: "agents", sort: "popular" };
    case "review-safely":
      return { q: "code review", trust: "trusted", sort: "popular" };
    case "connect-data":
      return { category: "mcp", sort: "popular" };
    case "automate":
      return { q: "automation", category: "hooks", sort: "popular" };
    case "harden-agents":
      return { category: "hooks", trust: "trusted", sort: "popular" };
    default:
      return null;
  }
}

/** In-app destination for a home hero CTA. */
export type HomeHeroCtaDestination =
  | { to: "/browse" }
  | { to: "/best" }
  | { to: "/integrations/$slug"; params: { slug: string } };

export function homeHeroCtaDestination(ctaId: string): HomeHeroCtaDestination | null {
  switch (ctaId) {
    case "browse-all":
      return { to: "/browse" };
    case "setup-mcp":
      return { to: "/integrations/$slug", params: { slug: "mcp-server" } };
    case "best":
      return { to: "/best" };
    default:
      return null;
  }
}

/** In-app destination for a home contribute CTA. */
export type HomeContributeCtaDestination = {
  to: "/submit" | "/claim" | "/api-docs";
};

export function homeContributeCtaDestination(ctaId: string): HomeContributeCtaDestination | null {
  switch (ctaId) {
    case "submit":
      return { to: "/submit" };
    case "claim":
      return { to: "/claim" };
    case "api-docs":
      return { to: "/api-docs" };
    default:
      return null;
  }
}

export type HomeBrowseSearchDestination = {
  to: "/browse";
  search: { q: string };
};

/** Map a home example/popular search query to a browse destination. */
export function homeBrowseSearchDestination(query: string): HomeBrowseSearchDestination | null {
  const q = query.trim();
  switch (q) {
    case "":
      return null;
    default:
      return { to: "/browse", search: { q } };
  }
}

export type HomeCategorySelectDestination = {
  to: "/$category";
  params: { category: string };
};

/** Map a home category tile to its category hub destination. */
export function homeCategorySelectDestination(
  category: string,
): HomeCategorySelectDestination | null {
  const id = category.trim();
  switch (id) {
    case "":
      return null;
    default:
      return { to: "/$category", params: { category: id } };
  }
}

export type HomeRailCtaDestination = {
  to: "/browse" | "/trending";
};

/** Map a home rail CTA id to browse or trending. */
export function homeRailCtaDestination(railId: string): HomeRailCtaDestination | null {
  switch (railId) {
    case "categories":
    case "recent":
    case "newest":
      return { to: "/browse" };
    case "popular":
      return { to: "/trending" };
    default:
      return null;
  }
}

export type HomeCompareRailCtaDestination =
  | { to: "/compare"; search: { ids: string } }
  | { to: "/compare" };

/** Map a home compare-rail CTA (+ optional ids) to the compare workspace. */
export function homeCompareRailCtaDestination(
  ctaId: string,
  ids = "",
): HomeCompareRailCtaDestination | null {
  switch (ctaId) {
    case "open-compare": {
      const value = ids.trim();
      switch (value) {
        case "":
          return null;
        default:
          return { to: "/compare", search: { ids: value } };
      }
    }
    case "build-comparison":
      return { to: "/compare" };
    default:
      return null;
  }
}

export type HomeBriefDestination = {
  to: "/brief";
};

/** Map a home brief CTA id to the weekly brief hub. */
export function homeBriefDestination(destination: string): HomeBriefDestination | null {
  switch (destination) {
    case "brief":
      return { to: "/brief" };
    default:
      return null;
  }
}
