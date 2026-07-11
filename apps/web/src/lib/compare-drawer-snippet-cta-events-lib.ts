/**
 * Pure compare drawer snippet analytics helpers.
 *
 * Maps header variant picks and per-entry snippet copies to privacy-light
 * event names without embedding snippet payloads.
 */

import type { CopyVariant } from "@/lib/dossier-prefs";
import { COMPARE_DRAWER_SURFACE } from "@/lib/compare-drawer-actions-lib";

export function compareDrawerSnippetVariantAnalyticsEvent(): string {
  return "compare_drawer_snippet_variant_select";
}

export function compareDrawerSnippetVariantAnalyticsData(
  variant: CopyVariant,
  compareCount: number,
) {
  return {
    surface: COMPARE_DRAWER_SURFACE,
    variant,
    compareCount,
  };
}

export function compareDrawerSnippetCopyAnalyticsEvent(variant: CopyVariant): string {
  if (variant === "install") return "compare_copy_install";
  if (variant === "config") return "compare_copy_config";
  return "compare_drawer_snippet_copy";
}

export function compareDrawerSnippetCopyAnalyticsData(
  category: string,
  slug: string,
  variant: CopyVariant,
) {
  return {
    entry: `${category}/${slug}`,
    surface: COMPARE_DRAWER_SURFACE,
    variant,
  };
}
