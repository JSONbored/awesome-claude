/**
 * Pure resource card CTA analytics and intent-event helpers.
 *
 * Maps browse card actions to privacy-light event names without embedding
 * install payloads or other sensitive fields.
 */

import type { Entry } from "@/types/registry";
import type { IntentEventClientType } from "@/lib/intent-event-client-lib";

export const RESOURCE_CARD_SURFACE = "browse-card";

export type ResourceCardSurface =
  | typeof RESOURCE_CARD_SURFACE
  | "home-recent"
  | "home-popular"
  | "home-newest"
  | "home-compare-rail"
  | "category-hub"
  | "tag-hub"
  | "best-index"
  | "best-collection"
  | "platform-hub"
  | "platform-category"
  | "detail-related"
  | "detail-guides"
  | "browse-grid"
  | "browse-compact"
  | "browse-row";

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

export function resourceCardInstallAnalyticsData(
  category: string,
  slug: string,
  surface: ResourceCardSurface = RESOURCE_CARD_SURFACE,
) {
  return {
    entry: resourceCardEntryKey(category, slug),
    surface,
  };
}

export function resourceCardCompareAnalyticsEvent(adding: boolean): string {
  return adding ? "browse_card_compare_add" : "browse_card_compare_remove";
}

export function resourceCardCompareAnalyticsData(
  category: string,
  slug: string,
  surface: ResourceCardSurface = RESOURCE_CARD_SURFACE,
) {
  return {
    entry: resourceCardEntryKey(category, slug),
    surface,
  };
}

export function resourceCardCompareToastOpenAnalyticsEvent(): string {
  return "browse_card_compare_toast_open";
}

export function resourceCardCompareToastOpenAnalyticsData(
  category: string,
  slug: string,
  compareCount: number,
  surface: ResourceCardSurface = RESOURCE_CARD_SURFACE,
) {
  return {
    entry: resourceCardEntryKey(category, slug),
    surface,
    compareCount,
  };
}

export function resourceCardSourceAnalyticsEvent(): string {
  return "browse_card_source_open";
}

export function resourceCardSourceAnalyticsData(
  category: string,
  slug: string,
  host: string,
  surface: ResourceCardSurface = RESOURCE_CARD_SURFACE,
) {
  return {
    entry: resourceCardEntryKey(category, slug),
    surface,
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
  surface: ResourceCardSurface = RESOURCE_CARD_SURFACE,
) {
  return {
    entry: resourceCardEntryKey(category, slug),
    surface,
    variant,
    rank,
    compareCount,
  };
}

export function resourceCardCategoryBrowseAnalyticsEvent(): string {
  return "browse_card_category_click";
}

export function resourceCardCategoryBrowseAnalyticsData(
  category: string,
  surface: ResourceCardSurface = RESOURCE_CARD_SURFACE,
) {
  return {
    surface,
    category,
  };
}

export type ResourceCardBadgeKind = "source" | "install-risk" | "notes" | "platform" | "category";

/** Resolve which secondary badge kinds a card variant can expose as browse egress. */
export function resourceCardBadgeKinds(variant: string): ResourceCardBadgeKind[] {
  switch (variant) {
    case "grid":
      return ["category", "source", "install-risk", "notes"];
    case "row":
      return ["category", "source", "install-risk", "platform", "notes"];
    case "compact":
      return ["category", "source"];
    default:
      return [];
  }
}

export function resourceCardTrustHintAnalyticsEvent(): string {
  return "browse_card_trust_hint_click";
}

export function resourceCardTrustHintAnalyticsData(
  category: string,
  slug: string,
  kind: string,
  inCompareTray: boolean,
  compareCount: number,
  surface: ResourceCardSurface = RESOURCE_CARD_SURFACE,
) {
  return {
    entry: resourceCardEntryKey(category, slug),
    surface,
    kind,
    inCompareTray,
    compareCount,
  };
}
