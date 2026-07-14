/**
 * Pure comparison table entry egress analytics helpers.
 *
 * Maps comparison table header entry navigation to privacy-light event names
 * without embedding entry titles or comparison copy.
 */

import { COMPARE_TABLE_SURFACE } from "@/lib/compare-table-actions-lib";

export type CompareTableEntryLinkKind = "title" | "dossier";

export function compareTableEntryKey(category: string, slug: string): string {
  return `${category}/${slug}`;
}

export function compareTableEntryAnalyticsEvent(): string {
  return "compare_table_entry_click";
}

export function compareTableEntryAnalyticsData(
  category: string,
  slug: string,
  linkKind: CompareTableEntryLinkKind,
  columnIndex: number,
  comparedCount: number,
) {
  return {
    entry: compareTableEntryKey(category, slug),
    surface: COMPARE_TABLE_SURFACE,
    linkKind,
    columnIndex,
    comparedCount,
  };
}
