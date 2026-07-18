/**
 * Pure validators coverage-metric navigation analytics helpers.
 *
 * Maps expertise coverage Metric tiles to privacy-light browse egress without
 * embedding coverage copy or entry titles.
 */

export const VALIDATORS_COVERAGE_SURFACE = "validators-coverage";

export type ValidatorsCoverageMetricId =
  | "reviewed"
  | "source-backed"
  | "safety-notes"
  | "privacy-notes";

export type ValidatorsCoverageBrowseSearch = {
  category?: string;
  signal?: string;
};

export function validatorsCoverageMetricAnalyticsEvent(): string {
  return "validators_coverage_metric_click";
}

export function validatorsCoverageMetricAnalyticsData(
  expertiseId: string,
  metricId: string,
  pct: number,
  value: number,
  total: number,
) {
  return {
    surface: VALIDATORS_COVERAGE_SURFACE,
    expertiseId,
    metricId,
    pct,
    value,
    total,
  };
}

/** Map a coverage expertise id to a browse category patch when one applies. */
export function validatorsCoverageExpertiseBrowseBase(expertiseId: string): { category?: string } {
  switch (expertiseId) {
    case "MCP":
      return { category: "mcp" };
    case "Hooks":
      return { category: "hooks" };
    case "Skills":
      return { category: "skills" };
    case "Commands":
      return { category: "commands" };
    case "Statuslines":
      return { category: "statuslines" };
    case "Rules":
      return { category: "rules" };
    case "Security":
    case "Privacy":
      return {};
    default:
      return {};
  }
}

/** Map a coverage metric to a browse search patch (merged with expertise base). */
export function validatorsCoverageMetricBrowseSearch(
  expertiseId: string,
  metricId: string,
): ValidatorsCoverageBrowseSearch | null {
  const base = validatorsCoverageExpertiseBrowseBase(expertiseId);
  switch (metricId) {
    case "reviewed":
      return { ...base, signal: "reviewed" };
    case "source-backed":
      return { ...base, signal: "source-backed" };
    case "safety-notes":
      return { ...base, signal: "safety-notes" };
    case "privacy-notes":
      return { ...base, signal: "privacy-notes" };
    default:
      return null;
  }
}

export type ValidatorsCoverageMetricDestination = {
  to: "/browse";
  search: ValidatorsCoverageBrowseSearch;
};

/** Map a validators coverage metric to a browse destination. */
export function validatorsCoverageMetricDestination(
  expertiseId: string,
  metricId: string,
): ValidatorsCoverageMetricDestination | null {
  const search = validatorsCoverageMetricBrowseSearch(expertiseId, metricId);
  switch (search) {
    case null:
      return null;
    default:
      return { to: "/browse", search };
  }
}
