import { describe, expect, it } from "vitest";
import {
  hubSignalStatAnalyticsData,
  hubSignalStatAnalyticsEvent,
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
});
