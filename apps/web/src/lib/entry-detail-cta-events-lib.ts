/**
 * Pure entry detail CTA analytics and intent-event helpers.
 *
 * Maps detail-page actions to privacy-light event names and intent types
 * without embedding copy payloads or other sensitive data.
 */

import type { CopyVariant } from "@/lib/dossier-prefs";
import type { IntentEventClientType } from "@/lib/intent-event-client-lib";
import type { Entry } from "@/types/registry";

export const ENTRY_DETAIL_COMMAND_CENTER_SURFACE = "detail-command-center";
export const ENTRY_DETAIL_COMPARE_SURFACE = "detail-compare";
export const ENTRY_DETAIL_DECISION_PLAYBOOK_SURFACE = "detail-decision-playbook";
export const ENTRY_DETAIL_MOBILE_SURFACE = "detail-mobile";
export const BROWSE_COMPARE_SURFACE = "browse-compare";
export const COMPARE_TRAY_SURFACE = "compare-tray";

export type BrowseCompareOpenSurface =
  | "browse-toolbar"
  | "browse-compare-selection-banner"
  | "browse-trust-panel"
  | "browse-compare-url";

export function entryDetailEntryKey(category: string, slug: string): string {
  return `${category}/${slug}`;
}

export function entryDetailCopyIntentType(tab: CopyVariant): IntentEventClientType {
  return tab === "install" ? "install" : "copy";
}

export function entryDetailCopyAnalyticsEvent(tab: CopyVariant): string {
  return `detail_copy_${tab}`;
}

export function entryDetailCopyAnalyticsData(category: string, slug: string) {
  return {
    entry: entryDetailEntryKey(category, slug),
    surface: ENTRY_DETAIL_COMMAND_CENTER_SURFACE,
  };
}

export function entryDetailCompareAnalyticsEvent(adding: boolean): string {
  return adding ? "detail_compare_add" : "detail_compare_remove";
}

export function entryDetailCompareAnalyticsData(category: string, slug: string) {
  return {
    entry: entryDetailEntryKey(category, slug),
    surface: ENTRY_DETAIL_COMPARE_SURFACE,
  };
}

export function entryDetailCompareOpenTrayAnalyticsEvent(): string {
  return "detail_compare_open_tray";
}

export function entryDetailCompareOpenTrayAnalyticsData(
  category: string,
  slug: string,
  compareCount: number,
) {
  return {
    entry: entryDetailEntryKey(category, slug),
    surface: ENTRY_DETAIL_COMPARE_SURFACE,
    compareCount,
  };
}

export function entryDetailCompareToastOpenAnalyticsEvent(): string {
  return "detail_compare_toast_open";
}

export function entryDetailCompareToastOpenAnalyticsData(
  category: string,
  slug: string,
  compareCount: number,
) {
  return {
    entry: entryDetailEntryKey(category, slug),
    surface: ENTRY_DETAIL_COMPARE_SURFACE,
    compareCount,
  };
}

export function entryDetailCompareFullAnalyticsEvent(): string {
  return "detail_compare_open_full";
}

export function entryDetailCompareFullAnalyticsData(
  category: string,
  slug: string,
  compareCount: number,
) {
  return {
    entry: entryDetailEntryKey(category, slug),
    surface: ENTRY_DETAIL_COMPARE_SURFACE,
    compareCount,
  };
}

export function entryDetailMobileCompareAnalyticsEvent(adding: boolean): string {
  return adding ? "detail_mobile_compare_add" : "detail_mobile_compare_remove";
}

export function entryDetailMobileCompareAnalyticsData(
  category: string,
  slug: string,
  compareCount: number,
) {
  return {
    entry: entryDetailEntryKey(category, slug),
    surface: ENTRY_DETAIL_MOBILE_SURFACE,
    compareCount,
  };
}

export function entryDetailMobileCompareToastOpenAnalyticsEvent(): string {
  return "detail_mobile_compare_toast_open";
}

export function entryDetailMobileCompareToastOpenAnalyticsData(
  category: string,
  slug: string,
  compareCount: number,
) {
  return {
    entry: entryDetailEntryKey(category, slug),
    surface: ENTRY_DETAIL_MOBILE_SURFACE,
    compareCount,
  };
}

export function browseCompareOpenAnalyticsEvent(): string {
  return "browse_compare_open";
}

export function browseCompareOpenAnalyticsData(
  selectedCount: number,
  surface: BrowseCompareOpenSurface,
) {
  return {
    count: selectedCount,
    surface,
  };
}

