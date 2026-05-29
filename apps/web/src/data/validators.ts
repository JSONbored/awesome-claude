import { ENTRIES } from "@/data/entries";
import type { Category, Entry } from "@/types/registry";

export type Expertise =
  | "MCP"
  | "Hooks"
  | "Skills"
  | "Commands"
  | "Statuslines"
  | "Security"
  | "Privacy"
  | "Rules";

export interface ReviewCoverage {
  id: Expertise;
  label: string;
  description: string;
  entries: number;
  reviewed: number;
  sourceBacked: number;
  withSafetyNotes: number;
  withPrivacyNotes: number;
  needsAttention: Entry[];
}

const RISK_CATEGORIES = new Set<Category>(["mcp", "hooks", "skills", "commands", "statuslines"]);

export const EXPERTISE_OPTIONS: Expertise[] = [
  "MCP",
  "Hooks",
  "Skills",
  "Commands",
  "Statuslines",
  "Rules",
  "Security",
  "Privacy",
];

const COVERAGE_DEFS: Array<{
  id: Expertise;
  label: string;
  description: string;
  matches: (entry: Entry) => boolean;
}> = [
  {
    id: "MCP",
    label: "MCP",
    description: "MCP servers and auth-bearing tool bridges.",
    matches: (entry) => entry.category === "mcp",
  },
  {
    id: "Hooks",
    label: "Hooks",
    description: "Lifecycle hooks that can run local commands.",
    matches: (entry) => entry.category === "hooks",
  },
  {
    id: "Skills",
    label: "Skills",
    description: "Claude Skills and capability packs.",
    matches: (entry) => entry.category === "skills",
  },
  {
    id: "Commands",
    label: "Commands",
    description: "Slash commands and command packs.",
    matches: (entry) => entry.category === "commands",
  },
  {
    id: "Statuslines",
    label: "Statuslines",
    description: "Shell/UI statusline integrations.",
    matches: (entry) => entry.category === "statuslines",
  },
  {
    id: "Rules",
    label: "Rules",
    description: "CLAUDE.md, AGENTS.md, editor rules, and configs.",
    matches: (entry) => entry.category === "rules",
  },
  {
    id: "Security",
    label: "Security",
    description: "Entries needing runtime, install, file, or credential scrutiny.",
    matches: (entry) =>
      RISK_CATEGORIES.has(entry.category) ||
      Boolean(entry.installCommand || entry.downloadUrl || entry.configSnippet),
  },
  {
    id: "Privacy",
    label: "Privacy",
    description:
      "Entries that should disclose data flow, credentials, logs, or third-party requests.",
    matches: (entry) =>
      RISK_CATEGORIES.has(entry.category) ||
      entry.tags.some((tag) => /auth|api|data|privacy/i.test(tag)),
  },
];

function needsAttention(entry: Entry) {
  if (entry.source === "unverified") return true;
  if (!entry.reviewed) return true;
  if (RISK_CATEGORIES.has(entry.category) && !entry.safetyNotes && !entry.safetyNotesList?.length)
    return true;
  if (
    (entry.category === "mcp" || entry.category === "skills") &&
    !entry.privacyNotes &&
    !entry.privacyNotesList?.length
  )
    return true;
  return false;
}

function pct(value: number, total: number) {
  return total ? Math.round((value / total) * 100) : 0;
}

export const REVIEW_COVERAGE: ReviewCoverage[] = COVERAGE_DEFS.map((def) => {
  const entries = ENTRIES.filter(def.matches);
  return {
    id: def.id,
    label: def.label,
    description: def.description,
    entries: entries.length,
    reviewed: entries.filter((entry) => entry.reviewed).length,
    sourceBacked: entries.filter((entry) => entry.source !== "unverified").length,
    withSafetyNotes: entries.filter((entry) =>
      Boolean(entry.safetyNotes || entry.safetyNotesList?.length),
    ).length,
    withPrivacyNotes: entries.filter((entry) =>
      Boolean(entry.privacyNotes || entry.privacyNotesList?.length),
    ).length,
    needsAttention: entries.filter(needsAttention).slice(0, 5),
  };
});

export const REVIEW_SUMMARY = {
  total: ENTRIES.length,
  reviewed: ENTRIES.filter((entry) => entry.reviewed).length,
  sourceBacked: ENTRIES.filter((entry) => entry.source !== "unverified").length,
  withSafetyNotes: ENTRIES.filter((entry) =>
    Boolean(entry.safetyNotes || entry.safetyNotesList?.length),
  ).length,
  withPrivacyNotes: ENTRIES.filter((entry) =>
    Boolean(entry.privacyNotes || entry.privacyNotesList?.length),
  ).length,
  needsAttention: ENTRIES.filter(needsAttention).length,
  publicRosterAvailable: false,
  pct,
};

export const RECENT_REVIEWED = ENTRIES.filter((entry) => entry.reviewed && entry.reviewedAt)
  .sort((left, right) => String(right.reviewedAt).localeCompare(String(left.reviewedAt)))
  .slice(0, 8);
