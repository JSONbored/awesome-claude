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
export const ENTRY_DETAIL_MOBILE_SURFACE = "detail-mobile";
export const BROWSE_COMPARE_SURFACE = "browse-compare";
export const COMPARE_TRAY_SURFACE = "compare-tray";

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

export function browseCompareOpenAnalyticsData(selectedCount: number) {
  return {
    count: selectedCount,
    surface: BROWSE_COMPARE_SURFACE,
  };
}

export function comparisonTrayQuickCompareAnalyticsData(count: number) {
  return { count, surface: COMPARE_TRAY_SURFACE };
}

export function comparisonTrayFullCompareAnalyticsData(count: number) {
  return { count, surface: COMPARE_TRAY_SURFACE };
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

export function entryDetailMobileLlmsAnalyticsData(category: string, slug: string) {
  return {
    entry: entryDetailEntryKey(category, slug),
    link: "llms",
    surface: ENTRY_DETAIL_MOBILE_SURFACE,
  };
}
