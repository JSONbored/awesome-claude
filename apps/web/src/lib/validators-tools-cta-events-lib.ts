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

export type ValidatorsSummaryStatDestination = {
  to: "/browse" | "/quality";
  search?: { source?: string };
  destination: "browse" | "quality";
};

/** Map a validators summary headline stat to browse/quality egress. */
export function validatorsSummaryStatDestination(
  statId: string,
): ValidatorsSummaryStatDestination | null {
  switch (statId) {
    case "entries":
      return { to: "/browse", destination: "browse" };
    case "safety-coverage":
      return { to: "/quality", destination: "quality" };
    case "source-backed":
      return {
        to: "/browse",
        search: { source: "source-backed" },
        destination: "browse",
      };
    case "needs-attention":
      return { to: "/quality", destination: "quality" };
    default:
      return null;
  }
}

export type ValidatorsToolCardDestination = {
  to: "/validators/skill-package" | "/validators/mcp-config";
  destination: "validators-skill-package" | "validators-mcp-config";
};

/** Map a validators local-tool card to its tool route. */
export function validatorsToolCardDestination(
  toolId: string,
): ValidatorsToolCardDestination | null {
  switch (toolId) {
    case "skill-package":
      return {
        to: "/validators/skill-package",
        destination: "validators-skill-package",
      };
    case "mcp-config":
      return {
        to: "/validators/mcp-config",
        destination: "validators-mcp-config",
      };
    default:
      return null;
  }
}
