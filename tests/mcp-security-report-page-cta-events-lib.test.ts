import { describe, expect, it } from "vitest";
import {
  MCP_SECURITY_REPORT_SURFACE,
  mcpSecurityReportCategoryBrowseAnalyticsData,
  mcpSecurityReportCategoryBrowseAnalyticsEvent,
  mcpSecurityReportCiteAnalyticsData,
  mcpSecurityReportCiteAnalyticsEvent,
  mcpSecurityReportDistRowAnalyticsData,
  mcpSecurityReportDistRowAnalyticsEvent,
  mcpSecurityReportEgressAnalyticsData,
  mcpSecurityReportEgressAnalyticsEvent,
  mcpSecurityReportStatAnalyticsData,
  mcpSecurityReportStatAnalyticsEvent,
  mcpSecurityReportStatBrowseSearch,
  mcpSecurityReportStatDestination,
  mcpSecurityReportRouteDestination,
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
    expect(mcpSecurityReportCiteAnalyticsEvent()).toBe(
      "mcp_security_report_cite_click",
    );
    expect(mcpSecurityReportCiteAnalyticsData()).toEqual({
      surface: MCP_SECURITY_REPORT_SURFACE,
      destination: "canonical",
    });
  });

  it("builds mcp security dist-row and stat analytics", () => {
    expect(mcpSecurityReportDistRowAnalyticsEvent()).toBe(
      "mcp_security_dist_row_click",
    );
    expect(
      mcpSecurityReportDistRowAnalyticsData("hosting", "remote", 1, 2),
    ).toEqual({
      surface: MCP_SECURITY_REPORT_SURFACE,
      dimension: "hosting",
      rowKey: "remote",
      rowIndex: 1,
      rowCount: 2,
    });
    expect(mcpSecurityReportStatAnalyticsEvent()).toBe(
      "mcp_security_stat_click",
    );
    expect(mcpSecurityReportStatAnalyticsData("total", "browse")).toEqual({
      surface: MCP_SECURITY_REPORT_SURFACE,
      statKey: "total",
      destination: "browse",
    });
    expect(mcpSecurityReportStatBrowseSearch("total")).toEqual({
      category: "mcp",
    });
    expect(mcpSecurityReportStatBrowseSearch("safety-notes")).toEqual({
      category: "mcp",
      signal: "safety-notes",
    });
    expect(mcpSecurityReportStatBrowseSearch("privacy-notes")).toEqual({
      category: "mcp",
      signal: "privacy-notes",
    });
    expect(mcpSecurityReportStatBrowseSearch("verified-package")).toEqual({
      category: "mcp",
      signal: "trusted-package",
    });
  });

  it("maps mcp security report destinations", () => {
    expect(mcpSecurityReportStatDestination("total")).toEqual({
      to: "/browse",
      search: { category: "mcp" },
    });
    expect(mcpSecurityReportStatDestination("safety-notes")).toEqual({
      to: "/browse",
      search: { category: "mcp", signal: "safety-notes" },
    });
    expect(mcpSecurityReportStatDestination("unknown")).toBeNull();
    expect(mcpSecurityReportRouteDestination("threat-model-guide")).toEqual({
      to: "/guides/$slug",
      params: { slug: "threat-model-mcp-servers-before-installation" },
    });
    expect(mcpSecurityReportRouteDestination("state-of-mcp-servers")).toEqual({
      to: "/state-of-mcp-servers",
    });
    expect(mcpSecurityReportRouteDestination("mcp-category")).toEqual({
      to: "/$category",
      params: { category: "mcp" },
    });
    expect(mcpSecurityReportRouteDestination("unknown")).toBeNull();
  });
});
