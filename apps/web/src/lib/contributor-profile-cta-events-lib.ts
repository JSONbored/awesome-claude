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
