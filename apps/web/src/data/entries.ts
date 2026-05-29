import atlasRegistry from "@/generated/atlas-registry.json";
import type { Category, Entry } from "@/types/registry";
import { buildEntry, type RegistryEntry } from "@/data/entry-normalize";

type RegistryChangelogEntry = {
  category: string;
  slug: string;
  title: string;
  dateAdded?: string;
  type?: string;
};

const registryEntries = (atlasRegistry.entries ?? []) as RegistryEntry[];
const registryChangelog = (atlasRegistry.changelog ?? []) as RegistryChangelogEntry[];
const generatedAt = atlasRegistry.generatedAt;
export const REGISTRY_GENERATED_AT = generatedAt;

export const ENTRIES: Entry[] = registryEntries.map(buildEntry);

export const BRIEF_ISSUES = registryChangelog.slice(0, 6).map((item, index) => ({
  slug: `registry-brief-${String(index + 1).padStart(3, "0")}`,
  number: registryChangelog.length - index,
  date: item.dateAdded ?? generatedAt.slice(0, 10),
  title: `${item.title} joined the registry`,
  summary: `${item.category}/${item.slug} was ${item.type ?? "updated"} in the latest registry snapshot.`,
  tags: [item.category, item.type ?? "updated"],
}));

export interface BestPick {
  ref: string;
  why: string;
  reachForInstead?: string;
}

export interface BestList {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  curator: string;
  updatedAt: string;
  count: number;
  intro: string;
  picks: BestPick[];
}

type BestListSeed = {
  slug: string;
  title: string;
  subtitle: string;
  category: Category;
  tags?: string[];
  intro: string;
};

const BEST_LIST_SEEDS: BestListSeed[] = [
  {
    slug: "best-mcp-for-databases",
    title: "Best MCP servers for databases",
    subtitle: "Database bridges with source links, install payloads, and review-first metadata.",
    category: "mcp",
    tags: ["database", "postgres", "redis", "airtable", "data"],
    intro:
      "Start with MCP servers that expose clear setup commands and source-backed metadata. Treat auth-bearing servers as review-first until credentials, logs, and scopes are verified.",
  },
  {
    slug: "best-code-review-workflows",
    title: "Best Claude workflows for code review",
    subtitle: "Agents, commands, hooks, and rules for reviewing changes before they ship.",
    category: "agents",
    tags: ["code-review", "review", "security", "quality"],
    intro:
      "These picks are selected for review-oriented workflows: diff explanation, security checks, quality gates, and contributor feedback loops.",
  },
  {
    slug: "best-safety-hooks",
    title: "Best safety hooks",
    subtitle: "Hooks that help bound risky agent actions.",
    category: "hooks",
    tags: ["safety", "security", "backup", "validation", "secret"],
    intro:
      "Hooks can block or reshape dangerous automation. Review the trigger, file access, and failure mode before enabling any hook in a real project.",
  },
  {
    slug: "best-claude-skills",
    title: "Best Claude skills and capability packs",
    subtitle: "Installable skills with source-backed metadata and practical workflow focus.",
    category: "skills",
    tags: ["skill", "capability", "codex", "automation", "developer-tooling"],
    intro:
      "Skill entries are strongest when they include source, install path, and clear behavioral scope. Use these as starting points, not blanket install approvals.",
  },
  {
    slug: "best-claude-commands",
    title: "Best Claude Code slash commands",
    subtitle: "Commands for debugging, reviewing, refactoring, and generating project context.",
    category: "commands",
    tags: ["debugging", "review", "refactoring", "documentation", "performance"],
    intro:
      "Slash commands should be small, predictable, and easy to inspect. Prefer commands that make their inputs and expected output obvious.",
  },
  {
    slug: "best-statuslines",
    title: "Best Claude Code statuslines",
    subtitle: "Statusline scripts for model, cost, timer, and workflow visibility.",
    category: "statuslines",
    tags: ["statusline", "monitoring", "cost", "timer", "performance"],
    intro:
      "Statuslines run inside local developer environments. Check script language, dependencies, and whether the entry discloses local file or telemetry behavior.",
  },
];

function entryScore(entry: Entry, tags: string[] = []) {
  const tagSet = new Set(
    [...(entry.tags ?? []), ...(entry.keywords ?? [])].map((tag) => tag.toLowerCase()),
  );
  const tagScore = tags.reduce((score, tag) => score + (tagSet.has(tag.toLowerCase()) ? 10 : 0), 0);
  return (
    tagScore +
    (entry.packageVerified ? 12 : 0) +
    (entry.safetyNotes ? 8 : 0) +
    (entry.privacyNotes ? 4 : 0) +
    (entry.source === "first-party" ? 6 : entry.source === "source-backed" ? 4 : 0) +
    (entry.reviewed ? 3 : 0)
  );
}

function makeBestPick(entry: Entry): BestPick {
  const reasons = [
    entry.packageVerified ? "maintainer-built package" : undefined,
    entry.safetyNotes ? "safety notes present" : undefined,
    entry.privacyNotes ? "privacy notes present" : undefined,
    entry.source !== "unverified" ? `${entry.source} source posture` : undefined,
  ].filter(Boolean);

  return {
    ref: `${entry.category}/${entry.slug}`,
    why: reasons.length
      ? `${entry.title} is included because it has ${reasons.join(", ")}.`
      : `${entry.title} is relevant to this use case, but should be reviewed before adoption.`,
    reachForInstead:
      entry.trust !== "trusted"
        ? "If this will touch credentials, local files, or production systems, inspect the upstream source first."
        : undefined,
  };
}

export const BEST_LISTS: BestList[] = BEST_LIST_SEEDS.map((seed) => {
  const candidates = ENTRIES.filter((entry) => {
    if (entry.category === seed.category) return true;
    const tagSet = new Set(
      [...(entry.tags ?? []), ...(entry.keywords ?? [])].map((tag) => tag.toLowerCase()),
    );
    return seed.tags?.some((tag) => tagSet.has(tag.toLowerCase())) ?? false;
  })
    .sort((a, b) => entryScore(b, seed.tags) - entryScore(a, seed.tags))
    .slice(0, 6);

  return {
    slug: seed.slug,
    title: seed.title,
    subtitle: seed.subtitle,
    category: seed.category,
    curator: "@heyclaude-editors",
    updatedAt: generatedAt.slice(0, 10),
    count: candidates.length,
    intro: seed.intro,
    picks: candidates.map(makeBestPick),
  };
}).filter((list) => list.picks.length > 0);

export const QUALITY_STATS = {
  totalEntries: ENTRIES.length,
  sourceBacked: ENTRIES.filter((entry) => entry.source !== "unverified").length,
  withSafetyNotes: ENTRIES.filter((entry) => entry.safetyNotes).length,
  reviewed: ENTRIES.filter((entry) => entry.reviewed).length,
  trusted: ENTRIES.filter((entry) => entry.trust === "trusted").length,
  reviewFirst: ENTRIES.filter((entry) => entry.trust === "review").length,
};
