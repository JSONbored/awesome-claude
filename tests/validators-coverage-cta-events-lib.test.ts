import { describe, expect, it } from "vitest";
import {
  VALIDATORS_COVERAGE_SURFACE,
  validatorsCoverageExpertiseBrowseBase,
  validatorsCoverageMetricAnalyticsData,
  validatorsCoverageMetricAnalyticsEvent,
  validatorsCoverageMetricBrowseSearch,
  validatorsCoverageMetricDestination,
} from "@/lib/validators-coverage-cta-events-lib";

describe("validators coverage cta events lib", () => {
  it("builds privacy-light coverage metric analytics", () => {
    expect(validatorsCoverageMetricAnalyticsEvent()).toBe(
      "validators_coverage_metric_click",
    );
    expect(
      validatorsCoverageMetricAnalyticsData("MCP", "reviewed", 42, 21, 50),
    ).toEqual({
      surface: VALIDATORS_COVERAGE_SURFACE,
      expertiseId: "MCP",
      metricId: "reviewed",
      pct: 42,
      value: 21,
      total: 50,
    });
    expect(
      validatorsCoverageMetricAnalyticsData(
        "Security",
        "safety-notes",
        10,
        5,
        50,
      ),
    ).toEqual({
      surface: VALIDATORS_COVERAGE_SURFACE,
      expertiseId: "Security",
      metricId: "safety-notes",
      pct: 10,
      value: 5,
      total: 50,
    });
  });

  it("maps expertise ids to browse category bases", () => {
    expect(validatorsCoverageExpertiseBrowseBase("MCP")).toEqual({
      category: "mcp",
    });
    expect(validatorsCoverageExpertiseBrowseBase("Hooks")).toEqual({
      category: "hooks",
    });
    expect(validatorsCoverageExpertiseBrowseBase("Skills")).toEqual({
      category: "skills",
    });
    expect(validatorsCoverageExpertiseBrowseBase("Commands")).toEqual({
      category: "commands",
    });
    expect(validatorsCoverageExpertiseBrowseBase("Statuslines")).toEqual({
      category: "statuslines",
    });
    expect(validatorsCoverageExpertiseBrowseBase("Rules")).toEqual({
      category: "rules",
    });
    expect(validatorsCoverageExpertiseBrowseBase("Security")).toEqual({});
    expect(validatorsCoverageExpertiseBrowseBase("Privacy")).toEqual({});
    expect(validatorsCoverageExpertiseBrowseBase("unknown")).toEqual({});
  });

  it("maps coverage metrics to browse search patches", () => {
    expect(validatorsCoverageMetricBrowseSearch("MCP", "reviewed")).toEqual({
      category: "mcp",
      signal: "reviewed",
    });
    expect(
      validatorsCoverageMetricBrowseSearch("Skills", "source-backed"),
    ).toEqual({
      category: "skills",
      signal: "source-backed",
    });
    expect(
      validatorsCoverageMetricBrowseSearch("Hooks", "safety-notes"),
    ).toEqual({
      category: "hooks",
      signal: "safety-notes",
    });
    expect(
      validatorsCoverageMetricBrowseSearch("Rules", "privacy-notes"),
    ).toEqual({
      category: "rules",
      signal: "privacy-notes",
    });
    expect(
      validatorsCoverageMetricBrowseSearch("Security", "reviewed"),
    ).toEqual({
      signal: "reviewed",
    });
    expect(
      validatorsCoverageMetricBrowseSearch("Privacy", "privacy-notes"),
    ).toEqual({
      signal: "privacy-notes",
    });
    expect(validatorsCoverageMetricBrowseSearch("MCP", "unknown")).toBeNull();
  });

  it("maps validators coverage metric destinations", () => {
    expect(validatorsCoverageMetricDestination("MCP", "reviewed")).toEqual({
      to: "/browse",
      search: { category: "mcp", signal: "reviewed" },
    });
    expect(validatorsCoverageMetricDestination("MCP", "unknown")).toBeNull();
  });
});
