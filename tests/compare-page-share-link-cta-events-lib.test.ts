import { describe, expect, it } from "vitest";
import {
  comparePageShareLinkCopyAnalyticsData,
  comparePageShareLinkCopyAnalyticsEvent,
} from "@/lib/compare-page-share-link-cta-events-lib";

describe("compare page share link cta events lib", () => {
  it("builds privacy-light compare page share link copy analytics", () => {
    expect(comparePageShareLinkCopyAnalyticsEvent()).toBe(
      "compare_page_share_link_copy",
    );
    expect(comparePageShareLinkCopyAnalyticsData(4)).toEqual({
      surface: "compare-page",
      compareCount: 4,
    });
  });
});