export function comparisonTrayQuickCompareAnalyticsEvent(): string {
  return "compare_tray_quick_compare";
}

export function comparisonTrayQuickCompareAnalyticsData(count: number) {
  return { count, surface: COMPARE_TRAY_SURFACE };
}

export function comparisonTrayFullCompareAnalyticsEvent(): string {
  return "compare_tray_full_compare";
}

export function comparisonTrayFullCompareAnalyticsData(count: number) {
  return { count, surface: COMPARE_TRAY_SURFACE };
}

export function comparisonTrayViewSelectionAnalyticsEvent(): string {
  return "compare_tray_view_selection";
}

export function comparisonTrayViewSelectionAnalyticsData(count: number) {
  return { count, surface: COMPARE_TRAY_SURFACE };
}

export function comparisonTrayRemoveAnalyticsEvent(): string {
  return "compare_tray_remove";
}

export function comparisonTrayRemoveAnalyticsData(
  category: string,
  slug: string,
  remainingCount: number,
) {
  return {
    entry: entryDetailEntryKey(category, slug),
    surface: COMPARE_TRAY_SURFACE,
    count: remainingCount,
  };
}

export function comparisonTrayClearAnalyticsEvent(): string {
  return "compare_tray_clear";
}

export function comparisonTrayClearAnalyticsData(clearedCount: number) {
  return {
    count: clearedCount,
    surface: COMPARE_TRAY_SURFACE,
  };
}

export function entryDetailMobileActionAnalyticsEvent(actionId: string): string {
  return `detail_mobile_${actionId.replace(/-/g, "_")}`;
}

export function entryDetailMobileActionAnalyticsData(
  category: string,
  slug: string,
  actionId: string,
) {
  return {
    entry: entryDetailEntryKey(category, slug),
    action: actionId,
    surface: ENTRY_DETAIL_MOBILE_SURFACE,
  };
}

export function entryDetailMobileCopyIntentType(
  entry: Pick<Entry, "installCommand">,
): IntentEventClientType {
  return entry.installCommand ? "install" : "copy";
}

export function entryDetailMobileLinkIntentType(actionId: string): IntentEventClientType | null {
  if (actionId === "source" || actionId === "llms") return "open";
  return null;
}

export function entryDetailIntegrationAnalyticsEvent(linkId: string): string {
  return `detail_integration_${linkId.replace(/-/g, "_")}`;
}

export function entryDetailIntegrationAnalyticsData(
  category: string,
  slug: string,
  linkId: string,
) {
  return {
    entry: entryDetailEntryKey(category, slug),
    link: linkId,
    surface: ENTRY_DETAIL_COMMAND_CENTER_SURFACE,
  };
}

export function entryDetailSourceAnalyticsEvent(): string {
  return "detail_source_open";
}

export function entryDetailSourceAnalyticsData(category: string, slug: string, host: string) {
  return {
    entry: entryDetailEntryKey(category, slug),
    surface: ENTRY_DETAIL_COMMAND_CENTER_SURFACE,
    host,
  };
}

export function entryDetailDocsAnalyticsEvent(): string {
  return "detail_docs_open";
}

export function entryDetailDocsAnalyticsData(category: string, slug: string, host: string) {
  return {
    entry: entryDetailEntryKey(category, slug),
    surface: ENTRY_DETAIL_COMMAND_CENTER_SURFACE,
    host,
  };
}

export function entryDetailSuggestChangeAnalyticsEvent(): string {
  return "detail_suggest_change_open";
}

export function entryDetailSuggestChangeAnalyticsData(category: string, slug: string) {
  return {
    entry: entryDetailEntryKey(category, slug),
    surface: ENTRY_DETAIL_COMMAND_CENTER_SURFACE,
  };
}

export function entryDetailMobileLlmsAnalyticsData(category: string, slug: string) {
  return {
    entry: entryDetailEntryKey(category, slug),
    link: "llms",
    surface: ENTRY_DETAIL_MOBILE_SURFACE,
  };
}

export function entryDetailPlaybookActionAnalyticsEvent(actionId: string): string {
  return `detail_playbook_${actionId.replace(/-/g, "_")}`;
}

export function entryDetailPlaybookActionAnalyticsData(
  category: string,
  slug: string,
  actionId: string,
  compareCount: number,
) {
  return {
    entry: entryDetailEntryKey(category, slug),
    action: actionId,
    surface: ENTRY_DETAIL_DECISION_PLAYBOOK_SURFACE,
    compareCount,
  };
}
