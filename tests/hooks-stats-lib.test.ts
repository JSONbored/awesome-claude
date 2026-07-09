import { describe, expect, it } from "vitest";

import {
  buildHooksReport,
  complexityDistribution,
  hookEventDistribution,
  hookEventOf,
  HOOK_EVENTS,
  prerequisiteDistribution,
  useCaseDistribution,
} from "@/lib/hooks-stats-lib";
import { buildHooksReport as buildHooksReportFromWrapper } from "@/lib/hooks-stats";
import { buildReportDataset, REPORT_PATHS } from "@/lib/data-reports";
import { ENTRIES, REGISTRY_GENERATED_AT } from "@/data/entries";
import type { Entry } from "@/types/registry";

function hook(partial: Partial<Entry>): Entry {
  return {
    category: "hooks",
    trust: "trusted",
    source: "source-backed",
    ...partial,
  } as Entry;
}

describe("hooks-stats-lib hook event classification", () => {
  it("reads the trigger field, defaulting to Unspecified", () => {
    expect(hookEventOf(hook({ trigger: "PostToolUse" }))).toBe("PostToolUse");
    expect(hookEventOf(hook({ trigger: "  Stop  " }))).toBe("Stop");
    expect(hookEventOf(hook({}))).toBe("Unspecified");
  });

  it("ranks events by frequency with Unspecified last", () => {
    const hooks = [
      hook({ trigger: "PostToolUse" }),
      hook({ trigger: "PostToolUse" }),
      hook({ trigger: "Stop" }),
      hook({}),
    ];
    const { rows, total, distinct } = hookEventDistribution(hooks);
    expect(total).toBe(4);
    expect(distinct).toBe(2);
    expect(rows[0]).toEqual({ label: "PostToolUse", count: 2, pct: 50 });
    expect(rows[rows.length - 1].label).toBe("Unspecified");
  });

  it("treats unknown trigger labels as lifecycle tail ordering", () => {
    const hooks = [
      hook({ trigger: "CustomEvent" }),
      hook({ trigger: "CustomEvent" }),
      hook({ trigger: "Stop" }),
    ];
    const { rows } = hookEventDistribution(hooks);
    expect(rows[0].label).toBe("CustomEvent");
    expect(rows[1].label).toBe("Stop");
  });

  it("exposes the canonical hook lifecycle order constant", () => {
    expect(HOOK_EVENTS).toEqual([
      "PreToolUse",
      "PostToolUse",
      "UserPromptSubmit",
      "Notification",
      "Stop",
      "SubagentStop",
      "SessionStart",
    ]);
  });
});

describe("hooks-stats-lib use case and complexity distributions", () => {
  it("excludes mechanism tags from use-case distribution", () => {
    const hooks = [
      hook({ tags: ["hooks", "testing", "claude-code", "ci"] }),
      hook({ tags: ["CI", "testing"] }),
    ];
    const rows = useCaseDistribution(hooks, 10);
    expect(rows.map((row) => row.label)).toEqual(["ci", "testing"]);
    expect(rows.find((row) => row.label === "hooks")).toBeUndefined();
  });

  it("omits unscored hooks from complexity distribution", () => {
    const hooks = [
      hook({ difficultyScore: 1 }),
      hook({ difficultyScore: 4 }),
      hook({}),
    ];
    const rows = complexityDistribution(hooks);
    expect(rows.map((row) => row.label)).toEqual([
      "Simple (score 1–2)",
      "Moderate (score 3–4)",
    ]);
  });

  it("reports prerequisite buckets when both are present", () => {
    const hooks = [
      hook({ prerequisites: ["API key"] }),
      hook({ hasPrerequisites: true }),
      hook({}),
    ];
    const rows = prerequisiteDistribution(hooks);
    expect(rows).toEqual([
      { label: "Requires prerequisites", count: 2, pct: 67 },
      { label: "No prerequisites", count: 1, pct: 33 },
    ]);
  });
});

