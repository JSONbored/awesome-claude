import { describe, expect, it } from "vitest";
import {
  CONTRIBUTORS_INDEX_SURFACE,
  contributorsIndexProfileAnalyticsData,
  contributorsIndexProfileAnalyticsEvent,
  contributorsIndexSubmitAnalyticsData,
  contributorsIndexSubmitAnalyticsEvent,
} from "@/lib/contributors-index-cta-events-lib";

describe("contributors index cta events lib", () => {
  it("builds contributors index profile card analytics", () => {
    expect(contributorsIndexProfileAnalyticsEvent()).toBe(
      "contributors_index_profile_click",
    );
    expect(contributorsIndexProfileAnalyticsData("alice", 12, 0, 24)).toEqual({
      surface: CONTRIBUTORS_INDEX_SURFACE,
      contributorSlug: "alice",
      acceptedCount: 12,
      rowIndex: 0,
      contributorCount: 24,
    });
  });

  it("builds contributors index submit CTA analytics", () => {
    expect(contributorsIndexSubmitAnalyticsEvent()).toBe(
      "contributors_index_submit_click",
    );
    expect(contributorsIndexSubmitAnalyticsData(24, 310)).toEqual({
      surface: CONTRIBUTORS_INDEX_SURFACE,
      contributorCount: 24,
      totalAccepted: 310,
    });
  });
});
