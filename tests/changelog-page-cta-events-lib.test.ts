import { describe, expect, it } from "vitest";
import {
  CHANGELOG_PAGE_SURFACE,
  changelogDiffDisclosureAnalyticsData,
  changelogDiffDisclosureAnalyticsEvent,
  changelogDiffEgressAnalyticsData,
  changelogDiffEgressAnalyticsEvent,
  changelogFeedEgressAnalyticsData,
  changelogFeedEgressAnalyticsEvent,
  changelogFeedEgressDestination,
  changelogPollCopyAnalyticsData,
  changelogPollCopyAnalyticsEvent,
  changelogQualityEgressAnalyticsData,
  changelogQualityEgressAnalyticsEvent,
  changelogQualityEgressDestination,
  changelogReadMoreAnalyticsData,
  changelogReadMoreAnalyticsEvent,
  changelogStreamFilterAnalyticsData,
  changelogStreamFilterAnalyticsEvent,
} from "@/lib/changelog-page-cta-events-lib";

describe("changelog page cta events lib", () => {
  it("builds changelog stream filter analytics", () => {
    expect(changelogStreamFilterAnalyticsEvent()).toBe(
      "changelog_stream_filter_click",
    );
    expect(changelogStreamFilterAnalyticsData("release", 8)).toEqual({
      surface: CHANGELOG_PAGE_SURFACE,
      streamFilter: "release",
      matchCount: 8,
    });
  });

  it("builds changelog read-more and quality egress analytics", () => {
    expect(changelogReadMoreAnalyticsEvent()).toBe("changelog_read_more_click");
    expect(changelogReadMoreAnalyticsData("policy", 2, 12)).toEqual({
      surface: CHANGELOG_PAGE_SURFACE,
      releaseStream: "policy",
      rowIndex: 2,
      issueCount: 12,
    });
    expect(changelogQualityEgressAnalyticsEvent()).toBe(
      "changelog_quality_egress_click",
    );
    expect(changelogQualityEgressAnalyticsData(12)).toEqual({
      surface: CHANGELOG_PAGE_SURFACE,
      issueCount: 12,
    });
  });

  it("builds changelog feed and diff egress analytics", () => {
    expect(changelogFeedEgressAnalyticsEvent()).toBe(
      "changelog_feed_egress_click",
    );
    expect(changelogFeedEgressAnalyticsData("rss", 12)).toEqual({
      surface: CHANGELOG_PAGE_SURFACE,
      destination: "rss",
      matchCount: 12,
    });
    expect(changelogFeedEgressAnalyticsData("atom", 12)).toEqual({
      surface: CHANGELOG_PAGE_SURFACE,
      destination: "atom",
      matchCount: 12,
    });
    expect(changelogDiffEgressAnalyticsEvent()).toBe(
      "changelog_diff_egress_click",
    );
    expect(changelogDiffEgressAnalyticsData("release", 1, 12)).toEqual({
      surface: CHANGELOG_PAGE_SURFACE,
      releaseStream: "release",
      rowIndex: 1,
      matchCount: 12,
    });
    expect(changelogPollCopyAnalyticsEvent()).toBe("changelog_poll_copy_click");
    expect(changelogPollCopyAnalyticsData(12)).toEqual({
      surface: CHANGELOG_PAGE_SURFACE,
      command: "diff-since",
      matchCount: 12,
    });
  });

  it("builds changelog diff disclosure toggle analytics", () => {
    expect(changelogDiffDisclosureAnalyticsEvent()).toBe(
      "changelog_diff_disclosure_toggle",
    );
    expect(
      changelogDiffDisclosureAnalyticsData("release", 1, true, 12),
    ).toEqual({
      surface: CHANGELOG_PAGE_SURFACE,
      releaseStream: "release",
      rowIndex: 1,
      open: true,
      matchCount: 12,
    });
    expect(changelogDiffDisclosureAnalyticsData("policy", 0, false, 8)).toEqual(
      {
        surface: CHANGELOG_PAGE_SURFACE,
        releaseStream: "policy",
        rowIndex: 0,
        open: false,
        matchCount: 8,
      },
    );
  });

  it("maps changelog feed and quality destinations", () => {
    expect(changelogFeedEgressDestination("rss")).toEqual({
      href: "/feed.xml",
    });
    expect(changelogFeedEgressDestination("atom")).toEqual({
      href: "/atom.xml",
    });
    expect(changelogFeedEgressDestination("unknown")).toBeNull();
    expect(changelogQualityEgressDestination("quality")).toEqual({
      to: "/quality",
    });
    expect(changelogQualityEgressDestination("unknown")).toBeNull();
  });
});
