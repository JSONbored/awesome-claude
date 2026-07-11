import { describe, expect, it } from "vitest";
import {
  COMPARE_PAGE_EMPTY_SURFACE,
  comparePageEmptyEgressAnalyticsData,
  comparePageEmptyEgressAnalyticsEvent,
} from "@/lib/compare-page-empty-egress-cta-events-lib";

describe("compare page empty egress cta events lib", () => {
  it("builds privacy-light compare page empty egress analytics", () => {
    expect(comparePageEmptyEgressAnalyticsEvent()).toBe(
      "compare_page_empty_egress_click",
    );
    expect(
      comparePageEmptyEgressAnalyticsData("curated-page", 3, true),
    ).toEqual({
      surface: COMPARE_PAGE_EMPTY_SURFACE,
      linkKind: "curated-page",
      refCount: 3,
      hasInteractive: true,
    });
    expect(comparePageEmptyEgressAnalyticsData("interactive", 3, true)).toEqual(
      {
        surface: COMPARE_PAGE_EMPTY_SURFACE,
        linkKind: "interactive",
        refCount: 3,
        hasInteractive: true,
      },
    );
  });
});
