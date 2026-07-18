import { describe, expect, it } from "vitest";
import {
  TRUST_DRILLDOWN_SURFACE,
  trustDrilldownBrowseAnalyticsData,
  trustDrilldownBrowseAnalyticsEvent,
  trustDrilldownBrowseDestination,
  trustDrilldownBrowseSearch,
  trustDrilldownDocAnalyticsData,
  trustDrilldownDocAnalyticsEvent,
  trustDrilldownEntryKey,
  trustDrilldownMethodologyAnalyticsData,
  trustDrilldownMethodologyAnalyticsEvent,
  trustDrilldownMethodologyDestination,
  trustDrilldownOpenAnalyticsData,
  trustDrilldownOpenAnalyticsEvent,
  trustDrilldownSourceAnalyticsData,
  trustDrilldownSourceAnalyticsEvent,
} from "@/lib/trust-drilldown-cta-events-lib";

describe("trust drilldown cta events lib", () => {
  it("builds trust drilldown navigation analytics for each surface", () => {
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
    expect(
      trustDrilldownOpenAnalyticsData(
        "mcp",
        "browser",
        "trusted",
        4,
        "compare-table",
      ),
    ).toEqual({
      surface: "compare-table",
      entry: "mcp/browser",
      trust: "trusted",
      reasonCount: 4,
    });
    expect(
      trustDrilldownOpenAnalyticsData(
        "skills",
        "lint",
        "review",
        2,
        "compare-drawer",
      ),
    ).toEqual({
      surface: "compare-drawer",
      entry: "skills/lint",
      trust: "review",
      reasonCount: 2,
    });
    expect(
      trustDrilldownOpenAnalyticsData(
        "tooling",
        "fmt",
        "limited",
        1,
        "detail-header",
      ),
    ).toEqual({
      surface: "detail-header",
      entry: "tooling/fmt",
      trust: "limited",
      reasonCount: 1,
    });
    expect(trustDrilldownMethodologyAnalyticsEvent()).toBe(
      "trust_drilldown_methodology_click",
    );
    expect(trustDrilldownMethodologyAnalyticsData("mcp", "browser")).toEqual({
      surface: TRUST_DRILLDOWN_SURFACE,
      entry: "mcp/browser",
    });
    expect(
      trustDrilldownMethodologyAnalyticsData("mcp", "browser", "compare-table"),
    ).toEqual({
      surface: "compare-table",
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
    expect(
      trustDrilldownDocAnalyticsData(
        "mcp",
        "browser",
        "source-ok",
        "ok",
        "detail-header",
      ),
    ).toEqual({
      surface: "detail-header",
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
    expect(
      trustDrilldownSourceAnalyticsData(
        "mcp",
        "browser",
        "repo-stars",
        "info",
        "compare-drawer",
      ),
    ).toEqual({
      surface: "compare-drawer",
      entry: "mcp/browser",
      reasonId: "repo-stars",
      severity: "info",
    });
  });

  it("maps trust drilldown browse egress to privacy-light analytics", () => {
    expect(trustDrilldownBrowseAnalyticsEvent()).toBe(
      "trust_drilldown_browse_click",
    );
    expect(
      trustDrilldownBrowseAnalyticsData("mcp", "browser", "trusted"),
    ).toEqual({
      surface: TRUST_DRILLDOWN_SURFACE,
      entry: "mcp/browser",
      trust: "trusted",
    });
    expect(
      trustDrilldownBrowseAnalyticsData(
        "mcp",
        "browser",
        "review",
        "compare-table",
      ),
    ).toEqual({
      surface: "compare-table",
      entry: "mcp/browser",
      trust: "review",
    });
  });

  it("maps trust levels to browse search patches", () => {
    expect(trustDrilldownBrowseSearch("trusted")).toEqual({ trust: "trusted" });
    expect(trustDrilldownBrowseSearch("review")).toEqual({ trust: "review" });
    expect(trustDrilldownBrowseSearch("limited")).toEqual({ trust: "limited" });
    expect(trustDrilldownBrowseSearch("blocked")).toEqual({ trust: "blocked" });
    expect(trustDrilldownBrowseSearch("unknown")).toBeNull();
  });

  it("maps trust drilldown egress ids to destinations", () => {
    expect(trustDrilldownMethodologyDestination("methodology")).toEqual({
      to: "/quality",
      hash: "methodology",
    });
    expect(trustDrilldownMethodologyDestination("unknown")).toBeNull();
    expect(trustDrilldownMethodologyDestination("")).toBeNull();
    expect(trustDrilldownBrowseDestination("trusted")).toEqual({
      to: "/browse",
      search: { trust: "trusted" },
    });
    expect(trustDrilldownBrowseDestination("review")).toEqual({
      to: "/browse",
      search: { trust: "review" },
    });
    expect(trustDrilldownBrowseDestination("limited")).toEqual({
      to: "/browse",
      search: { trust: "limited" },
    });
    expect(trustDrilldownBrowseDestination("blocked")).toEqual({
      to: "/browse",
      search: { trust: "blocked" },
    });
    expect(trustDrilldownBrowseDestination("unknown")).toBeNull();
    expect(trustDrilldownBrowseDestination("")).toBeNull();
  });
});
