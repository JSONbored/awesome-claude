/**
 * Pure MCP security report navigation analytics helpers.
 *
 * Maps threat-model guide egress, related report links, and category browse to
 * privacy-light event names without embedding guide titles or URLs.
 */

export const MCP_SECURITY_REPORT_SURFACE = "mcp-security-report";

export type McpSecurityReportEgressDestination = "threat-model-guide" | "state-of-mcp-servers";

export function mcpSecurityReportEgressAnalyticsEvent(): string {
  return "mcp_security_report_egress_click";
}

export function mcpSecurityReportEgressAnalyticsData(
  destination: McpSecurityReportEgressDestination,
) {
  return {
    surface: MCP_SECURITY_REPORT_SURFACE,
    destination,
  };
}

export function mcpSecurityReportCategoryBrowseAnalyticsEvent(): string {
  return "mcp_security_report_category_browse_click";
}

export function mcpSecurityReportCategoryBrowseAnalyticsData(entryCount: number) {
  return {
    surface: MCP_SECURITY_REPORT_SURFACE,
    category: "mcp",
    entryCount,
  };
}
