import { describe, expect, it } from "vitest";

import { buildAgentsReport } from "../apps/web/src/lib/agents-stats";
import {
  buildReportDataset,
  REPORT_PATHS,
} from "../apps/web/src/lib/data-reports";
import { ENTRIES, REGISTRY_GENERATED_AT } from "../apps/web/src/data/entries";
import type { Entry } from "../apps/web/src/types/registry";

function agent(partial: Partial<Entry>): Entry {
  return {
    category: "agents",
    trust: "trusted",
    source: "source-backed",
    tags: [],
    ...partial,
  } as Entry;
}

describe("buildAgentsReport (deterministic)", () => {
  const sample = [
    agent({ tags: ["testing"], safetyNotes: "x", privacyNotes: "y" }),
    agent({ tags: ["review"], safetyNotes: "x", prerequisites: ["node"] }),
    agent({ tags: ["sre"], privacyNotes: "y", source: "external" }),
    agent({ tags: ["testing"] }),
  ];

  it("is stable and reports the right totals/stats", () => {
    const a = buildAgentsReport(sample, "2026-06-20");
    const b = buildAgentsReport(sample, "2026-06-20");
    expect(a).toEqual(b);
    expect(a.slug).toBe("/state-of-ai-agents");
    expect(a.total).toBe(4);
    // 1 of 4 documents both safety + privacy
    expect(a.stats.find((s) => s.key === "documented")?.value).toBe(25);
  });

  it("breaks down safety/privacy disclosure into both/only/neither", () => {
    const model = buildAgentsReport(sample, "2026-06-20");
    const disclosure = model.dimensions.find((d) => d.key === "disclosure");
    expect(disclosure).toBeDefined();
    const byLabel = new Map(disclosure!.rows.map((r) => [r.label, r.count]));
    expect(byLabel.get("Safety & privacy")).toBe(1);
    expect(byLabel.get("Safety only")).toBe(1);
    expect(byLabel.get("Privacy only")).toBe(1);
    expect(byLabel.get("Neither documented")).toBe(1);
  });

  it("drops degenerate single-bucket dimensions", () => {
    const uniform = [
      agent({ tags: ["testing"], safetyNotes: "x", privacyNotes: "y" }),
      agent({ tags: ["review"], safetyNotes: "x", privacyNotes: "y" }),
    ];
    const model = buildAgentsReport(uniform, "2026-06-20");
    for (const dimension of model.dimensions) {
      expect(dimension.rows.length).toBeGreaterThan(1);
    }
    // disclosure collapses to a single bucket here -> dropped
    expect(model.dimensions.some((d) => d.key === "disclosure")).toBe(false);
  });
});

describe("report Dataset JSON-LD", () => {
  it("measures every stat and dimension", () => {
    const model = buildAgentsReport(
      [
        agent({ tags: ["testing"], safetyNotes: "x", privacyNotes: "y" }),
        agent({ tags: ["review"] }),
      ],
      "2026-06-20",
    );
    const ds = buildReportDataset(model) as Record<string, unknown>;
    expect(ds["@type"]).toBe("Dataset");
    const measured = ds.variableMeasured as string[];
    for (const stat of model.stats) expect(measured).toContain(stat.label);
    for (const dimension of model.dimensions)
      expect(measured).toContain(dimension.title);
  });
});

describe("sitemap manifest", () => {
  it("lists the new report so it gets indexed", () => {
    expect(REPORT_PATHS).toContain("/state-of-ai-agents");
    expect(new Set(REPORT_PATHS).size).toBe(REPORT_PATHS.length);
  });
});

describe("real registry data", () => {
  const asOf = String(REGISTRY_GENERATED_AT).slice(0, 10);
  const model = buildAgentsReport(ENTRIES, asOf);

  it("covers a substantial agents corpus with informative dimensions", () => {
    expect(model.total).toBeGreaterThan(50);
    expect(model.dimensions.length).toBeGreaterThanOrEqual(2);
    for (const dimension of model.dimensions) {
      expect(dimension.rows.length).toBeGreaterThan(1);
    }
    // eslint-disable-next-line no-console
    console.log(
      "agents report dimensions:",
      model.dimensions.map((d) => `${d.key}(${d.rows.length})`).join(", "),
      "| stats:",
      model.stats.map((s) => `${s.key}=${s.value}`).join(", "),
    );
  });
});
