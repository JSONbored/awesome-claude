import { describe, expect, it } from "vitest";
import {
  ENTRY_DETAIL_COMPARE_EGRESS_SURFACE_COMPARE,
  ENTRY_DETAIL_COMPARE_EGRESS_SURFACE_FEATURED,
  entryDetailCompareEgressAnalyticsData,
  entryDetailCompareEgressAnalyticsEvent,
  entryDetailCompareEgressDestination,
  entryDetailCompareEgressEntryKey,
} from "@/lib/entry-detail-compare-egress-cta-events-lib";

describe("entry detail compare egress cta events lib", () => {
  it("builds privacy-light detail compare egress analytics", () => {
    expect(entryDetailCompareEgressAnalyticsEvent()).toBe(
      "detail_compare_egress_click",
    );
    expect(entryDetailCompareEgressEntryKey("mcp", "browser")).toBe(
      "mcp/browser",
    );
    expect(
      entryDetailCompareEgressAnalyticsData(
        "skills",
        "code-review",
        ENTRY_DETAIL_COMPARE_EGRESS_SURFACE_FEATURED,
        "best-list",
        5,
        true,
      ),
    ).toEqual({
      entry: "skills/code-review",
      surface: ENTRY_DETAIL_COMPARE_EGRESS_SURFACE_FEATURED,
      linkKind: "best-list",
      refCount: 5,
      hasInteractive: true,
    });
    expect(
      entryDetailCompareEgressAnalyticsData(
        "mcp",
        "filesystem",
        ENTRY_DETAIL_COMPARE_EGRESS_SURFACE_FEATURED,
        "comparison-interactive",
        3,
        true,
      ),
    ).toEqual({
      entry: "mcp/filesystem",
      surface: ENTRY_DETAIL_COMPARE_EGRESS_SURFACE_FEATURED,
      linkKind: "comparison-interactive",
      refCount: 3,
      hasInteractive: true,
    });
    expect(
      entryDetailCompareEgressAnalyticsData(
        "agents",
        "planner",
        ENTRY_DETAIL_COMPARE_EGRESS_SURFACE_COMPARE,
        "dossier-interactive",
        4,
        true,
      ),
    ).toEqual({
      entry: "agents/planner",
      surface: ENTRY_DETAIL_COMPARE_EGRESS_SURFACE_COMPARE,
      linkKind: "dossier-interactive",
      refCount: 4,
      hasInteractive: true,
    });
  });

  it("maps compare egress destinations", () => {
    expect(entryDetailCompareEgressDestination("best-list", "top-mcp")).toEqual(
      {
        to: "/best/$slug",
        params: { slug: "top-mcp" },
      },
    );
    expect(
      entryDetailCompareEgressDestination("comparison-page", "browser-vs-fs"),
    ).toEqual({
      to: "/compare/$slug",
      params: { slug: "browser-vs-fs" },
    });
    expect(
      entryDetailCompareEgressDestination("dossier-interactive", "a,b,c"),
    ).toEqual({
      to: "/compare",
      search: { ids: "a,b,c" },
    });
    expect(
      entryDetailCompareEgressDestination("best-list-interactive", "x,y"),
    ).toEqual({
      to: "/compare",
      search: { ids: "x,y" },
    });
    expect(
      entryDetailCompareEgressDestination("comparison-interactive", "p,q"),
    ).toEqual({
      to: "/compare",
      search: { ids: "p,q" },
    });
    expect(entryDetailCompareEgressDestination("best-list", "")).toBeNull();
    expect(entryDetailCompareEgressDestination("best-list", "  ")).toBeNull();
    expect(
      entryDetailCompareEgressDestination("unknown", "top-mcp"),
    ).toBeNull();
  });
});
