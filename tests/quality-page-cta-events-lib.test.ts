import { describe, expect, it } from "vitest";
import {
  QUALITY_PAGE_SURFACE,
  qualityPageCategoryBrowseAnalyticsData,
  qualityPageCategoryBrowseAnalyticsEvent,
  qualityPageChangelogAnalyticsData,
  qualityPageChangelogAnalyticsEvent,
  qualityPageClaimAnalyticsData,
  qualityPageClaimAnalyticsEvent,
  qualityPageIssueAnalyticsData,
  qualityPageIssueAnalyticsEvent,
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
});
