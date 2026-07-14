/**
 * Pure resource card CTA analytics and intent-event helpers.
 *
 * Maps browse card actions to privacy-light event names without embedding
 * install payloads or other sensitive fields.
 */

import type { Entry } from "@/types/registry";
import type { IntentEventClientType } from "@/lib/intent-event-client-lib";

export const RESOURCE_CARD_SURFACE = "browse-card";

export type ResourceCardVariant = "row" | "grid" | "compact";

export function resourceCardEntryKey(category: string, slug: string): string {
  return `${category}/${slug}`;
}

export function resourceCardInstallIntentType(
  entry: Pick<Entry, "installCommand">,
): IntentEventClientType {
  return entry.installCommand ? "install" : "copy";
}

export function resourceCardInstallAnalyticsEvent(): string {
  return "browse_card_copy_install";
}

export function resourceCardInstallAnalyticsData(category: string, slug: string) {
  return {
    entry: resourceCardEntryKey(category, slug),
    surface: RESOURCE_CARD_SURFACE,
  };
}

export function resourceCardCompareAnalyticsEvent(adding: boolean): string {
  return adding ? "browse_card_compare_add" : "browse_card_compare_remove";
}

export function resourceCardCompareAnalyticsData(category: string, slug: string) {
  return {
    entry: resourceCardEntryKey(category, slug),
    surface: RESOURCE_CARD_SURFACE,
  };
}

export function resourceCardCompareToastOpenAnalyticsEvent(): string {
  return "browse_card_compare_toast_open";
}

export function resourceCardCompareToastOpenAnalyticsData(
  category: string,
  slug: string,
  compareCount: number,
) {
  return {
    entry: resourceCardEntryKey(category, slug),
    surface: RESOURCE_CARD_SURFACE,
    compareCount,
  };
}

export function resourceCardSourceAnalyticsEvent(): string {
  return "browse_card_source_open";
}

export function resourceCardSourceAnalyticsData(category: string, slug: string, host: string) {
  return {
    entry: resourceCardEntryKey(category, slug),
    surface: RESOURCE_CARD_SURFACE,
    host,
  };
}

export function resourceCardEntryAnalyticsEvent(): string {
  return "browse_card_entry_click";
}

export function resourceCardEntryAnalyticsData(
  category: string,
  slug: string,
  variant: ResourceCardVariant,
  rank: number | null,
  compareCount: number,
) {
  return {
    entry: resourceCardEntryKey(category, slug),
    surface: RESOURCE_CARD_SURFACE,
    variant,
    rank,
    compareCount,
  };
}
