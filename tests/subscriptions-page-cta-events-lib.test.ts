import { describe, expect, it } from "vitest";
import {
  SUBSCRIPTIONS_PAGE_SURFACE,
  subscriptionsPageConfirmAnalyticsData,
  subscriptionsPageConfirmAnalyticsEvent,
  subscriptionsPageEgressAnalyticsData,
  subscriptionsPageEgressAnalyticsEvent,
  subscriptionsPageManageAlertsAnalyticsData,
  subscriptionsPageManageAlertsAnalyticsEvent,
} from "@/lib/subscriptions-page-cta-events-lib";

describe("subscriptions page cta events lib", () => {
  it("builds subscriptions page navigation analytics", () => {
    expect(subscriptionsPageEgressAnalyticsEvent()).toBe(
      "subscriptions_page_egress_click",
    );
    expect(subscriptionsPageEgressAnalyticsData("feeds")).toEqual({
      surface: SUBSCRIPTIONS_PAGE_SURFACE,
      destination: "feeds",
    });
    expect(subscriptionsPageEgressAnalyticsData("browse")).toEqual({
      surface: SUBSCRIPTIONS_PAGE_SURFACE,
      destination: "browse",
    });
    expect(subscriptionsPageManageAlertsAnalyticsEvent()).toBe(
      "subscriptions_page_manage_alerts_click",
    );
    expect(subscriptionsPageManageAlertsAnalyticsData(2, 5)).toEqual({
      surface: SUBSCRIPTIONS_PAGE_SURFACE,
      alertCount: 2,
      savedCount: 5,
    });
    expect(subscriptionsPageConfirmAnalyticsEvent()).toBe(
      "subscriptions_page_confirm_click",
    );
    expect(subscriptionsPageConfirmAnalyticsData("follow")).toEqual({
      surface: SUBSCRIPTIONS_PAGE_SURFACE,
      kind: "follow",
    });
    expect(subscriptionsPageConfirmAnalyticsData("segment")).toEqual({
      surface: SUBSCRIPTIONS_PAGE_SURFACE,
      kind: "segment",
    });
  });
});
