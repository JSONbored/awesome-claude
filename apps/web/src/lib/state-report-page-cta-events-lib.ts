/**
 * Pure state report page navigation analytics helpers.
 *
 * Maps category browse egress and methodology cross-links to privacy-light event
 * names without embedding report titles, URLs, or entry names.
 */

export type StateReportId =
  | "claude-tooling"
  | "mcp-servers"
  | "claude-code-hooks"
  | "agent-skills"
  | "ai-agents";

export type StateReportEgressDestination =
  | "browse"
  | "quality"
  | "mcp-security-report"
  | "claude-tooling"
  | "mcp-servers"
  | "claude-code-hooks"
  | "agent-skills"
  | "ai-agents";

export function stateReportCategoryBrowseAnalyticsEvent(): string {
  return "state_report_category_browse_click";
}

export function stateReportCategoryBrowseAnalyticsData(
  reportId: StateReportId,
  category: string,
  entryCount: number,
  rowIndex: number,
  sectionCount: number,
) {
  return {
    reportId,
    category,
    entryCount,
    rowIndex,
    sectionCount,
  };
}

export function stateReportEgressAnalyticsEvent(): string {
  return "state_report_egress_click";
}

export function stateReportEgressAnalyticsData(
  reportId: StateReportId,
  destination: StateReportEgressDestination,
) {
  return {
    reportId,
    destination,
  };
}

export function stateReportCiteAnalyticsEvent(): string {
  return "state_report_cite_click";
}

export function stateReportCiteAnalyticsData(reportId: StateReportId) {
  return {
    reportId,
    destination: "canonical",
  };
}

export function stateReportDistRowAnalyticsEvent(): string {
  return "state_report_dist_row_click";
}

export function stateReportDistRowAnalyticsData(
  reportId: StateReportId,
  dimension: string,
  rowKey: string,
  rowIndex: number,
  rowCount: number,
) {
  return {
    reportId,
    dimension,
    rowKey,
    rowIndex,
    rowCount,
  };
}

export function stateReportStatAnalyticsEvent(): string {
  return "state_report_stat_click";
}

export function stateReportStatAnalyticsData(
  reportId: StateReportId,
  statKey: string,
  destination: "browse" | "quality",
) {
  return {
    reportId,
    statKey,
    destination,
  };
}

/** Browse/quality destination for a state-report headline stat. */
export type StateReportStatBrowseSearch = {
  category?: string;
  source?: string;
  signal?: string;
};

export type StateReportStatDestination = {
  to: "/browse" | "/quality";
  search?: StateReportStatBrowseSearch;
  destination: "browse" | "quality";
};

/**
 * Map a state-report headline stat to browse/quality egress.
 * Covers all five public state reports (tooling, mcp, hooks, agents, skills).
 */
export function stateReportStatDestination(
  reportId: string,
  statKey: string,
): StateReportStatDestination | null {
  switch (reportId) {
    case "claude-tooling":
      switch (statKey) {
        case "source-backed":
          return {
            to: "/browse",
            search: { source: "source-backed" },
            destination: "browse",
          };
        case "reviewed":
          return { to: "/quality", destination: "quality" };
        case "total":
        case "categories":
          return { to: "/browse", destination: "browse" };
        default:
          return null;
      }
    case "mcp-servers":
      switch (statKey) {
        case "source-backed":
          return {
            to: "/browse",
            search: { category: "mcp", source: "source-backed" },
            destination: "browse",
          };
        case "total":
        case "remote":
        case "local":
          return {
            to: "/browse",
            search: { category: "mcp" },
            destination: "browse",
          };
        default:
          return null;
      }
    case "claude-code-hooks":
      switch (statKey) {
        case "safety-privacy":
          return {
            to: "/browse",
            search: { category: "hooks", signal: "safety-notes" },
            destination: "browse",
          };
        case "total":
        case "events":
        case "simple":
          return {
            to: "/browse",
            search: { category: "hooks" },
            destination: "browse",
          };
        default:
          return null;
      }
    case "ai-agents":
      switch (statKey) {
        case "documented":
          return {
            to: "/browse",
            search: { category: "agents", signal: "safety-notes" },
            destination: "browse",
          };
        case "source-backed":
          return {
            to: "/browse",
            search: { category: "agents", source: "source-backed" },
            destination: "browse",
          };
        case "total":
        case "ready":
          return {
            to: "/browse",
            search: { category: "agents" },
            destination: "browse",
          };
        default:
          return null;
      }
    case "agent-skills":
      switch (statKey) {
        case "packaged":
          return {
            to: "/browse",
            search: { category: "skills", signal: "trusted-package" },
            destination: "browse",
          };
        case "total":
        case "validated":
        case "packs":
          return {
            to: "/browse",
            search: { category: "skills" },
            destination: "browse",
          };
        default:
          return null;
      }
    default:
      return null;
  }
}
