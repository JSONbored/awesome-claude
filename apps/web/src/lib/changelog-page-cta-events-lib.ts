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

export function changelogPollCopyAnalyticsEvent(): string {
  return "changelog_poll_copy_click";
}

export function changelogPollCopyAnalyticsData(matchCount: number) {
  return {
    surface: CHANGELOG_PAGE_SURFACE,
    command: "diff-since",
    matchCount,
  };
}

export function changelogDiffDisclosureAnalyticsEvent(): string {
  return "changelog_diff_disclosure_toggle";
}

export function changelogDiffDisclosureAnalyticsData(
  releaseStream: ReleaseStream,
  rowIndex: number,
  open: boolean,
  matchCount: number,
) {
  return {
    surface: CHANGELOG_PAGE_SURFACE,
    releaseStream,
    rowIndex,
    open,
    matchCount,
  };
}

export type ChangelogFeedHrefDestination = {
  href: string;
};

/** Map a changelog feed egress id to its XML feed href. */
export function changelogFeedEgressDestination(
  destination: string,
): ChangelogFeedHrefDestination | null {
  switch (destination) {
    case "rss":
      return { href: "/feed.xml" };
    case "atom":
      return { href: "/atom.xml" };
    default:
      return null;
  }
}

export type ChangelogQualityEgressDestination = {
  to: "/quality";
};

/** Map a changelog quality sidebar CTA id to the quality page. */
export function changelogQualityEgressDestination(
  destination: string,
): ChangelogQualityEgressDestination | null {
  switch (destination) {
    case "quality":
      return { to: "/quality" };
    default:
      return null;
  }
}
