import { pctOf, type DistRow } from "@/components/data-report";
import type { ReportDimension, ReportModel } from "@/lib/data-reports";
import {
  SOURCE_LABEL,
  TRUST_LABEL,
  type Entry,
  type HookTrigger,
  type SourceStatus,
  type TrustLevel,
} from "@/types/registry";

/** Claude Code hook events in lifecycle order (matches the registry schema). */
export const HOOK_EVENTS: HookTrigger[] = [
  "PreToolUse",
  "PostToolUse",
  "UserPromptSubmit",
  "Notification",
  "Stop",
  "SubagentStop",
  "SessionStart",
];

const UNSPECIFIED = "Unspecified";

/** The hook event a hook fires on, or `Unspecified` when not declared. */
export function hookEventOf(entry: Entry): string {
  const trigger = entry.trigger?.trim();
  return trigger ? trigger : UNSPECIFIED;
}

function hasNotes(value?: string | string[] | null): boolean {
  if (Array.isArray(value)) return value.some((item) => item.trim().length > 0);
  return typeof value === "string" ? value.trim().length > 0 : false;
}

/**
 * Distribution of hook events across the given hooks, ordered by frequency
 * (then lifecycle order as a stable tiebreak), with `Unspecified` last.
 */
export function hookEventDistribution(hooks: ReadonlyArray<Entry>): {
  rows: DistRow[];
  total: number;
  distinct: number;
} {
  const total = hooks.length;
  const counts = new Map<string, number>();
  for (const hook of hooks) {
    const event = hookEventOf(hook);
    counts.set(event, (counts.get(event) ?? 0) + 1);
  }
  const orderOf = (label: string) => {
    if (label === UNSPECIFIED) return HOOK_EVENTS.length + 1;
    const index = HOOK_EVENTS.indexOf(label as HookTrigger);
    return index === -1 ? HOOK_EVENTS.length : index;
  };
  const rows = [...counts.entries()]
    .map(([label, count]) => ({ label, count, pct: pctOf(count, total) }))
    .sort((a, b) => b.count - a.count || orderOf(a.label) - orderOf(b.label));
  const distinct = [...counts.keys()].filter((k) => k !== UNSPECIFIED).length;
  return { rows, total, distinct };
}

function labelledDistribution<T extends string>(
  hooks: ReadonlyArray<Entry>,
  order: readonly T[],
  valueOf: (entry: Entry) => T,
  labelOf: (value: T) => string,
): DistRow[] {
  const total = hooks.length;
  return order
    .map((value) => {
      const count = hooks.filter((hook) => valueOf(hook) === value).length;
      return { label: labelOf(value), count, pct: pctOf(count, total) };
    })
    .filter((row) => row.count > 0);
}

// Mechanism/category tags that describe *what a hook is* rather than what it
// automates — excluded so the use-case chart surfaces real tasks.
const MECHANISM_TAGS = new Set([
  "hooks",
  "hook",
  "stop-hook",
  "claude",
  "claude-code",
  "claude-code-hooks",
]);

