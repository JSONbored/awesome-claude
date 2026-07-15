import { describe, expect, it } from "vitest";
import {
  REPORT_DOWNLOADS_SURFACE,
  reportDownloadsExportAnalyticsData,
  reportDownloadsExportAnalyticsEvent,
} from "@/lib/report-downloads-cta-events-lib";

describe("report downloads cta events lib", () => {
  it("builds report downloads navigation analytics", () => {
    expect(reportDownloadsExportAnalyticsEvent()).toBe(
      "report_downloads_export_click",
    );
    expect(
      reportDownloadsExportAnalyticsData("state-of-mcp-servers", "json"),
    ).toEqual({
      surface: REPORT_DOWNLOADS_SURFACE,
      exportSlug: "state-of-mcp-servers",
      format: "json",
    });
    expect(
      reportDownloadsExportAnalyticsData("state-of-ai-agents", "csv"),
    ).toEqual({
      surface: REPORT_DOWNLOADS_SURFACE,
      exportSlug: "state-of-ai-agents",
      format: "csv",
    });
  });
});
