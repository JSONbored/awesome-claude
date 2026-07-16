import { describe, expect, it } from "vitest";
import { buildMcpServersReport } from "@/lib/mcp-servers-stats-lib";
import { buildMcpServersReport as buildFromWrapper } from "@/lib/mcp-servers-stats";
import { ENTRIES } from "@/data/entries";

describe("mcp-servers-stats-lib", () => {
  it("builds a deterministic MCP servers report model", () => {
    const a = buildMcpServersReport(ENTRIES, "2026-07-16");
    const b = buildMcpServersReport(ENTRIES, "2026-07-16");
    expect(a).toEqual(b);
    expect(a.slug).toBe("/state-of-mcp-servers");
    expect(a.exportSlug).toBe("mcp-servers");
    expect(a.total).toBeGreaterThan(100);
    expect(a.dimensions.map((dimension) => dimension.key)).toEqual(
      expect.arrayContaining([
        "transport",
        "hosting",
        "trust",
        "source",
        "install-methods",
      ]),
    );
  });

  it("keeps wrapper re-export aligned", () => {
    expect(buildFromWrapper(ENTRIES, "2026-07-16")).toEqual(
      buildMcpServersReport(ENTRIES, "2026-07-16"),
    );
  });
});
