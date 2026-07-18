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

export type McpSecurityReportStatId =
  | "total"
  | "safety-notes"
  | "privacy-notes"
  | "verified-package";

/** Map an MCP security headline stat to a browse search patch. */
export function mcpSecurityReportStatBrowseSearch(statId: McpSecurityReportStatId): {
  category: string;
  signal?: string;
} {
  switch (statId) {
    case "safety-notes":
      return { category: "mcp", signal: "safety-notes" };
    case "privacy-notes":
      return { category: "mcp", signal: "privacy-notes" };
    case "verified-package":
      return { category: "mcp", signal: "trusted-package" };
    case "total":
    default:
      return { category: "mcp" };
  }
}

export type McpSecurityReportStatDestination = {
  to: "/browse";
  search: { category: string; signal?: string };
};

/** Map an MCP security headline stat id to a browse destination. */
export function mcpSecurityReportStatDestination(
  statId: string,
): McpSecurityReportStatDestination | null {
  switch (statId) {
    case "total":
    case "safety-notes":
    case "privacy-notes":
    case "verified-package":
      return {
        to: "/browse",
        search: mcpSecurityReportStatBrowseSearch(statId),
      };
    default:
      return null;
  }
}

export type McpSecurityReportRouteDestination =
  | { to: "/guides/$slug"; params: { slug: string } }
  | { to: "/state-of-mcp-servers" }
  | { to: "/$category"; params: { category: string } };

/** Map an MCP security report chrome egress id to an in-app route. */
export function mcpSecurityReportRouteDestination(
  destination: string,
): McpSecurityReportRouteDestination | null {
  switch (destination) {
    case "threat-model-guide":
      return {
        to: "/guides/$slug",
        params: { slug: "threat-model-mcp-servers-before-installation" },
      };
    case "state-of-mcp-servers":
      return { to: "/state-of-mcp-servers" };
    case "mcp-category":
      return { to: "/$category", params: { category: "mcp" } };
    default:
      return null;
  }
}
