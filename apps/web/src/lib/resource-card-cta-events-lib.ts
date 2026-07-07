/**
 * Pure resource card CTA analytics and intent-event helpers.
 *
 * Maps browse card actions to privacy-light event names without embedding
 * install payloads or other sensitive fields.
 */

import type { Entry } from "@/types/registry";
import type { IntentEventClientType } from "@/lib/intent-event-client-lib";

export const RESOURCE_CARD_SURFACE = "browse-card";

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
