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
  stateReportStatBrowseEgress,
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

  it("maps state report headline stats to browse egress", () => {
    expect(stateReportStatBrowseEgress("categories")).toEqual({
      to: "/browse",
      destination: "browse",
    });
    expect(stateReportStatBrowseEgress("reviewed")).toEqual({
      to: "/quality",
      destination: "quality",
    });
    expect(stateReportStatBrowseEgress("source-backed")).toEqual({
      to: "/browse",
      search: { source: "source-backed" },
      destination: "browse",
    });
    expect(stateReportStatBrowseEgress("source-backed", "mcp")).toEqual({
      to: "/browse",
      search: { category: "mcp", source: "source-backed" },
      destination: "browse",
    });
    expect(stateReportStatBrowseEgress("validated", "skills")).toEqual({
      to: "/browse",
      search: { category: "skills", signal: "reviewed" },
      destination: "browse",
    });
    expect(stateReportStatBrowseEgress("safety-privacy", "hooks")).toEqual({
      to: "/browse",
      search: { category: "hooks", signal: "safety-notes" },
      destination: "browse",
    });
    expect(stateReportStatBrowseEgress("total")).toEqual({
      to: "/browse",
      search: undefined,
      destination: "browse",
    });
    expect(stateReportStatBrowseEgress("total", "mcp")).toEqual({
      to: "/browse",
      search: { category: "mcp" },
      destination: "browse",
    });
    expect(stateReportStatBrowseEgress("remote", "mcp")).toEqual({
      to: "/browse",
      search: { category: "mcp" },
      destination: "browse",
    });
    expect(stateReportStatBrowseEgress("local", "mcp")).toEqual({
      to: "/browse",
      search: { category: "mcp" },
      destination: "browse",
    });
    expect(stateReportStatBrowseEgress("events", "hooks")).toEqual({
      to: "/browse",
      search: { category: "hooks" },
      destination: "browse",
    });
    expect(stateReportStatBrowseEgress("simple", "hooks")).toEqual({
      to: "/browse",
      search: { category: "hooks" },
      destination: "browse",
    });
    expect(stateReportStatBrowseEgress("packs", "skills")).toEqual({
      to: "/browse",
      search: { category: "skills" },
      destination: "browse",
    });
    expect(stateReportStatBrowseEgress("packaged", "skills")).toEqual({
      to: "/browse",
      search: { category: "skills" },
      destination: "browse",
    });
    expect(stateReportStatBrowseEgress("ready", "agents")).toEqual({
      to: "/browse",
      search: { category: "agents" },
      destination: "browse",
    });
    expect(stateReportStatBrowseEgress("documented", "agents")).toEqual({
      to: "/browse",
      search: { category: "agents" },
      destination: "browse",
    });
    expect(stateReportStatBrowseEgress("unknown", "agents")).toEqual({
      to: "/browse",
      search: { category: "agents" },
      destination: "browse",
    });
    expect(stateReportStatBrowseEgress("unknown")).toBeNull();
  });
});
