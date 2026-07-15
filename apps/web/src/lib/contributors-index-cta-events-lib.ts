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
