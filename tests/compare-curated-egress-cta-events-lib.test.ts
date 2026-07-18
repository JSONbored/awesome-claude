import { describe, expect, it } from "vitest";
import {
  COMPARE_CURATED_NOTFOUND_SURFACE,
  COMPARE_CURATED_PAGE_SURFACE,
  compareCuratedEgressAnalyticsData,
  compareCuratedEgressAnalyticsEvent,
  compareCuratedEgressDestination,
  compareCuratedNotFoundEgressAnalyticsData,
  compareCuratedNotFoundEgressAnalyticsEvent,
} from "@/lib/compare-curated-egress-cta-events-lib";

describe("compare curated egress cta events lib", () => {
  it("builds privacy-light compare curated egress analytics", () => {
    expect(compareCuratedEgressAnalyticsEvent()).toBe(
      "compare_curated_egress_click",
    );
    expect(compareCuratedEgressAnalyticsData("interactive", 4, true)).toEqual({
      surface: COMPARE_CURATED_PAGE_SURFACE,
      linkKind: "interactive",
      refCount: 4,
      hasInteractive: true,
    });
    expect(compareCuratedNotFoundEgressAnalyticsEvent()).toBe(
      "compare_curated_notfound_egress_click",
    );
    expect(compareCuratedNotFoundEgressAnalyticsData()).toEqual({
      surface: COMPARE_CURATED_NOTFOUND_SURFACE,
    });
  });

  it("maps compare curated egress destinations", () => {
    expect(compareCuratedEgressDestination("interactive", "a,b")).toEqual({
      to: "/compare",
      search: { ids: "a,b" },
    });
    expect(compareCuratedEgressDestination("interactive", "")).toBeNull();
    expect(compareCuratedEgressDestination("not-found")).toEqual({
      to: "/compare",
    });
    expect(compareCuratedEgressDestination("unknown")).toBeNull();
  });
});
