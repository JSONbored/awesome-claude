import { describe, expect, it } from "vitest";
import {
  stateReportCategoryBrowseAnalyticsData,
  stateReportCategoryBrowseAnalyticsEvent,
  stateReportCiteAnalyticsData,
  stateReportCiteAnalyticsEvent,
  stateReportDistRowAnalyticsData,
  stateReportDistRowAnalyticsEvent,
  stateReportEgressAnalyticsData,
  stateReportEgressAnalyticsEvent,
  stateReportStatAnalyticsData,
  stateReportStatAnalyticsEvent,
} from "@/lib/state-report-page-cta-events-lib";

describe("state report page cta events lib", () => {
  it("builds state report navigation analytics", () => {
    expect(stateReportCategoryBrowseAnalyticsEvent()).toBe(
      "state_report_category_browse_click",
    );
    expect(
      stateReportCategoryBrowseAnalyticsData(
        "claude-tooling",
        "mcp",
        42,
        1,
        10,
      ),
    ).toEqual({
      reportId: "claude-tooling",
      category: "mcp",
      entryCount: 42,
      rowIndex: 1,
      sectionCount: 10,
    });
    expect(stateReportEgressAnalyticsEvent()).toBe("state_report_egress_click");
    expect(
      stateReportEgressAnalyticsData("mcp-servers", "claude-tooling"),
    ).toEqual({
      reportId: "mcp-servers",
      destination: "claude-tooling",
    });
    expect(stateReportEgressAnalyticsData("claude-tooling", "quality")).toEqual(
      {
        reportId: "claude-tooling",
        destination: "quality",
      },
    );
    expect(stateReportCiteAnalyticsEvent()).toBe("state_report_cite_click");
    expect(stateReportCiteAnalyticsData("agent-skills")).toEqual({
      reportId: "agent-skills",
      destination: "canonical",
    });
  });

  it("builds state report dist-row and stat analytics", () => {
    expect(stateReportDistRowAnalyticsEvent()).toBe(
      "state_report_dist_row_click",
    );
    expect(
      stateReportDistRowAnalyticsData(
        "mcp-servers",
        "trust-level",
        "trusted",
        0,
        4,
      ),
    ).toEqual({
      reportId: "mcp-servers",
      dimension: "trust-level",
      rowKey: "trusted",
      rowIndex: 0,
      rowCount: 4,
    });
    expect(stateReportStatAnalyticsEvent()).toBe("state_report_stat_click");
    expect(
      stateReportStatAnalyticsData("ai-agents", "total", "browse"),
    ).toEqual({
      reportId: "ai-agents",
      statKey: "total",
      destination: "browse",
    });
  });
});