/** Most common hook use cases (curated tags), as a top-N distribution. */
export function useCaseDistribution(hooks: ReadonlyArray<Entry>, limit = 10): DistRow[] {
  const total = hooks.length;
  const counts = new Map<string, number>();
  for (const hook of hooks) {
    for (const raw of hook.tags ?? []) {
      const tag = raw.trim().toLowerCase();
      if (!tag || MECHANISM_TAGS.has(tag)) continue;
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([label, count]) => ({ label, count, pct: pctOf(count, total) }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
    .slice(0, limit);
}

/** Implementation complexity buckets from the registry difficulty score. */
export function complexityDistribution(hooks: ReadonlyArray<Entry>): DistRow[] {
  const total = hooks.length;
  const buckets: Array<[string, (score: number) => boolean]> = [
    ["Simple (score 1–2)", (s) => s <= 2],
    ["Moderate (score 3–4)", (s) => s >= 3 && s <= 4],
    ["Involved (score 5+)", (s) => s >= 5],
  ];
  return buckets
    .map(([label, test]) => {
      const count = hooks.filter(
        (h) => typeof h.difficultyScore === "number" && test(h.difficultyScore),
      ).length;
      return { label, count, pct: pctOf(count, total) };
    })
    .filter((row) => row.count > 0);
}

/** Whether a hook needs setup prerequisites before it runs. */
export function prerequisiteDistribution(hooks: ReadonlyArray<Entry>): DistRow[] {
  const total = hooks.length;
  const requires = hooks.filter(
    (h) => (h.prerequisites?.length ?? 0) > 0 || h.hasPrerequisites === true,
  ).length;
  const none = total - requires;
  return [
    { label: "Requires prerequisites", count: requires, pct: pctOf(requires, total) },
    { label: "No prerequisites", count: none, pct: pctOf(none, total) },
  ].filter((row) => row.count > 0);
}

const TRUST_ORDER: TrustLevel[] = ["trusted", "review", "limited", "blocked"];
const SOURCE_ORDER: SourceStatus[] = ["first-party", "source-backed", "external", "unverified"];

/**
 * Build the "State of Claude Code Hooks" report model from the full registry.
 * Deterministic: identical input always yields identical output. Degenerate
 * single-value dimensions are dropped so the report never shows an
 * uninformative one-row chart.
 */
export function buildHooksReport(entries: ReadonlyArray<Entry>, asOf: string): ReportModel {
  const hooks = entries.filter((entry) => entry.category === "hooks");
  const total = hooks.length;

  const events = hookEventDistribution(hooks);
  const withSafety = hooks.filter((h) => hasNotes(h.safetyNotesList ?? h.safetyNotes)).length;
  const withPrivacy = hooks.filter((h) => hasNotes(h.privacyNotesList ?? h.privacyNotes)).length;
  const simple = hooks.filter(
    (h) => typeof h.difficultyScore === "number" && h.difficultyScore <= 2,
  ).length;

  const candidateDimensions: ReportDimension[] = [
    {
      key: "hook-events",
      title: "Hook event distribution",
      help: "Which Claude Code lifecycle event each hook fires on, taken from the registry trigger field.",
      rows: events.rows,
    },
    {
      key: "use-cases",
      title: "Most common hook use cases",
      help: "The tasks hooks automate, from their registry tags (mechanism tags like “hooks” excluded). A hook can cover several use cases.",
      rows: useCaseDistribution(hooks),
    },
    {
      key: "complexity",
      title: "Implementation complexity",
      help: "Setup/maintenance complexity from the registry difficulty score; unscored hooks are omitted.",
      rows: complexityDistribution(hooks),
    },
    {
      key: "prerequisites",
      title: "Setup prerequisites",
      help: "Whether a hook needs prerequisites (accounts, tools, or config) before it runs.",
      rows: prerequisiteDistribution(hooks),
    },
    {
      key: "source-provenance",
      title: "Source provenance distribution",
      help: "How each hook's source is verified, from first-party to unverified.",
      rows: labelledDistribution(
        hooks,
        SOURCE_ORDER,
        (h) => h.source,
        (value) => SOURCE_LABEL[value],
      ),
    },
    {
      key: "trust-level",
      title: "Trust-level distribution",
      help: "Reviewed trust level applied by the registry's risk policy.",
      rows: labelledDistribution(
        hooks,
        TRUST_ORDER,
        (h) => h.trust,
        (value) => TRUST_LABEL[value],
      ),
    },
  ];

  // Drop degenerate dimensions (a single bucket carries no information).
  const dimensions = candidateDimensions.filter((d) => d.rows.length > 1);

  return {
    slug: "/state-of-claude-code-hooks",
    exportSlug: "claude-code-hooks",
    title: "State of Claude Code Hooks 2026",
    description:
      "A data report on Claude Code hooks: how many there are, which lifecycle events they fire on (PreToolUse, PostToolUse, Stop, and more), how their source is verified, and how consistently they disclose safety and privacy behavior — computed from the HeyClaude registry.",
    keywords: [
      "Claude Code hooks",
      "hook events",
      "PostToolUse",
      "PreToolUse",
      "Claude automation",
      "AI tooling",
    ],
    asOf,
    total,
    stats: [
      {
        key: "total",
        label: "Total hooks",
        value: total,
        hint: "registry",
      },
      {
        key: "events",
        label: "Hook events covered",
        value: events.distinct,
        hint: "lifecycle",
      },
      {
        key: "safety-privacy",
        label: "Disclose safety & privacy",
        value: Math.min(pctOf(withSafety, total), pctOf(withPrivacy, total)),
        hint: "%",
      },
      {
        key: "simple",
        label: "Simple to set up",
        value: pctOf(simple, total),
        hint: "%",
      },
    ],
    dimensions,
  };
}
