import { describe, expect, it } from "vitest";
import {
  BROWSE_ROLLOUT_SIGNALS_SURFACE,
  browseRolloutFlaggedEntryAnalyticsData,
  browseRolloutFlaggedEntryAnalyticsEvent,
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
});
