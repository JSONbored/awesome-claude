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

export function mcpSecurityReportCiteAnalyticsEvent(): string {
  return "mcp_security_report_cite_click";
}

export function mcpSecurityReportCiteAnalyticsData() {
  return {
    surface: MCP_SECURITY_REPORT_SURFACE,
    destination: "canonical",
  };
}

export function mcpSecurityReportDistRowAnalyticsEvent(): string {
  return "mcp_security_dist_row_click";
}

export function mcpSecurityReportDistRowAnalyticsData(
  dimension: string,
  rowKey: string,
  rowIndex: number,
  rowCount: number,
) {
  return {
    surface: MCP_SECURITY_REPORT_SURFACE,
    dimension,
    rowKey,
    rowIndex,
    rowCount,
  };
}

export function mcpSecurityReportStatAnalyticsEvent(): string {
  return "mcp_security_stat_click";
}

export function mcpSecurityReportStatAnalyticsData(
  statKey: string,
  destination: "browse" | "quality",
) {
  return {
    surface: MCP_SECURITY_REPORT_SURFACE,
    statKey,
    destination,
  };
}

/** Browse search used by MCP security headline stats. */
export type McpSecurityReportStatBrowseSearch = {
  category?: string;
  signal?: string;
};

export type McpSecurityReportStatBrowseEgress = {
  to: "/browse";
  search: McpSecurityReportStatBrowseSearch;
  destination: "browse";
};

/** Map an MCP security headline stat to a scoped browse destination. */
export function mcpSecurityReportStatBrowseEgress(
  statKey: string,
): McpSecurityReportStatBrowseEgress | null {
  switch (statKey) {
    case "total":
      return {
        to: "/browse",
        search: { category: "mcp" },
        destination: "browse",
      };
    case "safety-notes":
      return {
        to: "/browse",
        search: { category: "mcp", signal: "safety-notes" },
        destination: "browse",
      };
    case "privacy-notes":
      return {
        to: "/browse",
        search: { category: "mcp", signal: "privacy-notes" },
        destination: "browse",
      };
    case "verified-package":
      return {
        to: "/browse",
        search: { category: "mcp", signal: "trusted-package" },
        destination: "browse",
      };
    default:
      return null;
  }
}