describe("hooks-stats-lib buildHooksReport (deterministic)", () => {
  const sample = [
    hook({
      trigger: "PostToolUse",
      safetyNotes: "runs shell",
      privacyNotes: "x",
    }),
    hook({ trigger: "PostToolUse", source: "first-party" }),
    hook({ trigger: "Stop", trust: "review" }),
    hook({ trigger: "PreToolUse", source: "external", trust: "limited" }),
  ];

  it("produces stable totals, stats, and an events dimension", () => {
    const a = buildHooksReport(sample, "2026-06-20");
    const b = buildHooksReport(sample, "2026-06-20");
    expect(a).toEqual(b);

    expect(a.total).toBe(4);
    expect(a.slug).toBe("/state-of-claude-code-hooks");
    expect(a.exportSlug).toBe("claude-code-hooks");
    const events = a.dimensions.find((d) => d.key === "hook-events");
    expect(events?.rows[0].label).toBe("PostToolUse");
    expect(a.stats.find((s) => s.key === "total")?.value).toBe(4);
  });

  it("counts hooks disclosing BOTH safety and privacy, not the min of each", () => {
    // Disjoint coverage: 2 disclose safety only, 2 privacy only, 0 disclose both.
    // The old Math.min(pct(safety), pct(privacy)) reported 50%; the truth is 0%.
    const disjoint = [
      hook({ trigger: "PostToolUse", safetyNotes: "runs shell" }),
      hook({ trigger: "Stop", safetyNotes: "writes files" }),
      hook({ trigger: "PreToolUse", privacyNotes: "reads env" }),
      hook({ trigger: "Notification", privacyNotes: "sends telemetry" }),
    ];
    const disjointModel = buildHooksReport(disjoint, "2026-06-20");
    expect(
      disjointModel.stats.find((s) => s.key === "safety-privacy")?.value,
    ).toBe(0);

    // Overlapping coverage: exactly 1 of 4 discloses both -> 25%.
    const mixed = [
      hook({ trigger: "PostToolUse", safetyNotes: "s", privacyNotes: "p" }),
      hook({ trigger: "Stop", safetyNotes: "s" }),
      hook({ trigger: "PreToolUse", privacyNotes: "p" }),
      hook({ trigger: "Notification" }),
    ];
    const mixedModel = buildHooksReport(mixed, "2026-06-20");
    expect(
      mixedModel.stats.find((s) => s.key === "safety-privacy")?.value,
    ).toBe(25);
  });

  it("drops degenerate single-bucket dimensions", () => {
    const uniform = [
      hook({ trigger: "PostToolUse" }),
      hook({ trigger: "Stop" }),
    ];
    const model = buildHooksReport(uniform, "2026-06-20");
    for (const dimension of model.dimensions) {
      expect(dimension.rows.length).toBeGreaterThan(1);
    }
    expect(model.dimensions.some((d) => d.key === "hook-events")).toBe(true);
  });

  it("returns an empty report when the registry has no hooks", () => {
    const model = buildHooksReport(
      [hook({ category: "skills", trigger: "Stop" }) as Entry],
      "2026-06-20",
    );
    expect(model.total).toBe(0);
    expect(model.dimensions).toEqual([]);
    expect(model.stats.find((s) => s.key === "total")?.value).toBe(0);
  });

  it("keeps the public wrapper re-export aligned with the lib module", () => {
    const fromLib = buildHooksReport(sample, "2026-06-20");
    const fromWrapper = buildHooksReportFromWrapper(sample, "2026-06-20");
    expect(fromWrapper).toEqual(fromLib);
  });
});

describe("hooks-stats-lib report Dataset JSON-LD", () => {
  const model = buildHooksReport(
    [
      hook({ trigger: "PostToolUse" }),
      hook({ trigger: "Stop", source: "external" }),
    ],
    "2026-06-20",
  );

  it("is a Dataset that measures every stat and dimension", () => {
    const ds = buildReportDataset(model) as Record<string, unknown>;
    expect(ds["@type"]).toBe("Dataset");
    expect(ds.license).toBe("https://creativecommons.org/licenses/by/4.0/");
    expect(ds.dateModified).toBe("2026-06-20");
    const measured = ds.variableMeasured as string[];
    for (const stat of model.stats) expect(measured).toContain(stat.label);
    for (const dimension of model.dimensions)
      expect(measured).toContain(dimension.title);
    expect(new Set(measured).size).toBe(measured.length);
  });
});

describe("hooks-stats-lib sitemap manifest", () => {
  it("lists the new report so it gets indexed", () => {
    expect(REPORT_PATHS).toContain("/state-of-claude-code-hooks");
    expect(new Set(REPORT_PATHS).size).toBe(REPORT_PATHS.length);
  });
});

describe("hooks-stats-lib real registry data", () => {
  const asOf = String(REGISTRY_GENERATED_AT).slice(0, 10);
  const model = buildHooksReport(ENTRIES, asOf);

  it("PostToolUse is the most common hook event", () => {
    expect(model.total).toBeGreaterThan(50);
    const events = model.dimensions.find((d) => d.key === "hook-events");
    expect(events).toBeDefined();
    expect(events!.rows[0].label).toBe("PostToolUse");
    expect(events!.rows.length).toBeGreaterThanOrEqual(4);
  });

  it("every published dimension is informative (>1 bucket)", () => {
    for (const dimension of model.dimensions) {
      expect(dimension.rows.length).toBeGreaterThan(1);
    }
  });
});
