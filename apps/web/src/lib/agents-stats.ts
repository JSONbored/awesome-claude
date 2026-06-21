import { pctOf, type DistRow } from "@/components/data-report";
import { tagDistribution, type ReportDimension, type ReportModel } from "@/lib/data-reports";
import {
  SOURCE_LABEL,
  TRUST_LABEL,
  type Entry,
  type SourceStatus,
  type TrustLevel,
} from "@/types/registry";

// Category/mechanism tags that describe *what an agent is* rather than what it
// does — excluded so the use-case chart surfaces real tasks.
const MECHANISM_TAGS = new Set([
  "agents",
  "agent",
  "subagent",
  "subagents",
  "claude",
  "claude-code",
]);

const TRUST_ORDER: TrustLevel[] = ["trusted", "review", "limited", "blocked"];
const SOURCE_ORDER: SourceStatus[] = ["first-party", "source-backed", "external", "unverified"];

function hasNotes(value?: string | string[] | null): boolean {
  if (Array.isArray(value)) return value.some((item) => item.trim().length > 0);
  return typeof value === "string" ? value.trim().length > 0 : false;
}

function labelledDistribution<T extends string>(
  agents: ReadonlyArray<Entry>,
  order: readonly T[],
  valueOf: (entry: Entry) => T | undefined,
  labelOf: (value: T) => string,
): DistRow[] {
  const total = agents.length;
  return order
    .map((value) => {
      const count = agents.filter((agent) => valueOf(agent) === value).length;
      return { label: labelOf(value), count, pct: pctOf(count, total) };
    })
    .filter((row) => row.count > 0);
}

/**
 * Build the "State of AI Agents" report model from the full registry.
 * Deterministic: identical input always yields identical output. Degenerate
 * single-value dimensions are dropped so the report never shows an
 * uninformative one-row chart.
 */
export function buildAgentsReport(entries: ReadonlyArray<Entry>, asOf: string): ReportModel {
  const agents = entries.filter((entry) => entry.category === "agents");
  const total = agents.length;

  const hasSafety = (a: Entry) => hasNotes(a.safetyNotesList ?? a.safetyNotes);
  const hasPrivacy = (a: Entry) => hasNotes(a.privacyNotesList ?? a.privacyNotes);
  const both = agents.filter((a) => hasSafety(a) && hasPrivacy(a)).length;
  const safetyOnly = agents.filter((a) => hasSafety(a) && !hasPrivacy(a)).length;
  const privacyOnly = agents.filter((a) => !hasSafety(a) && hasPrivacy(a)).length;
  const neither = total - both - safetyOnly - privacyOnly;

  const requires = agents.filter(
    (a) => (a.prerequisites?.length ?? 0) > 0 || a.hasPrerequisites === true,
  ).length;
  const ready = total - requires;
  const sourceBacked = agents.filter(
    (a) => a.source === "source-backed" || a.source === "first-party",
  ).length;

  const candidateDimensions: ReportDimension[] = [
    {
      key: "use-cases",
      title: "Most common agent use cases",
      help: "The work agents take on, from their registry tags (mechanism tags like “agents” excluded). An agent can cover several use cases.",
      rows: tagDistribution(agents, { exclude: MECHANISM_TAGS }),
    },
    {
      key: "disclosure",
      title: "Safety & privacy disclosure",
      help: "Agents act with real autonomy, so disclosure matters. How many document both their safety and privacy behavior, one, or neither.",
      rows: [
        { label: "Safety & privacy", count: both, pct: pctOf(both, total) },
        { label: "Safety only", count: safetyOnly, pct: pctOf(safetyOnly, total) },
        { label: "Privacy only", count: privacyOnly, pct: pctOf(privacyOnly, total) },
        { label: "Neither documented", count: neither, pct: pctOf(neither, total) },
      ].filter((row) => row.count > 0),
    },
    {
      key: "prerequisites",
      title: "Setup prerequisites",
      help: "Whether an agent needs prerequisites (accounts, tools, or config) before it runs.",
      rows: [
        { label: "Requires prerequisites", count: requires, pct: pctOf(requires, total) },
        { label: "No prerequisites", count: ready, pct: pctOf(ready, total) },
      ].filter((row) => row.count > 0),
    },
    {
      key: "source-provenance",
      title: "Source provenance distribution",
      help: "How each agent's source is verified, from first-party to unverified.",
      rows: labelledDistribution(
        agents,
        SOURCE_ORDER,
        (a) => a.source,
        (value) => SOURCE_LABEL[value],
      ),
    },
    {
      key: "trust-level",
      title: "Trust-level distribution",
      help: "Reviewed trust level applied by the registry's risk policy.",
      rows: labelledDistribution(
        agents,
        TRUST_ORDER,
        (a) => a.trust,
        (value) => TRUST_LABEL[value],
      ),
    },
  ];

  // Drop degenerate dimensions (a single bucket carries no information).
  const dimensions = candidateDimensions.filter((d) => d.rows.length > 1);

  return {
    slug: "/state-of-ai-agents",
    exportSlug: "ai-agents",
    title: "State of AI Agents 2026",
    description:
      "A data report on AI agents for Claude and coding workflows: how many there are, what work they take on, how consistently they disclose safety and privacy behavior, what setup they need, and how their source is verified — computed from the HeyClaude registry.",
    keywords: [
      "AI agents",
      "Claude agents",
      "Claude Code subagents",
      "autonomous agents",
      "AI coding agents",
      "AI tooling",
    ],
    asOf,
    total,
    stats: [
      { key: "total", label: "Total agents", value: total, hint: "registry" },
      {
        key: "documented",
        label: "Document safety & privacy",
        value: pctOf(both, total),
        hint: "%",
      },
      {
        key: "source-backed",
        label: "Source-backed",
        value: pctOf(sourceBacked, total),
        hint: "%",
      },
      {
        key: "ready",
        label: "Ready to use",
        value: pctOf(ready, total),
        hint: "%",
      },
    ],
    dimensions,
  };
}
