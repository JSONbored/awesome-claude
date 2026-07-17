/**
 * Pure quality page navigation analytics helpers.
 *
 * Maps category browse egress, changelog navigation, report CTAs, and
 * methodology accordion toggles to privacy-light event names without embedding
 * titles, URLs, or entry names.
 */

export const QUALITY_PAGE_SURFACE = "quality-page";

export type QualityMethodId =
  | "source-backed"
  | "safety-notes"
  | "privacy-notes"
  | "reviewed"
  | "install-command";

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

export function qualityPageMethodToggleAnalyticsEvent(): string {
  return "quality_page_method_toggle_click";
}

export function qualityPageMethodToggleAnalyticsData(
  methodId: QualityMethodId,
  open: boolean,
  methodCount: number,
) {
  return {
    surface: QUALITY_PAGE_SURFACE,
    methodId,
    open,
    methodCount,
  };
}

export type QualityHeadlineStatId = "total" | "source-backed" | "safety-notes" | "reviewed";

export type QualityHeadlineBrowseSearch = {
  source?: string;
  signal?: string;
};

export function qualityPageHeadlineStatAnalyticsEvent(): string {
  return "quality_page_headline_stat_click";
}

export function qualityPageHeadlineStatAnalyticsData(
  statId: string,
  value: number,
  percent: number,
) {
  return {
    surface: QUALITY_PAGE_SURFACE,
    statId,
    value,
    percent,
  };
}

/** Map a quality headline stat to a browse search patch. */
export function qualityPageHeadlineStatBrowseSearch(
  statId: string,
): QualityHeadlineBrowseSearch | null {
  switch (statId) {
    case "total":
      return {};
    case "source-backed":
      return { signal: "source-backed" };
    case "safety-notes":
      return { signal: "safety-notes" };
    case "reviewed":
      return { signal: "reviewed" };
    default:
      return null;
  }
}
