import { describe, expect, it } from "vitest";
import {
  HUB_CATEGORY_RANKING_SURFACE,
  HUB_HIGHLIGHTS_SURFACE,
  HUB_TRENDING_PODIUM_SURFACE,
  hubCategoryRankingEntryAnalyticsData,
  hubCategoryRankingEntryAnalyticsEvent,
  hubHighlightBrowseSignal,
  hubHighlightEntryAnalyticsData,
  hubHighlightEntryAnalyticsEvent,
  hubHighlightSourceBrowseAnalyticsData,
  hubHighlightSourceBrowseAnalyticsEvent,
  hubEntryDestination,
  hubTrendingPodiumEntryAnalyticsData,
  hubTrendingPodiumEntryAnalyticsEvent,
} from "@/lib/hub-entry-cta-events-lib";

describe("hub entry cta events lib", () => {
  it("builds privacy-light hub entry egress analytics", () => {
    expect(hubHighlightEntryAnalyticsEvent()).toBe("hub_highlight_entry_click");
    expect(
      hubHighlightEntryAnalyticsData("mcp", "browser", "trusted", 4),
    ).toEqual({
      entry: "mcp/browser",
      surface: HUB_HIGHLIGHTS_SURFACE,
      kind: "trusted",
      highlightCount: 4,
    });
    expect(hubTrendingPodiumEntryAnalyticsEvent()).toBe(
      "hub_trending_podium_entry_click",
    );
    expect(hubTrendingPodiumEntryAnalyticsData("skills", "demo", 1, 3)).toEqual(
      {
        entry: "skills/demo",
        surface: HUB_TRENDING_PODIUM_SURFACE,
        rank: 1,
        podiumCount: 3,
      },
    );
    expect(hubCategoryRankingEntryAnalyticsEvent()).toBe(
      "hub_category_ranking_entry_click",
    );
    expect(
      hubCategoryRankingEntryAnalyticsData("agents", "foo", 2, 12),
    ).toEqual({
      entry: "agents/foo",
      surface: HUB_CATEGORY_RANKING_SURFACE,
      rowIndex: 2,
      rowCount: 12,
    });
  });

  it("builds hub highlight source browse analytics and signal maps", () => {
    expect(hubHighlightSourceBrowseAnalyticsEvent()).toBe(
      "hub_highlight_source_browse_click",
    );
    expect(
      hubHighlightSourceBrowseAnalyticsData("source-backed", "sourced"),
    ).toEqual({
      surface: HUB_HIGHLIGHTS_SURFACE,
      source: "source-backed",
      kind: "sourced",
    });
    expect(hubHighlightBrowseSignal("trusted")).toBe("trusted");
    expect(hubHighlightBrowseSignal("sourced")).toBe("source-backed");
    expect(hubHighlightBrowseSignal("documented")).toBe("safety-notes");
    expect(hubHighlightBrowseSignal("reviewed")).toBe("reviewed");
    expect(hubHighlightBrowseSignal("newest")).toBeNull();
    expect(hubHighlightBrowseSignal("popular")).toBeNull();
    expect(hubHighlightBrowseSignal("unknown")).toBeNull();
  });

  it("maps hub entry refs to entry detail destinations", () => {
    expect(hubEntryDestination("mcp", "browser")).toEqual({
      to: "/entry/$category/$slug",
      params: { category: "mcp", slug: "browser" },
    });
    expect(hubEntryDestination("  skills ", " demo ")).toEqual({
      to: "/entry/$category/$slug",
      params: { category: "skills", slug: "demo" },
    });
    expect(hubEntryDestination("", "demo")).toBeNull();
    expect(hubEntryDestination("mcp", "")).toBeNull();
    expect(hubEntryDestination("   ", "   ")).toBeNull();
  });
});
