import { describe, expect, it } from "vitest";
import {
  browseDrilldown,
  categoryDrilldown,
  notesSignalFromLabel,
  platformFromLabel,
  sourceStatusFromLabel,
  tagDrilldown,
  trustLevelFromLabel,
  withCategoryHubDrilldown,
  withNotesSignalDrilldown,
  withPlatformDrilldown,
  withReportDimensionDrilldown,
  withSourceDrilldown,
  withTagDrilldown,
  withTrustDrilldown,
} from "@/lib/data-report-drilldown-lib";

describe("data report drilldown lib", () => {
  it("maps trust and source labels to registry enums", () => {
    expect(trustLevelFromLabel("Trusted")).toBe("trusted");
    expect(trustLevelFromLabel("Review first")).toBe("review");
    expect(trustLevelFromLabel("Limited")).toBe("limited");
    expect(trustLevelFromLabel("Blocked")).toBe("blocked");
    expect(trustLevelFromLabel("Unknown")).toBeUndefined();
    expect(sourceStatusFromLabel("Source-backed")).toBe("source-backed");
    expect(sourceStatusFromLabel("First-party")).toBe("first-party");
    expect(sourceStatusFromLabel("External")).toBe("external");
    expect(sourceStatusFromLabel("Unverified")).toBe("unverified");
    expect(sourceStatusFromLabel("Unknown")).toBeUndefined();
  });

  it("maps platform and notes labels to browse filter keys", () => {
    expect(platformFromLabel("Claude Code")).toBe("claude-code");
    expect(platformFromLabel("Claude Desktop")).toBe("claude-desktop");
    expect(platformFromLabel("Cursor")).toBe("cursor");
    expect(platformFromLabel("Unknown")).toBeUndefined();
    expect(notesSignalFromLabel("Safety notes")).toBe("safety-notes");
    expect(notesSignalFromLabel("Privacy notes")).toBe("privacy-notes");
    expect(notesSignalFromLabel("Both")).toBeUndefined();
  });

  it("attaches browse, tag, and category drilldowns with privacy-light keys", () => {
    expect(browseDrilldown({ category: "mcp", trust: "trusted" })).toEqual({
      kind: "browse",
      search: { category: "mcp", trust: "trusted" },
    });
    expect(tagDrilldown("postgres")).toEqual({ kind: "tag", tag: "postgres" });
    expect(categoryDrilldown("skills")).toEqual({
      kind: "category",
      category: "skills",
    });

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
      withTrustDrilldown([{ label: "Trusted", count: 4, pct: 40 }]),
    ).toEqual([
      {
        label: "Trusted",
        count: 4,
        pct: 40,
        rowKey: "trusted",
        drilldown: {
          kind: "browse",
          search: { trust: "trusted" },
        },
      },
    ]);
    expect(
      withTrustDrilldown([{ label: "Unknown", count: 1, pct: 10 }]),
    ).toEqual([{ label: "Unknown", count: 1, pct: 10 }]);

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
      withSourceDrilldown([{ label: "Unknown", count: 1, pct: 10 }]),
    ).toEqual([{ label: "Unknown", count: 1, pct: 10 }]);

    expect(
      withPlatformDrilldown([{ label: "Claude Code", count: 9, pct: 45 }]),
    ).toEqual([
      {
        label: "Claude Code",
        count: 9,
        pct: 45,
        rowKey: "claude-code",
        drilldown: {
          kind: "browse",
          search: { platform: "claude-code" },
        },
      },
    ]);
    expect(
      withPlatformDrilldown([{ label: "Unknown", count: 1, pct: 5 }]),
    ).toEqual([{ label: "Unknown", count: 1, pct: 5 }]);

    expect(
      withNotesSignalDrilldown([{ label: "Safety notes", count: 3, pct: 30 }]),
    ).toEqual([
      {
        label: "Safety notes",
        count: 3,
        pct: 30,
        rowKey: "safety-notes",
        drilldown: {
          kind: "browse",
          search: { signal: "safety-notes" },
        },
      },
    ]);
    expect(
      withNotesSignalDrilldown([{ label: "Privacy notes", count: 2, pct: 20 }]),
    ).toEqual([
      {
        label: "Privacy notes",
        count: 2,
        pct: 20,
        rowKey: "privacy-notes",
        drilldown: {
          kind: "browse",
          search: { signal: "privacy-notes" },
        },
      },
    ]);
    expect(
      withNotesSignalDrilldown([{ label: "Both", count: 1, pct: 10 }]),
    ).toEqual([{ label: "Both", count: 1, pct: 10 }]);

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

    expect(
      withCategoryHubDrilldown(
        [{ label: "MCP Servers", count: 5, pct: 50 }],
        new Map([["MCP Servers", "mcp"]]),
      ),
    ).toEqual([
      {
        label: "MCP Servers",
        count: 5,
        pct: 50,
        rowKey: "mcp",
        drilldown: { kind: "category", category: "mcp" },
      },
    ]);
    expect(
      withCategoryHubDrilldown(
        [{ label: "Unknown", count: 1, pct: 10 }],
        new Map(),
      ),
    ).toEqual([{ label: "Unknown", count: 1, pct: 10 }]);
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
        "source-provenance",
        [{ label: "First-party", count: 1, pct: 100 }],
        "agents",
      )[0]?.rowKey,
    ).toBe("first-party");
    expect(
      withReportDimensionDrilldown(
        "platform-coverage",
        [{ label: "Cursor", count: 2, pct: 50 }],
        "agents",
      )[0]?.drilldown,
    ).toEqual({ kind: "browse", search: { platform: "cursor" } });
    expect(
      withReportDimensionDrilldown(
        "notes-coverage",
        [{ label: "Safety notes", count: 2, pct: 50 }],
        "agents",
      )[0]?.rowKey,
    ).toBe("safety-notes");
    expect(
      withReportDimensionDrilldown(
        "use-cases",
        [{ label: "research", count: 2, pct: 50 }],
        "agents",
      )[0]?.drilldown,
    ).toEqual({ kind: "tag", tag: "research" });
    expect(
      withReportDimensionDrilldown(
        "prerequisites",
        [{ label: "Node", count: 1, pct: 100 }],
        "skills",
      )[0]?.drilldown,
    ).toEqual({ kind: "browse", search: { category: "skills" } });
    expect(
      withReportDimensionDrilldown(
        "disclosure",
        [{ label: "x", count: 1, pct: 100 }],
        "skills",
      )[0]?.drilldown,
    ).toEqual({ kind: "browse", search: { category: "skills" } });
    expect(
      withReportDimensionDrilldown(
        "packaging",
        [{ label: "x", count: 1, pct: 100 }],
        "skills",
      )[0]?.drilldown,
    ).toEqual({ kind: "browse", search: { category: "skills" } });
    expect(
      withReportDimensionDrilldown(
        "skill-type",
        [{ label: "x", count: 1, pct: 100 }],
        "skills",
      )[0]?.drilldown,
    ).toEqual({ kind: "browse", search: { category: "skills" } });
    expect(
      withReportDimensionDrilldown(
        "maturity",
        [{ label: "x", count: 1, pct: 100 }],
        "skills",
      )[0]?.drilldown,
    ).toEqual({ kind: "browse", search: { category: "skills" } });
    expect(
      withReportDimensionDrilldown(
        "verification",
        [{ label: "x", count: 1, pct: 100 }],
        "skills",
      )[0]?.drilldown,
    ).toEqual({ kind: "browse", search: { category: "skills" } });
    expect(
      withReportDimensionDrilldown(
        "hook-events",
        [{ label: "x", count: 1, pct: 100 }],
        "hooks",
      )[0]?.drilldown,
    ).toEqual({ kind: "browse", search: { category: "hooks" } });
    expect(
      withReportDimensionDrilldown(
        "unknown-dimension",
        [{ label: "x", count: 1, pct: 100 }],
        "agents",
      )[0]?.drilldown,
    ).toBeUndefined();
  });
});
