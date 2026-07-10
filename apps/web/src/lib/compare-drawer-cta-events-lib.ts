/**
 * Pure compare drawer CTA analytics helpers.
 *
 * Maps drawer-level actions to privacy-light event names without embedding
 * entry payloads or other sensitive fields.
 */

import { COMPARE_DRAWER_SURFACE } from "@/lib/compare-drawer-actions-lib";

export { COMPARE_DRAWER_SURFACE };

export function compareDrawerClearAnalyticsEvent(): string {
  return "compare_drawer_clear";
}

export function compareDrawerClearAnalyticsData(count: number) {
  return {
    count,
    surface: COMPARE_DRAWER_SURFACE,
  };
}

export function compareDrawerUndoRestoreAnalyticsEvent(): string {
  return "compare_drawer_undo_restore";
}

export function compareDrawerUndoRestoreAnalyticsData(count: number) {
  return {
    count,
    surface: COMPARE_DRAWER_SURFACE,
  };
}

export function compareDrawerSourceAnalyticsEvent(): string {
  return "compare_drawer_source_open";
}

export function compareDrawerSourceAnalyticsData(category: string, slug: string, host: string) {
  return {
    entry: `${category}/${slug}`,
    surface: COMPARE_DRAWER_SURFACE,
    host,
  };
}

export function compareDrawerShareLinkCopyAnalyticsEvent(): string {
  return "compare_drawer_share_link_copy";
}

export function compareDrawerShareLinkCopyAnalyticsData(compareCount: number) {
  return {
    surface: COMPARE_DRAWER_SURFACE,
    compareCount,
  };
}
