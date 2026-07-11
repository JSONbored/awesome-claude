import { describe, expect, it } from "vitest";
import {
  harnessVariantSelectAnalyticsData,
  harnessVariantSelectAnalyticsEvent,
} from "@/lib/harness-variant-cta-events-lib";

describe("harness variant cta events lib", () => {
  it("builds privacy-light harness variant analytics", () => {
    expect(harnessVariantSelectAnalyticsEvent()).toBe("harness_variant_select");
    expect(
      harnessVariantSelectAnalyticsData(
        "skills",
        "code-review",
        "detail-command-center",
        "claude-code",
      ),
    ).toEqual({
      entry: "skills/code-review",
      surface: "detail-command-center",
      harness: "claude-code",
    });
    expect(
      harnessVariantSelectAnalyticsData(
        "mcp",
        "browser",
        "compare-drawer",
        "cursor",
      ),
    ).toEqual({
      entry: "mcp/browser",
      surface: "compare-drawer",
      harness: "cursor",
    });
  });
});
