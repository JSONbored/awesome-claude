import { describe, expect, it } from "vitest";
import {
  COMMAND_BAR_SURFACE,
  commandBarActionSelectAnalyticsData,
  commandBarActionSelectAnalyticsEvent,
  commandBarResultSelectAnalyticsData,
  commandBarResultSelectAnalyticsEvent,
  commandBarScopeSelectAnalyticsData,
  commandBarScopeSelectAnalyticsEvent,
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
});
