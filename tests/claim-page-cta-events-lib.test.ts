import { describe, expect, it } from "vitest";
import {
  CLAIM_PAGE_SURFACE,
  claimPageChangeListingAnalyticsData,
  claimPageChangeListingAnalyticsEvent,
  claimPageEgressAnalyticsData,
  claimPageEgressAnalyticsEvent,
  claimPageEgressDestination,
  claimPageEntrySelectAnalyticsData,
  claimPageEntrySelectAnalyticsEvent,
  claimPageFileAnalyticsData,
  claimPageFileAnalyticsEvent,
  claimPageResetAnalyticsData,
  claimPageResetAnalyticsEvent,
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

  it("builds claim page reset, change, egress, and file analytics", () => {
    expect(claimPageChangeListingAnalyticsEvent()).toBe(
      "claim_page_change_listing_click",
    );
    expect(claimPageChangeListingAnalyticsData("agents", "demo")).toEqual({
      surface: CLAIM_PAGE_SURFACE,
      entry: "agents/demo",
    });
    expect(claimPageResetAnalyticsEvent()).toBe("claim_page_reset_click");
    expect(claimPageResetAnalyticsData()).toEqual({
      surface: CLAIM_PAGE_SURFACE,
    });
    expect(claimPageEgressAnalyticsEvent()).toBe("claim_page_egress_click");
    expect(claimPageEgressAnalyticsData("submit")).toEqual({
      surface: CLAIM_PAGE_SURFACE,
      destination: "submit",
    });
    expect(claimPageEgressDestination("submit")).toEqual({ to: "/submit" });
    expect(claimPageEgressDestination("unknown")).toBeNull();
    expect(claimPageFileAnalyticsEvent()).toBe("claim_page_file_click");
    expect(claimPageFileAnalyticsData("maintain", "success", 4, 3)).toEqual({
      surface: CLAIM_PAGE_SURFACE,
      type: "maintain",
      outcome: "success",
      proofFieldCount: 4,
      filledProofCount: 3,
    });
  });
});
