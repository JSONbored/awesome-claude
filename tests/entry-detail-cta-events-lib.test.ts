import { describe, expect, it } from "vitest";
import {
  browseCompareOpenAnalyticsData,
  comparisonTrayFullCompareAnalyticsData,
  comparisonTrayQuickCompareAnalyticsData,
  entryDetailCompareAnalyticsData,
  entryDetailCompareAnalyticsEvent,
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
});
