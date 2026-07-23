import { describe, expect, it } from "vitest";
import { buildMcpSecurityReport } from "@/lib/mcp-security-stats-lib";
import { buildMcpSecurityReport as buildFromWrapper } from "@/lib/mcp-security-stats";
import { ENTRIES } from "@/data/entries";

describe("mcp-security-stats-lib", () => {
  it("builds a deterministic MCP security report model", () => {
    const a = buildMcpSecurityReport(ENTRIES, "2026-07-16");
    const b = buildMcpSecurityReport(ENTRIES, "2026-07-16");
    expect(a).toEqual(b);
    expect(a.slug).toBe("/mcp-security-report");
    expect(a.exportSlug).toBe("mcp-security");
    expect(a.total).toBeGreaterThan(100);
    expect(a.stats.map((stat) => stat.key)).toEqual([
      "total",
      "safety-notes",
      "privacy-notes",
      "verified-package",
    ]);
    expect(a.dimensions.map((dimension) => dimension.key)).toEqual(
      expect.arrayContaining([
        "auth",
        "hosting",
        "supply-chain",
        "docs",
        "notes",
      ]),
    );
  });

  it("keeps wrapper re-export aligned", () => {
    expect(buildFromWrapper(ENTRIES, "2026-07-16")).toEqual(
      buildMcpSecurityReport(ENTRIES, "2026-07-16"),
    );
  });
});
