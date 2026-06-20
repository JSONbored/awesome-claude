import { describe, expect, it } from "vitest";

import { buildWorklist, trustGaps } from "../scripts/lib/growth-dashboard.mjs";

function entry(partial: Record<string, unknown>) {
  return {
    category: "mcp",
    slug: "x",
    title: "X",
    description: "d",
    ...partial,
  };
}

describe("trustGaps", () => {
  it("flags missing safety, privacy, and source signals", () => {
    const gaps = trustGaps(entry({})).map((g) => g.field);
    expect(gaps).toEqual(["safetyNotes", "privacyNotes", "source"]);
  });

  it("clears once the signals are present", () => {
    const gaps = trustGaps(
      entry({
        safetyNotes: ["runs shell"],
        privacyNotes: ["telemetry"],
        repoUrl: "https://github.com/x/y",
      }),
    );
    expect(gaps).toEqual([]);
  });
});

describe("buildWorklist", () => {
  // A complete entry (good snippet + trust) should never appear.
  const clean = entry({
    slug: "clean",
    seoTitle: "A clear, specific Stripe MCP server title for Claude",
    seoDescription:
      "Install and configure the Stripe MCP server for Claude Code, with trust, safety, and config guidance you can copy in seconds.",
    safetyNotes: ["x"],
    privacyNotes: ["y"],
    repoUrl: "https://github.com/x/y",
  });
  const gappy = entry({ slug: "gappy" }); // no seo fields, no trust notes

  it("lists only pages with opportunities, source-labeled", () => {
    const report = buildWorklist([clean, gappy], new Map());
    expect(report.items).toHaveLength(1);
    expect(report.items[0].slug).toBe("gappy");
    const sources = new Set(report.items[0].findings.map((f) => f.source));
    expect(sources).toContain("snippet-audit");
    expect(sources).toContain("trust-metadata");
    expect(report.weightedByImpressions).toBe(false);
  });

  it("ranks by impressions × gaps when GSC data is supplied", () => {
    const a = entry({ slug: "a" });
    const b = entry({ slug: "b" });
    const gsc = new Map([
      ["/entry/mcp/a", 10],
      ["/entry/mcp/b", 1000],
    ]);
    const report = buildWorklist([a, b], gsc);
    expect(report.weightedByImpressions).toBe(true);
    expect(report.source).toBe("registry + search-console");
    expect(report.items[0].slug).toBe("b"); // higher impressions ranks first
  });

  it("respects the limit and is deterministic", () => {
    const entries = [
      entry({ slug: "a" }),
      entry({ slug: "b" }),
      entry({ slug: "c" }),
    ];
    const first = buildWorklist(entries, new Map(), { limit: 2 });
    expect(first.items).toHaveLength(2);
    expect(first).toEqual(buildWorklist(entries, new Map(), { limit: 2 }));
  });
});
