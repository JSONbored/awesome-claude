import { describe, expect, it } from "vitest";
import {
  browseCompareOpenAnalyticsData,
  comparisonTrayClearAnalyticsData,
  comparisonTrayClearAnalyticsEvent,
  comparisonTrayFullCompareAnalyticsData,
  comparisonTrayQuickCompareAnalyticsData,
  comparisonTrayRemoveAnalyticsData,
  comparisonTrayRemoveAnalyticsEvent,
  entryDetailCompareAnalyticsData,
  entryDetailCompareAnalyticsEvent,
  entryDetailCompareFullAnalyticsData,
  entryDetailCompareFullAnalyticsEvent,
  entryDetailMobileCompareAnalyticsData,
  entryDetailMobileCompareAnalyticsEvent,
  entryDetailCopyAnalyticsData,
  entryDetailCopyAnalyticsEvent,
  entryDetailCopyIntentType,
  entryDetailIntegrationAnalyticsData,
  entryDetailIntegrationAnalyticsEvent,
  entryDetailMobileActionAnalyticsData,
  entryDetailMobileActionAnalyticsEvent,
  entryDetailMobileCopyIntentType,
  entryDetailMobileLinkIntentType,
  entryDetailMobileLlmsAnalyticsData,
  entryDetailPlaybookActionAnalyticsData,
  entryDetailPlaybookActionAnalyticsEvent,
} from "@/lib/entry-detail-cta-events-lib";

describe("entry detail cta events lib", () => {
  it("maps copy tabs to intent types without sensitive payloads", () => {
    expect(entryDetailCopyIntentType("install")).toBe("install");
    expect(entryDetailCopyIntentType("config")).toBe("copy");
    expect(entryDetailCopyIntentType("full")).toBe("copy");
  });

  it("builds analytics event names and data for detail CTAs", () => {
    expect(entryDetailCopyAnalyticsEvent("install")).toBe(
      "detail_copy_install",
    );
    expect(entryDetailCopyAnalyticsData("mcp", "browser")).toEqual({
      entry: "mcp/browser",
      surface: "detail-command-center",
    });
    expect(entryDetailCompareAnalyticsEvent(true)).toBe("detail_compare_add");
    expect(entryDetailCompareAnalyticsEvent(false)).toBe(
      "detail_compare_remove",
    );
    expect(entryDetailCompareAnalyticsData("skills", "demo")).toEqual({
      entry: "skills/demo",
      surface: "detail-compare",
    });
    expect(entryDetailCompareFullAnalyticsEvent()).toBe(
      "detail_compare_open_full",
    );
    expect(entryDetailCompareFullAnalyticsData("skills", "demo", 3)).toEqual({
      entry: "skills/demo",
      surface: "detail-compare",
      compareCount: 3,
    });
    expect(entryDetailMobileCompareAnalyticsEvent(true)).toBe(
      "detail_mobile_compare_add",
    );
    expect(entryDetailMobileCompareAnalyticsEvent(false)).toBe(
      "detail_mobile_compare_remove",
    );
    expect(entryDetailMobileCompareAnalyticsData("skills", "demo", 2)).toEqual({
      entry: "skills/demo",
      surface: "detail-mobile",
      compareCount: 2,
    });
  });

  it("builds browse and compare tray analytics data without entry payloads", () => {
    expect(browseCompareOpenAnalyticsData(3)).toEqual({
      count: 3,
      surface: "browse-compare",
    });
    expect(comparisonTrayQuickCompareAnalyticsData(2)).toEqual({
      count: 2,
      surface: "compare-tray",
    });
    expect(comparisonTrayFullCompareAnalyticsData(4)).toEqual({
      count: 4,
      surface: "compare-tray",
    });
    expect(comparisonTrayRemoveAnalyticsEvent()).toBe("compare_tray_remove");
    expect(comparisonTrayRemoveAnalyticsData("mcp", "browser", 1)).toEqual({
      entry: "mcp/browser",
      surface: "compare-tray",
      count: 1,
    });
    expect(comparisonTrayClearAnalyticsEvent()).toBe("compare_tray_clear");
    expect(comparisonTrayClearAnalyticsData(3)).toEqual({
      count: 3,
      surface: "compare-tray",
    });
  });

  it("builds mobile action analytics and intent helpers", () => {
    expect(entryDetailMobileActionAnalyticsEvent("copy")).toBe(
      "detail_mobile_copy",
    );
    expect(
      entryDetailMobileActionAnalyticsData("mcp", "browser", "install"),
    ).toEqual({
      entry: "mcp/browser",
      action: "install",
      surface: "detail-mobile",
    });
    expect(entryDetailMobileCopyIntentType({ installCommand: "npm i x" })).toBe(
      "install",
    );
    expect(entryDetailMobileCopyIntentType({})).toBe("copy");
    expect(entryDetailMobileLinkIntentType("source")).toBe("open");
    expect(entryDetailMobileLinkIntentType("llms")).toBe("open");
    expect(entryDetailMobileLinkIntentType("claim")).toBeNull();
  });

  it("builds integration CTA analytics without sensitive payloads", () => {
    expect(entryDetailIntegrationAnalyticsEvent("api-json")).toBe(
      "detail_integration_api_json",
    );
    expect(
      entryDetailIntegrationAnalyticsData("mcp", "browser", "llms"),
    ).toEqual({
      entry: "mcp/browser",
      link: "llms",
      surface: "detail-command-center",
    });
    expect(entryDetailMobileLlmsAnalyticsData("skills", "demo")).toEqual({
      entry: "skills/demo",
      link: "llms",
      surface: "detail-mobile",
    });
  });

  it("builds decision playbook action analytics on a dedicated surface", () => {
    expect(entryDetailPlaybookActionAnalyticsEvent("open-full-compare")).toBe(
      "detail_playbook_open_full_compare",
    );
    expect(
      entryDetailPlaybookActionAnalyticsData(
        "skills",
        "demo",
        "compare-toggle",
        2,
      ),
    ).toEqual({
      entry: "skills/demo",
      action: "compare-toggle",
      surface: "detail-decision-playbook",
      compareCount: 2,
    });
  });
});
