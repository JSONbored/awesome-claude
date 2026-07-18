import { describe, expect, it } from "vitest";
import {
  COMPARE_PAGE_EMPTY_SURFACE,
  comparePageEmptyEgressAnalyticsData,
  comparePageEmptyEgressAnalyticsEvent,
  comparePageEmptyEgressDestination,
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
    expect(comparePageEmptyEgressAnalyticsData("browse-directory")).toEqual({
      surface: COMPARE_PAGE_EMPTY_SURFACE,
      linkKind: "browse-directory",
    });
  });

  it("maps compare page empty egress destinations", () => {
    expect(comparePageEmptyEgressDestination("browse-directory")).toEqual({
      to: "/browse",
    });
    expect(
      comparePageEmptyEgressDestination("curated-page", "top-mcp"),
    ).toEqual({
      to: "/compare/$slug",
      params: { slug: "top-mcp" },
    });
    expect(comparePageEmptyEgressDestination("curated-page", "")).toBeNull();
    expect(
      comparePageEmptyEgressDestination("interactive", "mcp/a,mcp/b"),
    ).toEqual({
      to: "/compare",
      search: { ids: "mcp/a,mcp/b" },
    });
    expect(comparePageEmptyEgressDestination("interactive", "  ")).toBeNull();
    expect(comparePageEmptyEgressDestination("unknown")).toBeNull();
  });
});
