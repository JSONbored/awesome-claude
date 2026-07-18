import { describe, expect, it } from "vitest";
import {
  BROWSE_FRESHNESS_DISTRIBUTION_SURFACE,
  BROWSE_THEME_DISTRIBUTION_SURFACE,
  browseFreshnessBucketAnalyticsData,
  browseFreshnessBucketAnalyticsEvent,
  browseFreshnessBucketDestination,
  browseFreshnessBucketSignal,
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

  it("maps browse freshness bucket clicks to analytics signals", () => {
    expect(browseFreshnessBucketAnalyticsEvent()).toBe(
      "browse_freshness_bucket_click",
    );
    expect(browseFreshnessBucketAnalyticsData("fresh", 12, 40, 30)).toEqual({
      surface: BROWSE_FRESHNESS_DISTRIBUTION_SURFACE,
      bucketId: "fresh",
      count: 12,
      percent: 40,
      scannedCount: 30,
    });
    expect(browseFreshnessBucketSignal("fresh")).toBe("fresh");
    expect(browseFreshnessBucketSignal("recent")).toBe("recent");
    expect(browseFreshnessBucketSignal("aging")).toBe("aging");
    expect(browseFreshnessBucketSignal("stale")).toBe("stale");
    expect(browseFreshnessBucketSignal("unknown")).toBeNull();
  });

  it("maps browse freshness buckets to browse or quality destinations", () => {
    expect(browseFreshnessBucketDestination("fresh")).toEqual({
      to: "/browse",
      search: { sort: "newest" },
    });
    expect(browseFreshnessBucketDestination("recent")).toEqual({
      to: "/browse",
      search: { sort: "newest" },
    });
    expect(browseFreshnessBucketDestination("aging")).toEqual({
      to: "/quality",
      hash: "freshness",
    });
    expect(browseFreshnessBucketDestination("stale")).toEqual({
      to: "/quality",
      hash: "freshness",
    });
    expect(browseFreshnessBucketDestination("unknown")).toBeNull();
  });
});
