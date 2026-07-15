import { describe, expect, it } from "vitest";
import {
  CLAIM_PAGE_SURFACE,
  claimPageEntrySelectAnalyticsData,
  claimPageEntrySelectAnalyticsEvent,
  claimPageSubmitAnalyticsData,
  claimPageSubmitAnalyticsEvent,
  claimPageTypeSelectAnalyticsData,
  claimPageTypeSelectAnalyticsEvent,
} from "@/lib/claim-page-cta-events-lib";

describe("claim page cta events lib", () => {
  it("builds claim page navigation analytics", () => {
    expect(claimPageSubmitAnalyticsEvent()).toBe("claim_page_submit_click");
    expect(claimPageSubmitAnalyticsData()).toEqual({
      surface: CLAIM_PAGE_SURFACE,
    });
    expect(claimPageTypeSelectAnalyticsEvent()).toBe("claim_page_type_select");
    expect(claimPageTypeSelectAnalyticsData("correct")).toEqual({
      surface: CLAIM_PAGE_SURFACE,
      type: "correct",
    });
    expect(claimPageEntrySelectAnalyticsEvent()).toBe(
      "claim_page_entry_select",
    );
    expect(claimPageEntrySelectAnalyticsData("mcp", "browser", 1, 6)).toEqual({
      surface: CLAIM_PAGE_SURFACE,
      entry: "mcp/browser",
      rowIndex: 1,
      resultCount: 6,
    });
  });
});
