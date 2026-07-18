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
  stateReportEgressRouteDestination,
  stateReportStatAnalyticsData,
  stateReportStatAnalyticsEvent,
  stateReportStatDestination,
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

  it("maps state report headline stats to browse destinations", () => {
    expect(stateReportStatDestination("claude-tooling", "total")).toEqual({
      to: "/browse",
      destination: "browse",
    });
    expect(stateReportStatDestination("claude-tooling", "categories")).toEqual({
      to: "/browse",
      destination: "browse",
    });
    expect(
      stateReportStatDestination("claude-tooling", "source-backed"),
    ).toEqual({
      to: "/browse",
      search: { source: "source-backed" },
      destination: "browse",
    });
    expect(stateReportStatDestination("claude-tooling", "reviewed")).toEqual({
      to: "/quality",
      destination: "quality",
    });
    expect(stateReportStatDestination("claude-tooling", "unknown")).toBeNull();

    expect(stateReportStatDestination("mcp-servers", "total")).toEqual({
      to: "/browse",
      search: { category: "mcp" },
      destination: "browse",
    });
    expect(stateReportStatDestination("mcp-servers", "remote")).toEqual({
      to: "/browse",
      search: { category: "mcp" },
      destination: "browse",
    });
    expect(stateReportStatDestination("mcp-servers", "local")).toEqual({
      to: "/browse",
      search: { category: "mcp" },
      destination: "browse",
    });
    expect(stateReportStatDestination("mcp-servers", "source-backed")).toEqual({
      to: "/browse",
      search: { category: "mcp", source: "source-backed" },
      destination: "browse",
    });
    expect(stateReportStatDestination("mcp-servers", "unknown")).toBeNull();

    expect(stateReportStatDestination("claude-code-hooks", "total")).toEqual({
      to: "/browse",
      search: { category: "hooks" },
      destination: "browse",
    });
    expect(stateReportStatDestination("claude-code-hooks", "events")).toEqual({
      to: "/browse",
      search: { category: "hooks" },
      destination: "browse",
    });
    expect(stateReportStatDestination("claude-code-hooks", "simple")).toEqual({
      to: "/browse",
      search: { category: "hooks" },
      destination: "browse",
    });
    expect(
      stateReportStatDestination("claude-code-hooks", "safety-privacy"),
    ).toEqual({
      to: "/browse",
      search: { category: "hooks", signal: "safety-notes" },
      destination: "browse",
    });
    expect(
      stateReportStatDestination("claude-code-hooks", "unknown"),
    ).toBeNull();

    expect(stateReportStatDestination("ai-agents", "total")).toEqual({
      to: "/browse",
      search: { category: "agents" },
      destination: "browse",
    });
    expect(stateReportStatDestination("ai-agents", "documented")).toEqual({
      to: "/browse",
      search: { category: "agents", signal: "safety-notes" },
      destination: "browse",
    });
    expect(stateReportStatDestination("ai-agents", "source-backed")).toEqual({
      to: "/browse",
      search: { category: "agents", source: "source-backed" },
      destination: "browse",
    });
    expect(stateReportStatDestination("ai-agents", "ready")).toEqual({
      to: "/browse",
      search: { category: "agents" },
      destination: "browse",
    });
    expect(stateReportStatDestination("ai-agents", "unknown")).toBeNull();

    expect(stateReportStatDestination("agent-skills", "total")).toEqual({
      to: "/browse",
      search: { category: "skills" },
      destination: "browse",
    });
    expect(stateReportStatDestination("agent-skills", "validated")).toEqual({
      to: "/browse",
      search: { category: "skills" },
      destination: "browse",
    });
    expect(stateReportStatDestination("agent-skills", "packs")).toEqual({
      to: "/browse",
      search: { category: "skills" },
      destination: "browse",
    });
    expect(stateReportStatDestination("agent-skills", "packaged")).toEqual({
      to: "/browse",
      search: { category: "skills", signal: "trusted-package" },
      destination: "browse",
    });
    expect(stateReportStatDestination("agent-skills", "unknown")).toBeNull();

    expect(stateReportStatDestination("unknown-report", "total")).toBeNull();
  });

  it("maps state report egress route destinations", () => {
    expect(stateReportEgressRouteDestination("browse")).toEqual({
      to: "/browse",
    });
    expect(stateReportEgressRouteDestination("quality")).toEqual({
      to: "/quality",
    });
    expect(stateReportEgressRouteDestination("mcp-security-report")).toEqual({
      to: "/mcp-security-report",
    });
    expect(stateReportEgressRouteDestination("claude-tooling")).toEqual({
      to: "/state-of-claude-tooling",
    });
    expect(stateReportEgressRouteDestination("mcp-servers")).toEqual({
      to: "/state-of-mcp-servers",
    });
    expect(stateReportEgressRouteDestination("claude-code-hooks")).toEqual({
      to: "/state-of-claude-code-hooks",
    });
    expect(stateReportEgressRouteDestination("agent-skills")).toEqual({
      to: "/state-of-agent-skills",
    });
    expect(stateReportEgressRouteDestination("ai-agents")).toEqual({
      to: "/state-of-ai-agents",
    });
    expect(stateReportEgressRouteDestination("category", "mcp")).toEqual({
      to: "/$category",
      params: { category: "mcp" },
    });
    expect(stateReportEgressRouteDestination("category", "")).toBeNull();
    expect(stateReportEgressRouteDestination("unknown")).toBeNull();
  });
});
