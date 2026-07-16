import { describe, expect, it } from "vitest";
import { buildClaudeToolingReport } from "@/lib/claude-tooling-stats-lib";
import { buildClaudeToolingReport as buildFromWrapper } from "@/lib/claude-tooling-stats";
import { ENTRIES } from "@/data/entries";

describe("claude-tooling-stats-lib", () => {
  it("builds a deterministic report model with key dimensions", () => {
    const a = buildClaudeToolingReport(ENTRIES, "2026-07-16");
    const b = buildClaudeToolingReport(ENTRIES, "2026-07-16");
    expect(a).toEqual(b);
    expect(a.slug).toBe("/state-of-claude-tooling");
    expect(a.exportSlug).toBe("claude-tooling");
    expect(a.total).toBeGreaterThan(500);
    expect(a.dimensions.map((dimension) => dimension.key)).toEqual(
      expect.arrayContaining([
        "categories",
        "trust",
        "source",
        "platforms",
        "install-methods",
      ]),
    );
  });

  it("keeps wrapper re-export aligned", () => {
    expect(buildFromWrapper(ENTRIES, "2026-07-16")).toEqual(
      buildClaudeToolingReport(ENTRIES, "2026-07-16"),
    );
  });
});
