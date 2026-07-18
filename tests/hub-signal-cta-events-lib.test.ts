import { describe, expect, it } from "vitest";
import {
  hubSignalStatAnalyticsData,
  hubSignalStatAnalyticsEvent,
  hubSignalStatDestination,
  hubStatBrowseSearch,
} from "@/lib/hub-signal-cta-events-lib";

describe("hub signal cta events lib", () => {
  it("builds privacy-light hub signal analytics and browse search", () => {
    expect(hubSignalStatAnalyticsEvent()).toBe("hub_signal_stat_click");
    expect(
      hubSignalStatAnalyticsData("category-hub", "trusted", 12, 40),
    ).toEqual({
      surface: "category-hub",
      statKey: "trusted",
      count: 12,
      pct: 40,
    });
    expect(
      hubSignalStatAnalyticsData("platform-category", "reviewed", 4, 20),
    ).toEqual({
      surface: "platform-category",
      statKey: "reviewed",
      count: 4,
      pct: 20,
    });
    expect(hubStatBrowseSearch("trusted", { category: "mcp" })).toEqual({
      category: "mcp",
      trust: "trusted",
    });
    expect(hubStatBrowseSearch("sourced", { platform: "claude-code" })).toEqual(
      {
        platform: "claude-code",
        signal: "source-backed",
      },
    );
    expect(hubStatBrowseSearch("safety", { q: "postgres" })).toEqual({
      q: "postgres",
      signal: "safety-notes",
    });
    expect(hubStatBrowseSearch("privacy", { category: "hooks" })).toEqual({
      category: "hooks",
      signal: "privacy-notes",
    });
    expect(hubStatBrowseSearch("reviewed")).toEqual({
      signal: "reviewed",
    });
    expect(hubStatBrowseSearch("unknown")).toBeNull();
  });

  it("maps hub signal stat keys to browse destinations", () => {
    expect(hubSignalStatDestination("trusted", { category: "mcp" })).toEqual({
      to: "/browse",
      search: { category: "mcp", trust: "trusted" },
    });
    expect(
      hubSignalStatDestination("sourced", { platform: "claude-code" }),
    ).toEqual({
      to: "/browse",
      search: { platform: "claude-code", signal: "source-backed" },
    });
    expect(hubSignalStatDestination("safety", { q: "postgres" })).toEqual({
      to: "/browse",
      search: { q: "postgres", signal: "safety-notes" },
    });
    expect(hubSignalStatDestination("privacy", { category: "hooks" })).toEqual({
      to: "/browse",
      search: { category: "hooks", signal: "privacy-notes" },
    });
    expect(hubSignalStatDestination("reviewed")).toEqual({
      to: "/browse",
      search: { signal: "reviewed" },
    });
    expect(hubSignalStatDestination("unknown")).toBeNull();
    expect(hubSignalStatDestination("")).toBeNull();
  });
});
