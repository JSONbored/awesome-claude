import { describe, expect, it } from "vitest";
import {
  browseDrilldown,
  categoryDrilldown,
  hostingKeyFromLabel,
  installMethodKeyFromLabel,
  notesSignalFromLabel,
  disclosureSignalFromLabel,
  platformFromLabel,
  sourceStatusFromLabel,
  supplyChainSignalFromLabel,
  tagDrilldown,
  transportKeyFromLabel,
  trustLevelFromLabel,
  withCategoryHubDrilldown,
  withDisclosureDrilldown,
  withDocsCoverageDrilldown,
  withHostingDrilldown,
  withInstallMethodDrilldown,
  withNotesSignalDrilldown,
  withPlatformDrilldown,
  withReportDimensionDrilldown,
  withSourceDrilldown,
  withSupplyChainSignalDrilldown,
  withTagDrilldown,
  withTransportDrilldown,
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
    expect(disclosureSignalFromLabel("Safety & privacy")).toBe("safety-notes");
    expect(disclosureSignalFromLabel("Safety only")).toBe("safety-notes");
    expect(disclosureSignalFromLabel("Privacy only")).toBe("privacy-notes");
    expect(disclosureSignalFromLabel("Neither documented")).toBeUndefined();
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
      withSourceDrilldown([{ label: "First-party", count: 3, pct: 30 }]),
    ).toEqual([
      {
        label: "First-party",
        count: 3,
        pct: 30,
        rowKey: "first-party",
        drilldown: {
          kind: "browse",
          search: { source: "first-party" },
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
      withNotesSignalDrilldown(
        [{ label: "Both", count: 1, pct: 10, rowKey: "both" }],
        "mcp",
      ),
    ).toEqual([
      {
        label: "Both",
        count: 1,
        pct: 10,
        rowKey: "both",
        drilldown: { kind: "browse", search: { category: "mcp" } },
      },
    ]);
    expect(
      withNotesSignalDrilldown([{ label: "Both", count: 1, pct: 10 }], "mcp"),
    ).toEqual([
      {
        label: "Both",
        count: 1,
        pct: 10,
        rowKey: "Both",
        drilldown: { kind: "browse", search: { category: "mcp" } },
      },
    ]);
    expect(
      withNotesSignalDrilldown(
        [{ label: "Safety notes", count: 3, pct: 30 }],
        "mcp",
      ),
    ).toEqual([
      {
        label: "Safety notes",
        count: 3,
        pct: 30,
        rowKey: "safety-notes",
        drilldown: {
          kind: "browse",
          search: { category: "mcp", signal: "safety-notes" },
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

  it("maps MCP transport, hosting, supply-chain, and install labels", () => {
    expect(transportKeyFromLabel("stdio (local)")).toBe("stdio");
    expect(transportKeyFromLabel("HTTP")).toBe("http");
    expect(transportKeyFromLabel("SSE")).toBe("sse");
    expect(transportKeyFromLabel("Unspecified")).toBe("unspecified");
    expect(transportKeyFromLabel("Unknown")).toBeUndefined();
    expect(hostingKeyFromLabel("Local (stdio)")).toBe("local");
    expect(hostingKeyFromLabel("Remote (hosted)")).toBe("remote");
    expect(hostingKeyFromLabel("Unspecified")).toBe("unspecified");
    expect(hostingKeyFromLabel("Unknown")).toBeUndefined();
    expect(supplyChainSignalFromLabel("Verified package")).toBe(
      "trusted-package",
    );
    expect(supplyChainSignalFromLabel("Checksummed download")).toBe(
      "checksums",
    );
    expect(supplyChainSignalFromLabel("Unknown")).toBeUndefined();
    expect(installMethodKeyFromLabel("npm / npx")).toBe("npm-npx");
    expect(installMethodKeyFromLabel("Python (pip / uv)")).toBe(
      "python-pip-uv",
    );

    expect(
      withTransportDrilldown([{ label: "HTTP", count: 4, pct: 40 }], "mcp"),
    ).toEqual([
      {
        label: "HTTP",
        count: 4,
        pct: 40,
        rowKey: "http",
        drilldown: { kind: "browse", search: { category: "mcp" } },
      },
    ]);
    expect(
      withTransportDrilldown([{ label: "Unknown", count: 1, pct: 10 }], "mcp"),
    ).toEqual([{ label: "Unknown", count: 1, pct: 10 }]);

    expect(
      withHostingDrilldown(
        [{ label: "Local (stdio)", count: 5, pct: 50 }],
        "mcp",
      ),
    ).toEqual([
      {
        label: "Local (stdio)",
        count: 5,
        pct: 50,
        rowKey: "local",
        drilldown: { kind: "browse", search: { category: "mcp" } },
      },
    ]);
    expect(
      withHostingDrilldown([{ label: "Unknown", count: 1, pct: 10 }], "mcp"),
    ).toEqual([{ label: "Unknown", count: 1, pct: 10 }]);

    expect(
      withSupplyChainSignalDrilldown(
        [{ label: "Verified package", count: 2, pct: 20 }],
        "mcp",
      ),
    ).toEqual([
      {
        label: "Verified package",
        count: 2,
        pct: 20,
        rowKey: "trusted-package",
        drilldown: {
          kind: "browse",
          search: { category: "mcp", signal: "trusted-package" },
        },
      },
    ]);
    expect(
      withSupplyChainSignalDrilldown(
        [{ label: "Source only", count: 3, pct: 30 }],
        "skills",
      ),
    ).toEqual([
      {
        label: "Source only",
        count: 3,
        pct: 30,
        rowKey: "Source only",
        drilldown: { kind: "browse", search: { category: "skills" } },
      },
    ]);
    expect(
      withSupplyChainSignalDrilldown([
        { label: "Checksummed download", count: 1, pct: 10 },
      ]),
    ).toEqual([
      {
        label: "Checksummed download",
        count: 1,
        pct: 10,
        rowKey: "checksums",
        drilldown: { kind: "browse", search: { signal: "checksums" } },
      },
    ]);
    expect(
      withSupplyChainSignalDrilldown(
        [{ label: "Unknown", count: 1, pct: 10 }],
        "mcp",
      ),
    ).toEqual([
      {
        label: "Unknown",
        count: 1,
        pct: 10,
        rowKey: "Unknown",
        drilldown: { kind: "browse", search: { category: "mcp" } },
      },
    ]);

    expect(
      withInstallMethodDrilldown(
        [{ label: "npm / npx", count: 3, pct: 30 }],
        "mcp",
      ),
    ).toEqual([
      {
        label: "npm / npx",
        count: 3,
        pct: 30,
        rowKey: "npm-npx",
        drilldown: { kind: "browse", search: { category: "mcp" } },
      },
    ]);
    expect(
      withInstallMethodDrilldown([{ label: "pnpm", count: 2, pct: 20 }]),
    ).toEqual([
      {
        label: "pnpm",
        count: 2,
        pct: 20,
        rowKey: "pnpm",
        drilldown: { kind: "browse", search: {} },
      },
    ]);

    expect(
      withDocsCoverageDrilldown(
        [
          { label: "Safety notes", count: 2, pct: 20 },
          {
            label: "Prerequisites listed",
            count: 3,
            pct: 30,
            rowKey: "prerequisites",
          },
          { label: "Troubleshooting", count: 1, pct: 10 },
        ],
        "mcp",
      ),
    ).toEqual([
      {
        label: "Safety notes",
        count: 2,
        pct: 20,
        rowKey: "safety-notes",
        drilldown: {
          kind: "browse",
          search: { category: "mcp", signal: "safety-notes" },
        },
      },
      {
        label: "Prerequisites listed",
        count: 3,
        pct: 30,
        rowKey: "prerequisites",
        drilldown: { kind: "browse", search: { category: "mcp" } },
      },
      {
        label: "Troubleshooting",
        count: 1,
        pct: 10,
        rowKey: "troubleshooting",
        drilldown: { kind: "browse", search: { category: "mcp" } },
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
        "supply-chain",
        [{ label: "Verified package", count: 1, pct: 100 }],
        "mcp",
      )[0]?.rowKey,
    ).toBe("trusted-package");
    expect(
      withReportDimensionDrilldown(
        "docs-coverage",
        [{ label: "Privacy notes", count: 1, pct: 100 }],
        "mcp",
      )[0]?.rowKey,
    ).toBe("privacy-notes");
    expect(
      withReportDimensionDrilldown(
        "transport",
        [{ label: "SSE", count: 1, pct: 100 }],
        "mcp",
      )[0]?.rowKey,
    ).toBe("sse");
    expect(
      withReportDimensionDrilldown(
        "hosting",
        [{ label: "Remote (hosted)", count: 1, pct: 100 }],
        "mcp",
      )[0]?.rowKey,
    ).toBe("remote");
    expect(
      withReportDimensionDrilldown(
        "install-methods",
        [{ label: "pnpm", count: 1, pct: 100 }],
        "mcp",
      )[0]?.rowKey,
    ).toBe("pnpm");
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
        [{ label: "Safety only", count: 1, pct: 100 }],
        "agents",
      )[0]?.drilldown,
    ).toEqual({
      kind: "browse",
      search: { category: "agents", signal: "safety-notes" },
    });
    expect(
      withReportDimensionDrilldown(
        "disclosure",
        [{ label: "Neither documented", count: 1, pct: 100 }],
        "agents",
      )[0]?.drilldown,
    ).toEqual({ kind: "browse", search: { category: "agents" } });
    expect(
      withDisclosureDrilldown(
        [{ label: "Privacy only", count: 2, pct: 20 }],
        "agents",
      )[0]?.drilldown,
    ).toEqual({
      kind: "browse",
      search: { category: "agents", signal: "privacy-notes" },
    });
    expect(
      withReportDimensionDrilldown(
        "packaging",
        [{ label: "Verified package", count: 1, pct: 100 }],
        "skills",
      )[0]?.drilldown,
    ).toEqual({
      kind: "browse",
      search: { category: "skills", signal: "trusted-package" },
    });
    expect(
      withReportDimensionDrilldown(
        "packaging",
        [{ label: "Source only", count: 1, pct: 100 }],
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
