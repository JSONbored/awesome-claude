import { describe, expect, it } from "vitest";
import {
  FILTER_SUMMARY_BAR_SURFACE,
  filterSummaryClearAllAnalyticsData,
  filterSummaryClearAllAnalyticsEvent,
  filterSummaryClearAnalyticsData,
  filterSummaryClearAnalyticsEvent,
} from "@/lib/filter-summary-bar-cta-events-lib";

describe("filter summary bar cta events lib", () => {
  it("builds filter summary bar navigation analytics", () => {
    expect(filterSummaryClearAnalyticsEvent()).toBe(
      "filter_summary_clear_click",
    );
    expect(filterSummaryClearAnalyticsData("platform", 3)).toEqual({
      surface: FILTER_SUMMARY_BAR_SURFACE,
      filterKey: "platform",
      activeCount: 3,
    });
    expect(filterSummaryClearAllAnalyticsEvent()).toBe(
      "filter_summary_clear_all_click",
    );
    expect(filterSummaryClearAllAnalyticsData(4)).toEqual({
      surface: FILTER_SUMMARY_BAR_SURFACE,
      activeCount: 4,
    });
  });
});
