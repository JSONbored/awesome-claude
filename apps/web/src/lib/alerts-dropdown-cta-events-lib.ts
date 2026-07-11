/**
 * Pure alerts dropdown analytics helpers.
 *
 * Maps alerts popover interactions to privacy-light event names without
 * embedding alert titles, bodies, or destination URLs.
 */

import type { AlertBucket } from "@/lib/alerts-bucket-lib";
import type { AlertSeverity, WatchKind } from "@/lib/watch-types-lib";

export const ALERTS_DROPDOWN_SURFACE = "alerts-dropdown";

export function alertsDropdownOpenAnalyticsEvent(): string {
  return "alerts_dropdown_open";
}

export function alertsDropdownOpenAnalyticsData(
  unreadCount: number,
  alertCount: number,
  watchCount: number,
  savedSearchAlertCount: number,
) {
  return {
    surface: ALERTS_DROPDOWN_SURFACE,
    unreadCount,
    alertCount,
    watchCount,
    savedSearchAlertCount,
  };
}

export function alertsDropdownMarkAllReadAnalyticsEvent(): string {
  return "alerts_dropdown_mark_all_read";
}

export function alertsDropdownMarkAllReadAnalyticsData(unreadCount: number) {
  return {
    surface: ALERTS_DROPDOWN_SURFACE,
    unreadCount,
  };
}

export function alertsDropdownItemClickAnalyticsEvent(): string {
  return "alerts_dropdown_item_click";
}

export function alertsDropdownItemClickAnalyticsData(
  severity: AlertSeverity,
  bucket: AlertBucket,
  kind: WatchKind,
  unread: boolean,
) {
  return {
    surface: ALERTS_DROPDOWN_SURFACE,
    severity,
    bucket,
    kind,
    unread,
  };
}
