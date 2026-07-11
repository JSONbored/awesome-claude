import { describe, expect, it } from "vitest";
import {
  ALERTS_DROPDOWN_SURFACE,
  alertsDropdownItemClickAnalyticsData,
  alertsDropdownItemClickAnalyticsEvent,
  alertsDropdownMarkAllReadAnalyticsData,
  alertsDropdownMarkAllReadAnalyticsEvent,
  alertsDropdownOpenAnalyticsData,
  alertsDropdownOpenAnalyticsEvent,
} from "@/lib/alerts-dropdown-cta-events-lib";

describe("alerts dropdown cta events lib", () => {
  it("builds privacy-light alerts dropdown analytics", () => {
    expect(alertsDropdownOpenAnalyticsEvent()).toBe("alerts_dropdown_open");
    expect(alertsDropdownOpenAnalyticsData(3, 12, 5, 2)).toEqual({
      surface: ALERTS_DROPDOWN_SURFACE,
      unreadCount: 3,
      alertCount: 12,
      watchCount: 5,
      savedSearchAlertCount: 2,
    });
    expect(alertsDropdownMarkAllReadAnalyticsEvent()).toBe(
      "alerts_dropdown_mark_all_read",
    );
    expect(alertsDropdownMarkAllReadAnalyticsData(4)).toEqual({
      surface: ALERTS_DROPDOWN_SURFACE,
      unreadCount: 4,
    });
    expect(alertsDropdownItemClickAnalyticsEvent()).toBe(
      "alerts_dropdown_item_click",
    );
    expect(
      alertsDropdownItemClickAnalyticsData("warning", "Today", "entry", true),
    ).toEqual({
      surface: ALERTS_DROPDOWN_SURFACE,
      severity: "warning",
      bucket: "Today",
      kind: "entry",
      unread: true,
    });
  });
});
