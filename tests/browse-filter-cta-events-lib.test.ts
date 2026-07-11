import { describe, expect, it } from "vitest";
import {
  BROWSE_FILTER_SURFACE,
  browseFilterClearAllAnalyticsData,
  browseFilterClearAllAnalyticsEvent,
  browseFilterSelectAnalyticsData,
  browseFilterSelectAnalyticsEvent,
  browseSortSelectAnalyticsData,
  browseSortSelectAnalyticsEvent,
  browseViewSelectAnalyticsData,
  browseViewSelectAnalyticsEvent,
} from "@/lib/browse-filter-cta-events-lib";

describe("browse filter cta events lib", () => {
  it("builds privacy-light browse filter analytics", () => {
    expect(browseFilterSelectAnalyticsEvent()).toBe("browse_filter_select");
    expect(
      browseFilterSelectAnalyticsData("trust", "verified", true, 42),
    ).toEqual({
      surface: BROWSE_FILTER_SURFACE,
      axis: "trust",
      value: "verified",
      active: true,
      resultCount: 42,
    });
    expect(browseFilterClearAllAnalyticsEvent()).toBe(
      "browse_filter_clear_all",
    );
    expect(browseFilterClearAllAnalyticsData(3, 1200)).toEqual({
      surface: BROWSE_FILTER_SURFACE,
      activeCount: 3,
      resultCount: 1200,
    });
    expect(browseSortSelectAnalyticsEvent()).toBe("browse_sort_select");
    expect(browseSortSelectAnalyticsData("newest", 18)).toEqual({
      surface: BROWSE_FILTER_SURFACE,
      sort: "newest",
      resultCount: 18,
    });
    expect(browseViewSelectAnalyticsEvent()).toBe("browse_view_select");
    expect(browseViewSelectAnalyticsData("grid")).toEqual({
      surface: BROWSE_FILTER_SURFACE,
      view: "grid",
    });
  });
});
