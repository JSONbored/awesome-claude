/**
 * Pure compare page selection lifecycle analytics helpers.
 *
 * Maps clear, remove, add, and dossier navigation on /compare to
 * privacy-light event names without embedding entry titles.
 */

import { COMPARE_PAGE_SURFACE } from "@/lib/compare-page-summary-lib";

export function comparePageEntryKey(category: string, slug: string): string {
  return `${category}/${slug}`;
}

export function comparePageClearAnalyticsEvent(): string {
  return "compare_page_clear";
}

export function comparePageClearAnalyticsData(count: number) {
  return {
    count,
    surface: COMPARE_PAGE_SURFACE,
  };
}

export function comparePageRemoveAnalyticsEvent(): string {
  return "compare_page_remove";
}

export function comparePageRemoveAnalyticsData(
  category: string,
  slug: string,
  remainingCount: number,
) {
  return {
    entry: comparePageEntryKey(category, slug),
    surface: COMPARE_PAGE_SURFACE,
    count: remainingCount,
  };
}

export function comparePageAddOpenAnalyticsEvent(): string {
  return "compare_page_add_open";
}

export function comparePageAddOpenAnalyticsData(compareCount: number) {
  return {
    count: compareCount,
    surface: COMPARE_PAGE_SURFACE,
  };
}

export function comparePageAddSelectAnalyticsEvent(): string {
  return "compare_page_add_select";
}

export function comparePageAddSelectAnalyticsData(
  category: string,
  slug: string,
  compareCount: number,
) {
  return {
    entry: comparePageEntryKey(category, slug),
    surface: COMPARE_PAGE_SURFACE,
    count: compareCount,
  };
}

export function comparePageOpenDossierAnalyticsEvent(): string {
  return "compare_open_dossier";
}

export function comparePageOpenDossierAnalyticsData(category: string, slug: string) {
  return {
    entry: comparePageEntryKey(category, slug),
    surface: COMPARE_PAGE_SURFACE,
  };
}
