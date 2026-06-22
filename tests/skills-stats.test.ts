import { describe, expect, it } from "vitest";

import { buildSkillsReport } from "../apps/web/src/lib/skills-stats";
import {
  buildReportDataset,
  REPORT_PATHS,
  tagDistribution,
} from "../apps/web/src/lib/data-reports";
import { ENTRIES, REGISTRY_GENERATED_AT } from "../apps/web/src/data/entries";
import type { Entry } from "../apps/web/src/types/registry";

function skill(partial: Partial<Entry>): Entry {
  return {
    category: "skills",
    trust: "trusted",
    source: "source-backed",
    tags: [],
    ...partial,
  } as Entry;
}

describe("tagDistribution", () => {
  it("ranks tags by frequency and honours the exclude set", () => {
    const entries = [
      { tags: ["Testing", "skills"] },
      { tags: ["testing", "linting"] },
      { tags: ["skills"] },
    ];
    const rows = tagDistribution(entries, {
      exclude: new Set(["skills"]),
      limit: 5,
    });
    expect(rows[0]).toEqual({ label: "testing", count: 2, pct: 67 });
    expect(rows.some((r) => r.label === "skills")).toBe(false);
  });
});

describe("buildSkillsReport (deterministic)", () => {
  const sample = [
    skill({
      skillType: "capability-pack",
      skillLevel: "expert",
      verificationStatus: "validated",
      packageVerified: true,
      tags: ["testing"],
    }),
    skill({
      skillType: "general",
      skillLevel: "advanced",
      verificationStatus: "draft",
      tags: ["docs"],
    }),
  ];

  it("is stable and reports the right totals/stats", () => {
    const a = buildSkillsReport(sample, "2026-06-20");
    const b = buildSkillsReport(sample, "2026-06-20");
    expect(a).toEqual(b);
    expect(a.slug).toBe("/state-of-agent-skills");
    expect(a.total).toBe(2);
    expect(a.stats.find((s) => s.key === "validated")?.value).toBe(50);
    expect(a.stats.find((s) => s.key === "packs")?.value).toBe(50);
  });

  it("drops degenerate single-bucket dimensions", () => {
    const uniform = [
      skill({ skillType: "general", tags: ["testing"] }),
      skill({ skillType: "general", tags: ["docs"] }),
    ];
    const model = buildSkillsReport(uniform, "2026-06-20");
    for (const dimension of model.dimensions) {
      expect(dimension.rows.length).toBeGreaterThan(1);
    }
    // skill-type is uniform here -> must be dropped
    expect(model.dimensions.some((d) => d.key === "skill-type")).toBe(false);
  });
});

describe("report Dataset JSON-LD", () => {
  it("measures every stat and dimension", () => {
    const model = buildSkillsReport(
      [
        skill({ skillType: "capability-pack", tags: ["testing"] }),
        skill({ skillType: "general", tags: ["docs"] }),
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
    expect(REPORT_PATHS).toContain("/state-of-agent-skills");
    expect(new Set(REPORT_PATHS).size).toBe(REPORT_PATHS.length);
  });
});

describe("real registry data", () => {
  const asOf = String(REGISTRY_GENERATED_AT).slice(0, 10);
  const model = buildSkillsReport(ENTRIES, asOf);

  it("covers a substantial skills corpus with informative dimensions", () => {
    expect(model.total).toBeGreaterThan(50);
    expect(model.dimensions.length).toBeGreaterThanOrEqual(2);
    for (const dimension of model.dimensions) {
      expect(dimension.rows.length).toBeGreaterThan(1);
    }
    // eslint-disable-next-line no-console
    console.log(
      "skills report dimensions:",
      model.dimensions.map((d) => `${d.key}(${d.rows.length})`).join(", "),
      "| stats:",
      model.stats.map((s) => `${s.key}=${s.value}`).join(", "),
    );
  });
});
