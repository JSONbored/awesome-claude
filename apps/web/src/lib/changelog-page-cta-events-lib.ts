/**
 * Pure changelog page navigation analytics helpers.
 *
 * Maps stream filters, read-more egress, and quality sidebar links to
 * privacy-light event names without embedding titles, hrefs, or note copy.
 */

import type { ReleaseStream } from "@/data/changelog";

export const CHANGELOG_PAGE_SURFACE = "changelog-page";

export type ChangelogStreamFilter = "all" | ReleaseStream;

export function changelogStreamFilterAnalyticsEvent(): string {
  return "changelog_stream_filter_click";
}

export function changelogStreamFilterAnalyticsData(
  streamFilter: ChangelogStreamFilter,
  matchCount: number,
) {
  return {
    surface: CHANGELOG_PAGE_SURFACE,
    streamFilter,
    matchCount,
  };
}

export function changelogReadMoreAnalyticsEvent(): string {
  return "changelog_read_more_click";
}

export function changelogReadMoreAnalyticsData(
  releaseStream: ReleaseStream,
  rowIndex: number,
  issueCount: number,
) {
  return {
    surface: CHANGELOG_PAGE_SURFACE,
    releaseStream,
    rowIndex,
    issueCount,
  };
}

export function changelogQualityEgressAnalyticsEvent(): string {
  return "changelog_quality_egress_click";
}

export function changelogQualityEgressAnalyticsData(issueCount: number) {
  return {
    surface: CHANGELOG_PAGE_SURFACE,
    issueCount,
  };
}

export type ChangelogFeedDestination = "rss" | "atom";

export function changelogFeedEgressAnalyticsEvent(): string {
  return "changelog_feed_egress_click";
}

export function changelogFeedEgressAnalyticsData(
  destination: ChangelogFeedDestination,
  matchCount: number,
) {
  return {
    surface: CHANGELOG_PAGE_SURFACE,
    destination,
    matchCount,
  };
}

export function changelogDiffEgressAnalyticsEvent(): string {
  return "changelog_diff_egress_click";
}

export function changelogDiffEgressAnalyticsData(
  releaseStream: ReleaseStream,
  rowIndex: number,
  matchCount: number,
) {
  return {
    surface: CHANGELOG_PAGE_SURFACE,
    releaseStream,
    rowIndex,
    matchCount,
  };
}
