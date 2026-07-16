import { describe, expect, it } from "vitest";
import {
  VALIDATORS_TOOLS_SURFACE,
  validatorsSummaryStatAnalyticsData,
  validatorsSummaryStatAnalyticsEvent,
  validatorsToolCardAnalyticsData,
  validatorsToolCardAnalyticsEvent,
} from "@/lib/validators-tools-cta-events-lib";

describe("validators tools cta events lib", () => {
  it("builds privacy-light validators tool and summary analytics", () => {
    expect(validatorsToolCardAnalyticsEvent()).toBe(
      "validators_tool_card_click",
    );
    expect(validatorsToolCardAnalyticsData("skill-package", 2)).toEqual({
      surface: VALIDATORS_TOOLS_SURFACE,
      toolId: "skill-package",
      toolCount: 2,
    });
    expect(validatorsToolCardAnalyticsData("mcp-config", 2)).toEqual({
      surface: VALIDATORS_TOOLS_SURFACE,
      toolId: "mcp-config",
      toolCount: 2,
    });
    expect(validatorsSummaryStatAnalyticsEvent()).toBe(
      "validators_summary_stat_click",
    );
    expect(validatorsSummaryStatAnalyticsData("entries", "browse")).toEqual({
      surface: VALIDATORS_TOOLS_SURFACE,
      statId: "entries",
      destination: "browse",
    });
    expect(
      validatorsSummaryStatAnalyticsData("needs-attention", "quality"),
    ).toEqual({
      surface: VALIDATORS_TOOLS_SURFACE,
      statId: "needs-attention",
      destination: "quality",
    });
  });
});
