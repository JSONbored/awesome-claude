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
