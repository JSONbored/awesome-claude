import { describe, expect, it } from "vitest";
import {
  COMMAND_BAR_SURFACE,
  commandBarActionDestination,
  commandBarActionSelectAnalyticsData,
  commandBarActionSelectAnalyticsEvent,
  commandBarEntryDestination,
  commandBarResultSelectAnalyticsData,
  commandBarResultSelectAnalyticsEvent,
  commandBarScopeSelectAnalyticsData,
  commandBarScopeSelectAnalyticsEvent,
  commandBarSearchDestination,
  commandBarSearchSubmitAnalyticsData,
  commandBarSearchSubmitAnalyticsEvent,
} from "@/lib/command-bar-cta-events-lib";

describe("command bar cta events lib", () => {
  it("builds privacy-light command bar analytics payloads", () => {
    expect(commandBarScopeSelectAnalyticsEvent()).toBe(
      "command_bar_scope_select",
    );
    expect(commandBarScopeSelectAnalyticsData("mcp", 12)).toEqual({
      surface: COMMAND_BAR_SURFACE,
      scopeCategory: "mcp",
      queryLength: 12,
    });
    expect(commandBarScopeSelectAnalyticsData("", 0)).toEqual({
      surface: COMMAND_BAR_SURFACE,
      scopeCategory: "all",
      queryLength: 0,
    });
    expect(commandBarResultSelectAnalyticsEvent()).toBe(
      "command_bar_result_select",
    );
    expect(
      commandBarResultSelectAnalyticsData("skills", "demo", 1, 6, "skills", 8),
    ).toEqual({
      surface: COMMAND_BAR_SURFACE,
      entry: "skills/demo",
      resultIndex: 1,
      resultCount: 6,
      scopeCategory: "skills",
      queryLength: 8,
    });
    expect(commandBarActionSelectAnalyticsEvent()).toBe(
      "command_bar_action_select",
    );
    expect(commandBarActionSelectAnalyticsData("go-browse", 0, 0)).toEqual({
      surface: COMMAND_BAR_SURFACE,
      actionId: "go-browse",
      queryLength: 0,
      resultCount: 0,
    });
    expect(commandBarSearchSubmitAnalyticsEvent()).toBe(
      "command_bar_search_submit",
    );
    expect(commandBarSearchSubmitAnalyticsData(11, 4, "mcp")).toEqual({
      surface: COMMAND_BAR_SURFACE,
      queryLength: 11,
      resultCount: 4,
      scopeCategory: "mcp",
    });
    expect(
      commandBarResultSelectAnalyticsData("skills", "demo", 0, 1, "", 0),
    ).toEqual({
      surface: COMMAND_BAR_SURFACE,
      entry: "skills/demo",
      resultIndex: 0,
      resultCount: 1,
      scopeCategory: "all",
      queryLength: 0,
    });
    expect(commandBarSearchSubmitAnalyticsData(0, 0, "")).toEqual({
      surface: COMMAND_BAR_SURFACE,
      queryLength: 0,
      resultCount: 0,
      scopeCategory: "all",
    });
  });

  it("maps command bar action destinations", () => {
    expect(commandBarActionDestination("go-browse")).toEqual({ to: "/browse" });
    expect(commandBarActionDestination("go-saved")).toEqual({ to: "/browse" });
    expect(commandBarActionDestination("go-trending")).toEqual({
      to: "/trending",
    });
    expect(commandBarActionDestination("go-ecosystem")).toEqual({
      to: "/ecosystem",
    });
    expect(commandBarActionDestination("go-quality")).toEqual({
      to: "/quality",
    });
    expect(commandBarActionDestination("go-best")).toEqual({ to: "/best" });
    expect(commandBarActionDestination("go-submit")).toEqual({ to: "/submit" });
    expect(commandBarActionDestination("go-feeds")).toEqual({ to: "/feeds" });
    expect(commandBarActionDestination("go-subscriptions")).toEqual({
      to: "/subscriptions",
    });
    expect(commandBarActionDestination("toggle-theme")).toBeNull();
    expect(commandBarActionDestination("shortcuts")).toBeNull();
    expect(commandBarActionDestination("")).toBeNull();
    expect(commandBarActionDestination("unknown")).toBeNull();
  });

  it("maps command bar entry destinations", () => {
    expect(commandBarEntryDestination("skills", "demo")).toEqual({
      to: "/entry/$category/$slug",
      params: { category: "skills", slug: "demo" },
    });
    expect(commandBarEntryDestination("", "demo")).toBeNull();
    expect(commandBarEntryDestination("skills", "")).toBeNull();
    expect(commandBarEntryDestination("  ", "demo")).toBeNull();
  });

  it("maps command bar search destinations", () => {
    expect(commandBarSearchDestination("postgres")).toEqual({
      to: "/browse",
      search: { q: "postgres" },
    });
    expect(commandBarSearchDestination("")).toBeNull();
    expect(commandBarSearchDestination("   ")).toBeNull();
  });
});
