import { describe, expect, it } from "vitest";
import {
  SUBSCRIPTIONS_PAGE_SURFACE,
  subscriptionsPageConfirmAnalyticsData,
  subscriptionsPageConfirmAnalyticsEvent,
  subscriptionsPageEgressAnalyticsData,
  subscriptionsPageEgressAnalyticsEvent,
  subscriptionsPageManageAlertsAnalyticsData,
  subscriptionsPageManageAlertsAnalyticsEvent,
  subscriptionsPageRemoveIntentAnalyticsData,
  subscriptionsPageRemoveIntentAnalyticsEvent,
  subscriptionsPageRenameAnalyticsData,
  subscriptionsPageRenameAnalyticsEvent,
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

  it("builds subscriptions rename and remove-intent analytics", () => {
    expect(subscriptionsPageRenameAnalyticsEvent()).toBe(
      "subscriptions_page_rename_click",
    );
    expect(subscriptionsPageRenameAnalyticsData("start", 3)).toEqual({
      surface: SUBSCRIPTIONS_PAGE_SURFACE,
      phase: "start",
      followCount: 3,
    });
    expect(subscriptionsPageRenameAnalyticsData("save", 3)).toEqual({
      surface: SUBSCRIPTIONS_PAGE_SURFACE,
      phase: "save",
      followCount: 3,
    });
    expect(subscriptionsPageRemoveIntentAnalyticsEvent()).toBe(
      "subscriptions_page_remove_intent_click",
    );
    expect(subscriptionsPageRemoveIntentAnalyticsData("follow", 4)).toEqual({
      surface: SUBSCRIPTIONS_PAGE_SURFACE,
      kind: "follow",
      itemCount: 4,
    });
    expect(subscriptionsPageRemoveIntentAnalyticsData("segment", 2)).toEqual({
      surface: SUBSCRIPTIONS_PAGE_SURFACE,
      kind: "segment",
      itemCount: 2,
    });
  });
});
