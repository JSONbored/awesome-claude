import { describe, expect, it } from "vitest";
import {
  stateReportCategoryBrowseAnalyticsData,
  stateReportCategoryBrowseAnalyticsEvent,
  stateReportCiteAnalyticsData,
  stateReportCiteAnalyticsEvent,
  stateReportEgressAnalyticsData,
  stateReportEgressAnalyticsEvent,
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
});
