/**
 * Pure quality page navigation analytics helpers.
 *
 * Maps category browse egress, changelog navigation, and report CTAs to
 * privacy-light event names without embedding titles, URLs, or entry names.
 */

export const QUALITY_PAGE_SURFACE = "quality-page";

export function qualityPageCategoryBrowseAnalyticsEvent(): string {
  return "quality_page_category_browse_click";
}

export function qualityPageCategoryBrowseAnalyticsData(
  category: string,
  entryCount: number,
  rowIndex: number,
  sectionCount: number,
) {
  return {
    surface: QUALITY_PAGE_SURFACE,
    category,
    entryCount,
    rowIndex,
    sectionCount,
  };
}

export function qualityPageChangelogAnalyticsEvent(): string {
  return "quality_page_changelog_click";
}

export function qualityPageChangelogAnalyticsData(previewCount: number) {
  return {
    surface: QUALITY_PAGE_SURFACE,
    previewCount,
  };
}

export function qualityPageClaimAnalyticsEvent(): string {
  return "quality_page_claim_click";
}

export function qualityPageClaimAnalyticsData() {
  return {
    surface: QUALITY_PAGE_SURFACE,
  };
}

export function qualityPageIssueAnalyticsEvent(): string {
  return "quality_page_issue_click";
}

export function qualityPageIssueAnalyticsData() {
  return {
    surface: QUALITY_PAGE_SURFACE,
  };
}
