import { describe, expect, it } from "vitest";
import {
  TRUST_DRILLDOWN_SURFACE,
  trustDrilldownDocAnalyticsData,
  trustDrilldownDocAnalyticsEvent,
  trustDrilldownEntryKey,
  trustDrilldownMethodologyAnalyticsData,
  trustDrilldownMethodologyAnalyticsEvent,
  trustDrilldownOpenAnalyticsData,
  trustDrilldownOpenAnalyticsEvent,
  trustDrilldownSourceAnalyticsData,
  trustDrilldownSourceAnalyticsEvent,
} from "@/lib/trust-drilldown-cta-events-lib";

describe("trust drilldown cta events lib", () => {
  it("builds trust drilldown navigation analytics", () => {
    expect(trustDrilldownEntryKey("mcp", "browser")).toBe("mcp/browser");
    expect(trustDrilldownOpenAnalyticsEvent()).toBe(
      "trust_drilldown_open_click",
    );
    expect(
      trustDrilldownOpenAnalyticsData("mcp", "browser", "trusted", 4),
    ).toEqual({
      surface: TRUST_DRILLDOWN_SURFACE,
      entry: "mcp/browser",
      trust: "trusted",
      reasonCount: 4,
    });
    expect(trustDrilldownMethodologyAnalyticsEvent()).toBe(
      "trust_drilldown_methodology_click",
    );
    expect(trustDrilldownMethodologyAnalyticsData("mcp", "browser")).toEqual({
      surface: TRUST_DRILLDOWN_SURFACE,
      entry: "mcp/browser",
    });
    expect(trustDrilldownDocAnalyticsEvent()).toBe("trust_drilldown_doc_click");
    expect(
      trustDrilldownDocAnalyticsData("mcp", "browser", "source-ok", "ok"),
    ).toEqual({
      surface: TRUST_DRILLDOWN_SURFACE,
      entry: "mcp/browser",
      reasonId: "source-ok",
      severity: "ok",
    });
    expect(trustDrilldownSourceAnalyticsEvent()).toBe(
      "trust_drilldown_source_click",
    );
    expect(
      trustDrilldownSourceAnalyticsData("mcp", "browser", "repo-stars", "info"),
    ).toEqual({
      surface: TRUST_DRILLDOWN_SURFACE,
      entry: "mcp/browser",
      reasonId: "repo-stars",
      severity: "info",
    });
  });
});
