import { describe, expect, it } from "vitest";
import {
  MCP_SECURITY_REPORT_SURFACE,
  mcpSecurityReportCategoryBrowseAnalyticsData,
  mcpSecurityReportCategoryBrowseAnalyticsEvent,
  mcpSecurityReportEgressAnalyticsData,
  mcpSecurityReportEgressAnalyticsEvent,
} from "@/lib/mcp-security-report-page-cta-events-lib";

describe("mcp security report page cta events lib", () => {
  it("builds mcp security report navigation analytics", () => {
    expect(mcpSecurityReportEgressAnalyticsEvent()).toBe(
      "mcp_security_report_egress_click",
    );
    expect(mcpSecurityReportEgressAnalyticsData("threat-model-guide")).toEqual({
      surface: MCP_SECURITY_REPORT_SURFACE,
      destination: "threat-model-guide",
    });
    expect(mcpSecurityReportCategoryBrowseAnalyticsEvent()).toBe(
      "mcp_security_report_category_browse_click",
    );
    expect(mcpSecurityReportCategoryBrowseAnalyticsData(128)).toEqual({
      surface: MCP_SECURITY_REPORT_SURFACE,
      category: "mcp",
      entryCount: 128,
    });
  });
});
