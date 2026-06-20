import { describe, expect, it } from "vitest";

import {
  buildHooksReport,
  hookEventDistribution,
  hookEventOf,
  HOOK_EVENTS,
} from "../apps/web/src/lib/hooks-stats";
import {
  buildReportDataset,
  REPORT_PATHS,
} from "../apps/web/src/lib/data-reports";
import { ENTRIES, REGISTRY_GENERATED_AT } from "../apps/web/src/data/entries";
import type { Entry } from "../apps/web/src/types/registry";

function hook(partial: Partial<Entry>): Entry {
  return {
    category: "hooks",
    trust: "trusted",
    source: "source-backed",
    ...partial,
  } as Entry;
}

describe("hook event classification", () => {
  it("reads the trigger field, defaulting to Unspecified", () => {
    expect(hookEventOf(hook({ trigger: "PostToolUse" }))).toBe("PostToolUse");
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
    expect(distinct).toBe(2); // Unspecified does not count as a covered event
    expect(rows[0]).toEqual({ label: "PostToolUse", count: 2, pct: 50 });
    expect(rows[rows.length - 1].label).toBe("Unspecified");
  });
});

describe("buildHooksReport (deterministic)", () => {
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
    expect(a).toEqual(b); // deterministic

    expect(a.total).toBe(4);
    expect(a.slug).toBe("/state-of-claude-code-hooks");
    const events = a.dimensions.find((d) => d.key === "hook-events");
    expect(events?.rows[0].label).toBe("PostToolUse");
    expect(a.stats.find((s) => s.key === "total")?.value).toBe(4);
  });

  it("drops degenerate single-bucket dimensions", () => {
    // all identical trust/source -> only the events dimension survives
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
});

describe("report Dataset JSON-LD", () => {
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
    // de-duplicated
    expect(new Set(measured).size).toBe(measured.length);
  });
});

describe("sitemap manifest", () => {
  it("lists the new report so it gets indexed", () => {
    expect(REPORT_PATHS).toContain("/state-of-claude-code-hooks");
    expect(new Set(REPORT_PATHS).size).toBe(REPORT_PATHS.length); // no dupes
  });
});

describe("real registry data", () => {
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
    // eslint-disable-next-line no-console
    console.log(
      "hooks report dimensions:",
      model.dimensions.map((d) => `${d.key}(${d.rows.length})`).join(", "),
      "| stats:",
      model.stats.map((s) => `${s.key}=${s.value}`).join(", "),
    );
  });
});
