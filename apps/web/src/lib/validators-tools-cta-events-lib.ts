/**
 * Pure validators local-tools CTA analytics helpers.
 *
 * Maps maintainer tool-card and summary-stat navigation to privacy-light event
 * names without embedding titles or blurbs.
 */

export const VALIDATORS_TOOLS_SURFACE = "validators-tools";

export type ValidatorsToolId = "skill-package" | "mcp-config";
export type ValidatorsSummaryStatId =
  | "entries"
  | "source-backed"
  | "safety-coverage"
  | "needs-attention";

export function validatorsToolCardAnalyticsEvent(): string {
  return "validators_tool_card_click";
}

export function validatorsToolCardAnalyticsData(toolId: ValidatorsToolId, toolCount: number) {
  return {
    surface: VALIDATORS_TOOLS_SURFACE,
    toolId,
    toolCount,
  };
}

export function validatorsSummaryStatAnalyticsEvent(): string {
  return "validators_summary_stat_click";
}

export function validatorsSummaryStatAnalyticsData(
  statId: ValidatorsSummaryStatId,
  destination: "browse" | "quality" | "validators-skill-package" | "validators-mcp-config",
) {
  return {
    surface: VALIDATORS_TOOLS_SURFACE,
    statId,
    destination,
  };
}
