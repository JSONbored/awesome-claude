/**
 * Pure contributor profile page navigation analytics helpers.
 *
 * Maps index egress, category hub, submit CTA, peer profile, and submitter
 * cross-links to privacy-light event names without embedding names or URLs.
 */

export const CONTRIBUTOR_PROFILE_SURFACE = "contributor-profile";

export function contributorProfileIndexAnalyticsEvent(): string {
  return "contributor_profile_index_click";
}

export function contributorProfileIndexAnalyticsData(
  contributorSlug: string,
  acceptedCount: number,
) {
  return {
    surface: CONTRIBUTOR_PROFILE_SURFACE,
    contributorSlug,
    acceptedCount,
  };
}

export function contributorProfileCategoryAnalyticsEvent(): string {
  return "contributor_profile_category_click";
}

export function contributorProfileCategoryAnalyticsData(
  contributorSlug: string,
  category: string,
  categoryEntryCount: number,
) {
  return {
    surface: CONTRIBUTOR_PROFILE_SURFACE,
    contributorSlug,
    category,
    categoryEntryCount,
  };
}

export function contributorProfileSubmitAnalyticsEvent(): string {
  return "contributor_profile_submit_click";
}

export function contributorProfileSubmitAnalyticsData(
  contributorSlug: string,
  acceptedCount: number,
) {
  return {
    surface: CONTRIBUTOR_PROFILE_SURFACE,
    contributorSlug,
    acceptedCount,
  };
}

export function contributorProfilePeerAnalyticsEvent(): string {
  return "contributor_profile_peer_click";
}

export function contributorProfilePeerAnalyticsData(
  contributorSlug: string,
  peerSlug: string,
  rowIndex: number,
  peerCount: number,
) {
  return {
    surface: CONTRIBUTOR_PROFILE_SURFACE,
    contributorSlug,
    peerSlug,
    rowIndex,
    peerCount,
  };
}

export function contributorProfileSubmitterAnalyticsEvent(): string {
  return "contributor_profile_submitter_click";
}

export function contributorProfileSubmitterAnalyticsData(
  contributorSlug: string,
  peerSlug: string,
  role: string,
  rowIndex: number,
  rowCount: number,
) {
  return {
    surface: CONTRIBUTOR_PROFILE_SURFACE,
    contributorSlug,
    peerSlug,
    role,
    rowIndex,
    rowCount,
  };
}

export function contributorProfileGithubAnalyticsEvent(): string {
  return "contributor_profile_github_click";
}

export function contributorProfileGithubAnalyticsData(
  contributorSlug: string,
  acceptedCount: number,
) {
  return {
    surface: CONTRIBUTOR_PROFILE_SURFACE,
    contributorSlug,
    acceptedCount,
  };
}

export type ContributorProfileTraceDestination =
  | "original-submission"
  | "import-pr"
  | "source"
  | "external-submitter";

export function contributorProfileTraceEgressAnalyticsEvent(): string {
  return "contributor_profile_trace_egress_click";
}

export function contributorProfileTraceEgressAnalyticsData(
  contributorSlug: string,
  destination: ContributorProfileTraceDestination,
  role: string,
  rowIndex: number,
  rowCount: number,
) {
  return {
    surface: CONTRIBUTOR_PROFILE_SURFACE,
    contributorSlug,
    destination,
    role,
    rowIndex,
    rowCount,
  };
}

export type ContributorProfileStatId = "accepted" | "reviewed" | "categories" | "source-linked";

export function contributorProfileStatAnalyticsEvent(): string {
  return "contributor_profile_stat_click";
}

export function contributorProfileStatAnalyticsData(
  contributorSlug: string,
  statId: ContributorProfileStatId,
  count: number,
) {
  return {
    surface: CONTRIBUTOR_PROFILE_SURFACE,
    contributorSlug,
    statId,
    count,
  };
}

/** Map a contributor headline stat to an in-app destination (route + hash/search). */
export function contributorProfileStatDestination(statId: ContributorProfileStatId): {
  to: "/contributors/$slug" | "/browse";
  hash?: string;
  search?: { signal?: string };
} {
  switch (statId) {
    case "accepted":
      return { to: "/contributors/$slug", hash: "accepted" };
    case "reviewed":
      return { to: "/contributors/$slug", hash: "reviewed" };
    case "categories":
      return { to: "/contributors/$slug", hash: "category-credits" };
    case "source-linked":
      return { to: "/browse", search: { signal: "source-backed" } };
  }
}
