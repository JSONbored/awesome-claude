import { describe, expect, it } from "vitest";
import {
  comparePageAddOpenAnalyticsData,
  comparePageAddOpenAnalyticsEvent,
  comparePageAddSelectAnalyticsData,
  comparePageAddSelectAnalyticsEvent,
  comparePageClearAnalyticsData,
  comparePageClearAnalyticsEvent,
  comparePageOpenDossierAnalyticsData,
  comparePageOpenDossierAnalyticsEvent,
  comparePageRemoveAnalyticsData,
  comparePageRemoveAnalyticsEvent,
} from "@/lib/compare-page-selection-cta-events-lib";

describe("compare page selection cta events lib", () => {
  it("builds privacy-light compare page selection analytics", () => {
    expect(comparePageClearAnalyticsEvent()).toBe("compare_page_clear");
    expect(comparePageClearAnalyticsData(3)).toEqual({
      count: 3,
      surface: "compare-page",
    });
    expect(comparePageRemoveAnalyticsEvent()).toBe("compare_page_remove");
    expect(comparePageRemoveAnalyticsData("mcp", "browser", 2)).toEqual({
      entry: "mcp/browser",
      surface: "compare-page",
      count: 2,
    });
    expect(comparePageAddOpenAnalyticsEvent()).toBe("compare_page_add_open");
    expect(comparePageAddOpenAnalyticsData(2)).toEqual({
      count: 2,
      surface: "compare-page",
    });
    expect(comparePageAddSelectAnalyticsEvent()).toBe(
      "compare_page_add_select",
    );
    expect(comparePageAddSelectAnalyticsData("skills", "review", 3)).toEqual({
      entry: "skills/review",
      surface: "compare-page",
      count: 3,
    });
    expect(comparePageOpenDossierAnalyticsEvent()).toBe("compare_open_dossier");
    expect(comparePageOpenDossierAnalyticsData("mcp", "browser")).toEqual({
      entry: "mcp/browser",
      surface: "compare-page",
    });
  });
});
