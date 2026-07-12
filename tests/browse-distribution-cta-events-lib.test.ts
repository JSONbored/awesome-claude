import { describe, expect, it } from "vitest";
import {
  BROWSE_FRESHNESS_DISTRIBUTION_SURFACE,
  BROWSE_THEME_DISTRIBUTION_SURFACE,
  browseFreshnessStaleEntryAnalyticsData,
  browseFreshnessStaleEntryAnalyticsEvent,
  browseThemeDistributionSelectAnalyticsData,
  browseThemeDistributionSelectAnalyticsEvent,
  parseBrowseFreshnessEntryRef,
} from "@/lib/browse-distribution-cta-events-lib";

describe("browse distribution cta events lib", () => {
  it("builds privacy-light browse distribution analytics payloads", () => {
    expect(browseThemeDistributionSelectAnalyticsEvent()).toBe(
      "browse_theme_distribution_select",
    );
    expect(
      browseThemeDistributionSelectAnalyticsData(
        "memory",
        42,
        1,
        "focused",
        24,
      ),
    ).toEqual({
      surface: BROWSE_THEME_DISTRIBUTION_SURFACE,
      tagSlug: "memory",
      percent: 42,
      rank: 1,
      concentration: "focused",
      scannedCount: 24,
    });
    expect(browseFreshnessStaleEntryAnalyticsEvent()).toBe(
      "browse_freshness_stale_entry_click",
    );
    expect(
      browseFreshnessStaleEntryAnalyticsData("mcp/browser", 210, false),
    ).toEqual({
      surface: BROWSE_FRESHNESS_DISTRIBUTION_SURFACE,
      entry: "mcp/browser",
      ageDays: 210,
      verified: false,
    });
    expect(parseBrowseFreshnessEntryRef("mcp/browser")).toEqual({
      category: "mcp",
      slug: "browser",
    });
    expect(parseBrowseFreshnessEntryRef("invalid")).toBeNull();
  });
});
