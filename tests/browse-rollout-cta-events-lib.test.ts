import { describe, expect, it } from "vitest";
import {
  BROWSE_ROLLOUT_SIGNALS_SURFACE,
  browseRolloutFlaggedEntryAnalyticsData,
  browseRolloutFlaggedEntryAnalyticsEvent,
  browseRolloutSignalRowAnalyticsData,
  browseRolloutSignalRowAnalyticsEvent,
  browseRolloutSignalSearch,
  parseBrowseRolloutEntryRef,
} from "@/lib/browse-rollout-cta-events-lib";

describe("browse rollout cta events lib", () => {
  it("builds privacy-light browse rollout analytics payloads", () => {
    expect(browseRolloutFlaggedEntryAnalyticsEvent()).toBe(
      "browse_rollout_flagged_entry_click",
    );
    expect(
      browseRolloutFlaggedEntryAnalyticsData("mcp/browser", 2, 33),
    ).toEqual({
      surface: BROWSE_ROLLOUT_SIGNALS_SURFACE,
      entry: "mcp/browser",
      missingRequiredCount: 2,
      signalCoveragePercent: 33,
    });
    expect(parseBrowseRolloutEntryRef("mcp/browser")).toEqual({
      category: "mcp",
      slug: "browser",
    });
    expect(parseBrowseRolloutEntryRef("invalid")).toBeNull();
  });

  it("maps rollout rows to browse signal search patches", () => {
    expect(browseRolloutSignalRowAnalyticsEvent()).toBe(
      "browse_rollout_signal_row_click",
    );
    expect(
      browseRolloutSignalRowAnalyticsData("safety", "watch", 40, 12),
    ).toEqual({
      surface: BROWSE_ROLLOUT_SIGNALS_SURFACE,
      signalId: "safety",
      tone: "watch",
      coveragePercent: 40,
      scannedCount: 12,
    });
    expect(browseRolloutSignalSearch("safety")).toEqual({
      signal: "safety-notes",
    });
    expect(browseRolloutSignalSearch("source")).toEqual({
      signal: "source-backed",
    });
    expect(browseRolloutSignalSearch("reviewed")).toEqual({
      signal: "reviewed",
    });
    expect(browseRolloutSignalSearch("privacy")).toEqual({
      signal: "privacy-notes",
    });
    expect(browseRolloutSignalSearch("package")).toEqual({
      signal: "trusted-package",
    });
    expect(browseRolloutSignalSearch("install")).toBeNull();
  });
});
