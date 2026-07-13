/**
 * Pure entry safety-surface panel analytics helpers.
 *
 * Maps kind-chip filter interactions to privacy-light event names without
 * embedding note text or other free-form safety/privacy copy.
 */

import type { SafetyRiskKind } from "@/lib/entry-safety-surface-lib";

export const ENTRY_SAFETY_SURFACE_PANEL_SURFACE = "detail-safety-surface";

export function entrySafetySurfaceEntryKey(category: string, slug: string): string {
  return `${category}/${slug}`;
}

export function entrySafetySurfaceKindSelectAnalyticsEvent(): string {
  return "detail_safety_surface_kind_select";
}

export function entrySafetySurfaceKindSelectAnalyticsData(
  category: string,
  slug: string,
  kind: SafetyRiskKind,
  active: boolean,
  itemCount: number,
  coverageCount: number,
  sensitive: boolean,
) {
  return {
    entry: entrySafetySurfaceEntryKey(category, slug),
    surface: ENTRY_SAFETY_SURFACE_PANEL_SURFACE,
    kind,
    active,
    itemCount,
    coverageCount,
    sensitive,
  };
}
