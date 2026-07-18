/**
 * Pure contributors index page navigation analytics helpers.
 *
 * Maps profile card and submit CTA navigation to privacy-light event names
 * without embedding contributor names, handles, or URLs.
 */

export const CONTRIBUTORS_INDEX_SURFACE = "contributors-index";

export function contributorsIndexProfileAnalyticsEvent(): string {
  return "contributors_index_profile_click";
}

export function contributorsIndexProfileAnalyticsData(
  contributorSlug: string,
  acceptedCount: number,
  rowIndex: number,
  contributorCount: number,
) {
  return {
    surface: CONTRIBUTORS_INDEX_SURFACE,
    contributorSlug,
    acceptedCount,
    rowIndex,
    contributorCount,
  };
}

export function contributorsIndexSubmitAnalyticsEvent(): string {
  return "contributors_index_submit_click";
}

export function contributorsIndexSubmitAnalyticsData(
  contributorCount: number,
  totalAccepted: number,
) {
  return {
    surface: CONTRIBUTORS_INDEX_SURFACE,
    contributorCount,
    totalAccepted,
  };
}

export type ContributorsIndexGithubVariant = "featured" | "card";

export function contributorsIndexGithubAnalyticsEvent(): string {
  return "contributors_index_github_click";
}

export function contributorsIndexGithubAnalyticsData(
  contributorSlug: string,
  acceptedCount: number,
  variant: ContributorsIndexGithubVariant,
  rowIndex: number | null,
  contributorCount: number,
) {
  return {
    surface: CONTRIBUTORS_INDEX_SURFACE,
    contributorSlug,
    acceptedCount,
    variant,
    rowIndex,
    contributorCount,
  };
}

export type ContributorsIndexStatId = "contributors" | "accepted-entries";

export type ContributorsIndexStatDestination = {
  to: "/contributors" | "/browse";
  hash?: string;
};

export function contributorsIndexStatAnalyticsEvent(): string {
  return "contributors_index_stat_click";
}

export function contributorsIndexStatAnalyticsData(
  statId: string,
  value: number,
  contributorCount: number,
  totalAccepted: number,
) {
  return {
    surface: CONTRIBUTORS_INDEX_SURFACE,
    statId,
    value,
    contributorCount,
    totalAccepted,
  };
}

/** Map a contributors index headline stat to an in-app destination. */
export function contributorsIndexStatDestination(
  statId: string,
): ContributorsIndexStatDestination | null {
  switch (statId) {
    case "contributors":
      return { to: "/contributors", hash: "contributor-grid" };
    case "accepted-entries":
      return { to: "/browse" };
    default:
      return null;
  }
}

export function contributorsIndexFeaturedProfileAnalyticsEvent(): string {
  return "contributors_index_featured_profile_click";
}

export function contributorsIndexFeaturedProfileAnalyticsData(
  contributorSlug: string,
  acceptedCount: number,
  contributorCount: number,
) {
  return {
    surface: CONTRIBUTORS_INDEX_SURFACE,
    contributorSlug,
    acceptedCount,
    contributorCount,
  };
}

export type ContributorsIndexProfileDestination = {
  to: "/contributors/$slug";
  params: { slug: string };
};

/** Map a contributors index profile slug to a profile destination. */
export function contributorsIndexProfileDestination(
  slug: string,
): ContributorsIndexProfileDestination | null {
  const id = slug.trim();
  switch (id) {
    case "":
      return null;
    default:
      return { to: "/contributors/$slug", params: { slug: id } };
  }
}

export type ContributorsIndexSubmitDestination = {
  to: "/submit";
};

/** Map a contributors index submit CTA id to the submission route. */
export function contributorsIndexSubmitDestination(
  destination: string,
): ContributorsIndexSubmitDestination | null {
  switch (destination) {
    case "submit":
      return { to: "/submit" };
    default:
      return null;
  }
}
