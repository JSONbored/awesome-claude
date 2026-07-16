import { describe, expect, it } from "vitest";
import {
  browseDrilldown,
  sourceStatusFromLabel,
  tagDrilldown,
  trustLevelFromLabel,
  withReportDimensionDrilldown,
  withSourceDrilldown,
  withTagDrilldown,
  withTrustDrilldown,
} from "@/lib/data-report-drilldown-lib";

describe("data report drilldown lib", () => {
  it("maps trust and source labels to registry enums", () => {
    expect(trustLevelFromLabel("Trusted")).toBe("trusted");
    expect(trustLevelFromLabel("Review first")).toBe("review");
    expect(sourceStatusFromLabel("Source-backed")).toBe("source-backed");
    expect(sourceStatusFromLabel("First-party")).toBe("first-party");
  });

  it("attaches browse and tag drilldowns with privacy-light keys", () => {
    expect(browseDrilldown({ category: "mcp", trust: "trusted" })).toEqual({
      kind: "browse",
      search: { category: "mcp", trust: "trusted" },
    });
    expect(tagDrilldown("postgres")).toEqual({ kind: "tag", tag: "postgres" });

    expect(
      withTrustDrilldown([{ label: "Trusted", count: 4, pct: 40 }], "mcp"),
    ).toEqual([
      {
        label: "Trusted",
        count: 4,
        pct: 40,
        rowKey: "trusted",
        drilldown: {
          kind: "browse",
          search: { category: "mcp", trust: "trusted" },
        },
      },
    ]);

    expect(
      withSourceDrilldown(
        [{ label: "Unverified", count: 2, pct: 20 }],
        "skills",
      ),
    ).toEqual([
      {
        label: "Unverified",
        count: 2,
        pct: 20,
        rowKey: "unverified",
        drilldown: {
          kind: "browse",
          search: { category: "skills", source: "unverified" },
        },
      },
    ]);

    expect(
      withTagDrilldown([{ label: "postgres", count: 3, pct: 30 }]),
    ).toEqual([
      {
        label: "postgres",
        count: 3,
        pct: 30,
        rowKey: "postgres",
        drilldown: { kind: "tag", tag: "postgres" },
      },
    ]);
  });

  it("attaches dimension drilldowns for known report keys", () => {
    expect(
      withReportDimensionDrilldown(
        "trust-level",
        [{ label: "Trusted", count: 1, pct: 100 }],
        "agents",
      )[0]?.rowKey,
    ).toBe("trusted");
    expect(
      withReportDimensionDrilldown(
        "use-cases",
        [{ label: "research", count: 2, pct: 50 }],
        "agents",
      )[0]?.drilldown,
    ).toEqual({ kind: "tag", tag: "research" });
    expect(
      withReportDimensionDrilldown(
        "unknown-dimension",
        [{ label: "x", count: 1, pct: 100 }],
        "agents",
      )[0]?.drilldown,
    ).toBeUndefined();
  });
});
