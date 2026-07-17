import { describe, expect, it } from "vitest";
import {
  QUALITY_PAGE_SURFACE,
  qualityPageCategoryBrowseAnalyticsData,
  qualityPageCategoryBrowseAnalyticsEvent,
  qualityPageChangelogAnalyticsData,
  qualityPageChangelogAnalyticsEvent,
  qualityPageClaimAnalyticsData,
  qualityPageClaimAnalyticsEvent,
  qualityPageHeadlineStatAnalyticsData,
  qualityPageHeadlineStatAnalyticsEvent,
  qualityPageHeadlineStatBrowseSearch,
  qualityPageIssueAnalyticsData,
  qualityPageIssueAnalyticsEvent,
  qualityPageMethodToggleAnalyticsData,
  qualityPageMethodToggleAnalyticsEvent,
} from "@/lib/quality-page-cta-events-lib";

describe("quality page cta events lib", () => {
  it("builds quality page navigation analytics", () => {
    expect(qualityPageCategoryBrowseAnalyticsEvent()).toBe(
      "quality_page_category_browse_click",
    );
    expect(qualityPageCategoryBrowseAnalyticsData("mcp", 42, 2, 12)).toEqual({
      surface: QUALITY_PAGE_SURFACE,
      category: "mcp",
      entryCount: 42,
      rowIndex: 2,
      sectionCount: 12,
    });
    expect(qualityPageChangelogAnalyticsEvent()).toBe(
      "quality_page_changelog_click",
    );
    expect(qualityPageChangelogAnalyticsData(6)).toEqual({
      surface: QUALITY_PAGE_SURFACE,
      previewCount: 6,
    });
    expect(qualityPageClaimAnalyticsEvent()).toBe("quality_page_claim_click");
    expect(qualityPageClaimAnalyticsData()).toEqual({
      surface: QUALITY_PAGE_SURFACE,
    });
    expect(qualityPageIssueAnalyticsEvent()).toBe("quality_page_issue_click");
    expect(qualityPageIssueAnalyticsData()).toEqual({
      surface: QUALITY_PAGE_SURFACE,
    });
  });

  it("builds quality methodology accordion toggle analytics", () => {
    expect(qualityPageMethodToggleAnalyticsEvent()).toBe(
      "quality_page_method_toggle_click",
    );
    expect(
      qualityPageMethodToggleAnalyticsData("source-backed", true, 5),
    ).toEqual({
      surface: QUALITY_PAGE_SURFACE,
      methodId: "source-backed",
      open: true,
      methodCount: 5,
    });
    expect(
      qualityPageMethodToggleAnalyticsData("install-command", false, 5),
    ).toEqual({
      surface: QUALITY_PAGE_SURFACE,
      methodId: "install-command",
      open: false,
      methodCount: 5,
    });
  });

  it("builds headline stat analytics and browse search patches", () => {
    expect(qualityPageHeadlineStatAnalyticsEvent()).toBe(
      "quality_page_headline_stat_click",
    );
    expect(qualityPageHeadlineStatAnalyticsData("total", 1200, 100)).toEqual({
      surface: QUALITY_PAGE_SURFACE,
      statId: "total",
      value: 1200,
      percent: 100,
    });
    expect(
      qualityPageHeadlineStatAnalyticsData("source-backed", 800, 67),
    ).toEqual({
      surface: QUALITY_PAGE_SURFACE,
      statId: "source-backed",
      value: 800,
      percent: 67,
    });
    expect(qualityPageHeadlineStatBrowseSearch("total")).toEqual({});
    expect(qualityPageHeadlineStatBrowseSearch("source-backed")).toEqual({
      signal: "source-backed",
    });
    expect(qualityPageHeadlineStatBrowseSearch("safety-notes")).toEqual({
      signal: "safety-notes",
    });
    expect(qualityPageHeadlineStatBrowseSearch("reviewed")).toEqual({
      signal: "reviewed",
    });
    expect(qualityPageHeadlineStatBrowseSearch("unknown")).toBeNull();
  });
});
