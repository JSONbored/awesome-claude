import { describe, expect, it } from "vitest";
import {
  BEST_DETAIL_SURFACE,
  bestDetailCompareAnalyticsData,
  bestDetailCompareAnalyticsEvent,
  bestDetailCompareDestination,
  bestDetailIndexAnalyticsData,
  bestDetailIndexAnalyticsEvent,
  bestDetailIndexDestination,
  bestDetailSubmitAnalyticsData,
  bestDetailSubmitAnalyticsEvent,
  bestDetailSubmitDestination,
} from "@/lib/best-detail-cta-events-lib";

describe("best detail cta events lib", () => {
  it("builds best detail compare egress analytics", () => {
    expect(bestDetailCompareAnalyticsEvent()).toBe("best_detail_compare_click");
    expect(
      bestDetailCompareAnalyticsData("best-mcp-servers", 8, 5, true),
    ).toEqual({
      surface: BEST_DETAIL_SURFACE,
      listSlug: "best-mcp-servers",
      pickCount: 8,
      compareCount: 5,
      hasInteractive: true,
    });
  });

  it("builds best detail submit CTA analytics", () => {
    expect(bestDetailSubmitAnalyticsEvent()).toBe("best_detail_submit_click");
    expect(bestDetailSubmitAnalyticsData("best-skills", 12, "skills")).toEqual({
      surface: BEST_DETAIL_SURFACE,
      listSlug: "best-skills",
      pickCount: 12,
      category: "skills",
    });
  });

  it("builds best detail index back-link analytics", () => {
    expect(bestDetailIndexAnalyticsEvent()).toBe("best_detail_index_click");
    expect(
      bestDetailIndexAnalyticsData("best-agents", 6, "breadcrumb"),
    ).toEqual({
      surface: BEST_DETAIL_SURFACE,
      listSlug: "best-agents",
      pickCount: 6,
      source: "breadcrumb",
    });
    expect(bestDetailIndexAnalyticsData(null, null, "not-found")).toEqual({
      surface: BEST_DETAIL_SURFACE,
      listSlug: null,
      pickCount: null,
      source: "not-found",
    });
  });

  it("maps best detail destinations", () => {
    expect(bestDetailIndexDestination("best")).toEqual({ to: "/best" });
    expect(bestDetailIndexDestination("unknown")).toBeNull();
    expect(bestDetailCompareDestination("a,b,c")).toEqual({
      to: "/compare",
      search: { ids: "a,b,c" },
    });
    expect(bestDetailCompareDestination("")).toBeNull();
    expect(bestDetailCompareDestination("  ")).toBeNull();
    expect(bestDetailSubmitDestination("submit")).toEqual({ to: "/submit" });
    expect(bestDetailSubmitDestination("unknown")).toBeNull();
  });
});
