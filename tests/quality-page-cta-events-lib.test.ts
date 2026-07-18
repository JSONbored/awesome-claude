import { describe, expect, it } from "vitest";
import {
  QUALITY_PAGE_SURFACE,
  qualityPageCategoryBrowseAnalyticsData,
  qualityPageCategoryBrowseAnalyticsEvent,
  qualityPageCategoryBrowseDestination,
  qualityPageChangelogAnalyticsData,
  qualityPageChangelogAnalyticsEvent,
  qualityPageChromeDestination,
  qualityPageClaimAnalyticsData,
  qualityPageClaimAnalyticsEvent,
  qualityPageIssueAnalyticsData,
  qualityPageIssueAnalyticsEvent,
  qualityPageMethodToggleAnalyticsData,
  qualityPageMethodToggleAnalyticsEvent,
  qualityPageQueueEntryDestination,
  qualityPageStatAnalyticsData,
  qualityPageStatAnalyticsEvent,
  qualityPageStatBrowseSearch,
  qualityPageStatDestination,
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

  it("builds quality page headline stat analytics and browse search", () => {
    expect(qualityPageStatAnalyticsEvent()).toBe("quality_page_stat_click");
    expect(qualityPageStatAnalyticsData("total", 1200, 100)).toEqual({
      surface: QUALITY_PAGE_SURFACE,
      statId: "total",
      count: 1200,
      percent: 100,
    });
    expect(qualityPageStatAnalyticsData("source-backed", 900, 75)).toEqual({
      surface: QUALITY_PAGE_SURFACE,
      statId: "source-backed",
      count: 900,
      percent: 75,
    });
    expect(qualityPageStatBrowseSearch("total")).toBeUndefined();
    expect(qualityPageStatBrowseSearch("source-backed")).toEqual({
      signal: "source-backed",
    });
    expect(qualityPageStatBrowseSearch("safety-notes")).toEqual({
      signal: "safety-notes",
    });
    expect(qualityPageStatBrowseSearch("reviewed")).toEqual({
      signal: "reviewed",
    });
  });

  it("maps quality page destinations", () => {
    expect(qualityPageCategoryBrowseDestination("mcp")).toEqual({
      to: "/browse",
      search: { category: "mcp" },
    });
    expect(qualityPageCategoryBrowseDestination("")).toBeNull();
    expect(qualityPageStatDestination("total")).toEqual({ to: "/browse" });
    expect(qualityPageStatDestination("source-backed")).toEqual({
      to: "/browse",
      search: { signal: "source-backed" },
    });
    expect(qualityPageStatDestination("safety-notes")).toEqual({
      to: "/browse",
      search: { signal: "safety-notes" },
    });
    expect(qualityPageStatDestination("reviewed")).toEqual({
      to: "/browse",
      search: { signal: "reviewed" },
    });
    expect(qualityPageStatDestination("unknown")).toBeNull();
    expect(qualityPageChromeDestination("changelog")).toEqual({
      kind: "route",
      to: "/changelog",
    });
    expect(qualityPageChromeDestination("claim")).toEqual({
      kind: "route",
      to: "/claim",
    });
    expect(qualityPageChromeDestination("issues")).toEqual({
      kind: "href",
      href: "https://github.com/jsonbored/awesome-claude/issues",
    });
    expect(qualityPageChromeDestination("unknown")).toBeNull();
    expect(qualityPageQueueEntryDestination("mcp", "browser")).toEqual({
      to: "/entry/$category/$slug",
      params: { category: "mcp", slug: "browser" },
    });
    expect(qualityPageQueueEntryDestination("", "browser")).toBeNull();
    expect(qualityPageQueueEntryDestination("mcp", "")).toBeNull();
  });
});
