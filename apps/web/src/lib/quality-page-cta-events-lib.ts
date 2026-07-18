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

export type QualityPageStatId = "total" | "source-backed" | "safety-notes" | "reviewed";

export function qualityPageStatAnalyticsEvent(): string {
  return "quality_page_stat_click";
}

export function qualityPageStatAnalyticsData(
  statId: QualityPageStatId,
  count: number,
  percent: number,
) {
  return {
    surface: QUALITY_PAGE_SURFACE,
    statId,
    count,
    percent,
  };
}

/** Map a quality headline stat to a browse `signal` search patch (or bare browse). */
export function qualityPageStatBrowseSearch(
  statId: QualityPageStatId,
): { signal?: string } | undefined {
  switch (statId) {
    case "source-backed":
      return { signal: "source-backed" };
    case "safety-notes":
      return { signal: "safety-notes" };
    case "reviewed":
      return { signal: "reviewed" };
    case "total":
    default:
      return undefined;
  }
}

export type QualityPageCategoryBrowseDestination = {
  to: "/browse";
  search: { category: string };
};

/** Map a quality category coverage row to a directory browse destination. */
export function qualityPageCategoryBrowseDestination(
  category: string,
): QualityPageCategoryBrowseDestination | null {
  const id = category.trim();
  switch (id) {
    case "":
      return null;
    default:
      return { to: "/browse", search: { category: id } };
  }
}

export type QualityPageStatDestination = {
  to: "/browse";
  search?: { signal: string };
};

/** Map a quality headline stat id to a directory browse destination. */
export function qualityPageStatDestination(statId: string): QualityPageStatDestination | null {
  switch (statId) {
    case "source-backed":
      return { to: "/browse", search: { signal: "source-backed" } };
    case "safety-notes":
      return { to: "/browse", search: { signal: "safety-notes" } };
    case "reviewed":
      return { to: "/browse", search: { signal: "reviewed" } };
    case "total":
      return { to: "/browse" };
    default:
      return null;
  }
}

export type QualityPageChromeDestination =
  | { kind: "route"; to: "/changelog" | "/claim" }
  | { kind: "href"; href: string };

/** Map a quality chrome CTA id to a route or external href. */
export function qualityPageChromeDestination(ctaId: string): QualityPageChromeDestination | null {
  switch (ctaId) {
    case "changelog":
      return { kind: "route", to: "/changelog" };
    case "claim":
      return { kind: "route", to: "/claim" };
    case "issues":
      return { kind: "href", href: "https://github.com/jsonbored/awesome-claude/issues" };
    default:
      return null;
  }
}

export type QualityPageQueueEntryDestination = {
  to: "/entry/$category/$slug";
  params: { category: string; slug: string };
};

/** Map a quality queue row to an entry detail destination. */
export function qualityPageQueueEntryDestination(
  category: string,
  slug: string,
): QualityPageQueueEntryDestination | null {
  const categoryId = category.trim();
  const entrySlug = slug.trim();
  switch (categoryId) {
    case "":
      return null;
    default:
      switch (entrySlug) {
        case "":
          return null;
        default:
          return {
            to: "/entry/$category/$slug",
            params: { category: categoryId, slug: entrySlug },
          };
      }
  }
}
