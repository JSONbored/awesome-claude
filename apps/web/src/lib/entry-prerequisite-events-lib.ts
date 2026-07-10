/**
 * Pure entry prerequisite-readiness analytics helpers.
 *
 * Maps checklist interactions to privacy-light event names and payloads
 * (entry key, prerequisite kind, and progress counts only — no free-text
 * prerequisite copy is ever emitted).
 */

import type { PrerequisiteKind } from "@/lib/entry-prerequisite-readiness-lib";

export const ENTRY_PREREQUISITE_SURFACE = "detail-prerequisite-readiness";

export function entryPrerequisiteEntryKey(category: string, slug: string): string {
  return `${category}/${slug}`;
}

export function entryPrerequisiteToggleAnalyticsEvent(checked: boolean): string {
  return checked ? "detail_prereq_check" : "detail_prereq_uncheck";
}

export function entryPrerequisiteToggleAnalyticsData(
  category: string,
  slug: string,
  kind: PrerequisiteKind,
  checkedCount: number,
  total: number,
) {
  return {
    entry: entryPrerequisiteEntryKey(category, slug),
    surface: ENTRY_PREREQUISITE_SURFACE,
    kind,
    checkedCount,
    total,
  };
}

export function entryPrerequisiteResetAnalyticsEvent(): string {
  return "detail_prereq_reset";
}

export function entryPrerequisiteResetAnalyticsData(category: string, slug: string, total: number) {
  return {
    entry: entryPrerequisiteEntryKey(category, slug),
    surface: ENTRY_PREREQUISITE_SURFACE,
    total,
  };
}
