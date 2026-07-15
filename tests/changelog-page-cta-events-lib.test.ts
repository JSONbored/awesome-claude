import { describe, expect, it } from "vitest";
import {
  CHANGELOG_PAGE_SURFACE,
  changelogQualityEgressAnalyticsData,
  changelogQualityEgressAnalyticsEvent,
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
});
