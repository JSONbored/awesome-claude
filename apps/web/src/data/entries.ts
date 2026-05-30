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

export const WEEKLY_BRIEF = {
  generatedAt,
  issueNumber: registryChangelog.length,
  date: registryChangelog[0]?.dateAdded ?? generatedAt.slice(0, 10),
  newEntries: registryChangelog
    .filter((item) => item.type === "added")
    .slice(0, 6)
    .map((item) => ({
      ref: `${item.category}/${item.slug}`,
      title: item.title,
      date: item.dateAdded ?? generatedAt.slice(0, 10),
    })),
  trustedInstalls: ENTRIES.filter((entry) => entry.packageVerified || entry.trust === "trusted")
    .slice(0, 6)
    .map((entry) => ({
      ref: `${entry.category}/${entry.slug}`,
      title: entry.title,
      reason: entry.packageVerified
        ? "maintainer-built package metadata"
        : "strong registry trust signals",
    })),
  sourceBackedPicks: ENTRIES.filter(
    (entry) => entry.source !== "unverified" && (entry.safetyNotes || entry.privacyNotes),
  )
    .slice(0, 6)
    .map((entry) => ({
      ref: `${entry.category}/${entry.slug}`,
      title: entry.title,
      reason: "source-backed with safety or privacy notes",
    })),
  notableChanges: BRIEF_ISSUES.slice(0, 4),
};

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
    slug: "agent-workflow-starter-kits",
    title: "Best agent workflow starter kits",
    subtitle:
      "Practical bundles for getting Claude Code, Codex, MCP, hooks, and commands into a usable workflow.",
    category: "collections",
    tags: ["workflow", "starter", "agent", "automation", "claude-code"],
    intro:
      "Use these as starting points for a working agent setup. Review every included entry before installing anything that touches files, credentials, networks, or production systems.",
  },
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
  {
    slug: "best-claude-code-hooks",
    title: "Best Claude Code hooks",
    subtitle: "Hooks for safety, validation, notifications, and workflow automation.",
    category: "hooks",
    tags: ["hook", "claude-code", "validation", "automation", "notification"],
    intro:
      "Hooks can execute automatically during agent workflows. Prefer source-backed entries with clear triggers, script bodies, and safety/privacy notes.",
  },
  {
    slug: "safe-mcp-installs",
    title: "Safe MCP install shortlist",
    subtitle: "MCP entries with stronger source, package, safety, and privacy signals.",
    category: "mcp",
    tags: ["safe", "security", "privacy", "install", "first-party"],
    intro:
      "This is not malware approval. It is a shortlist of MCP entries with better metadata for deciding what deserves a closer source review.",
  },
  {
    slug: "mcp-servers-for-code-review",
    title: "MCP servers for code review",
    subtitle:
      "MCP resources that help inspect repositories, issues, diffs, and engineering context.",
    category: "mcp",
    tags: ["code-review", "github", "repository", "review", "quality"],
    intro:
      "Code-review MCP servers often need repository access. Check OAuth scopes, local file behavior, and log handling before adding them to a real workspace.",
  },
  {
    slug: "mcp-servers-for-browser-automation",
    title: "MCP servers for browser automation",
    subtitle:
      "Browser and UI automation bridges for agent workflows that need live page interaction.",
    category: "mcp",
    tags: ["browser", "automation", "playwright", "ui", "testing"],
    intro:
      "Browser automation can leak session state or trigger account actions. Use entries with clear runtime boundaries and test in throwaway sessions first.",
  },
  {
    slug: "mcp-servers-for-github",
    title: "MCP servers for GitHub workflows",
    subtitle: "MCP entries for issues, pull requests, repositories, and maintainer review loops.",
    category: "mcp",
    tags: ["github", "pull-request", "issues", "repository", "review"],
    intro:
      "GitHub-connected MCP servers can read or write sensitive repository state. Confirm scopes and disable write actions unless your workflow explicitly needs them.",
  },
  {
    slug: "mcp-servers-for-research",
    title: "MCP servers for research workflows",
    subtitle: "Research, retrieval, search, and knowledge-source MCP entries.",
    category: "mcp",
    tags: ["research", "search", "retrieval", "docs", "knowledge"],
    intro:
      "Research MCP servers are useful when sources matter. Prefer entries that expose documentation links and clear third-party request behavior.",
  },
  {
    slug: "claude-skills-for-design",
    title: "Claude skills for design workflows",
    subtitle: "Skills and capability packs for visual direction, UX review, and frontend craft.",
    category: "skills",
    tags: ["design", "frontend", "ux", "brand", "visual"],
    intro:
      "Design skills work best when their output contract is concrete. Look for source-backed skills with examples, constraints, and clear applicability.",
  },
  {
    slug: "codex-skills-for-deployment",
    title: "Codex and Claude skills for deployment",
    subtitle: "Deployment, release, validation, and infrastructure-oriented skills.",
    category: "skills",
    tags: ["codex", "deployment", "release", "cloudflare", "validation"],
    intro:
      "Deployment skills can influence production systems. Treat them as review-first unless they clearly document secrets, rollback, and validation behavior.",
  },
  {
    slug: "agent-review-automation",
    title: "Agent review automation",
    subtitle: "Agents, commands, hooks, and rules for turning review into a repeatable workflow.",
    category: "agents",
    tags: ["review", "automation", "security", "quality", "pull-request"],
    intro:
      "Good review automation makes blockers deterministic and easy to verify. Avoid entries that only produce vague commentary without source or test context.",
  },
  {
    slug: "claude-code-workflow-starter-kit",
    title: "Claude Code workflow starter kit",
    subtitle: "Small, inspectable pieces for building a complete Claude Code setup.",
    category: "commands",
    tags: ["claude-code", "workflow", "starter", "debugging", "documentation"],
    intro:
      "Start with focused commands and rules, then add hooks or MCP servers only when the workflow needs runtime access.",
  },
  {
    slug: "best-ai-coding-rules",
    title: "Best AI coding rules",
    subtitle: "Rules and project instructions that make agents safer and more predictable.",
    category: "rules",
    tags: ["rules", "coding", "review", "safety", "quality"],
    intro:
      "Rules should reduce ambiguity without making the agent brittle. Prefer entries that are specific, short enough to follow, and easy to adapt.",
  },
  {
    slug: "commands-for-debugging",
    title: "Best commands for debugging",
    subtitle:
      "Slash commands for tracing failures, inspecting context, and producing useful fixes.",
    category: "commands",
    tags: ["debugging", "logs", "tests", "trace", "failure"],
    intro:
      "Debugging commands should collect evidence first and avoid destructive fixes. Check their expected inputs before running them on a real project.",
  },
  {
    slug: "hooks-for-secret-safety",
    title: "Hooks for secret and credential safety",
    subtitle: "Hooks that help prevent accidental leaks, unsafe commands, or risky agent behavior.",
    category: "hooks",
    tags: ["secret", "credential", "security", "safety", "validation"],
    intro:
      "Secret-safety hooks are guardrails, not substitutes for secret management. Review failure behavior and local logging before enabling them.",
  },
  {
    slug: "statuslines-for-cost-and-context",
    title: "Statuslines for cost and context",
    subtitle: "Statuslines that expose model, token, timer, cost, or workspace state.",
    category: "statuslines",
    tags: ["cost", "timer", "model", "context", "statusline"],
    intro:
      "Statuslines run frequently, so implementation simplicity matters. Prefer small scripts that avoid network calls unless disclosed.",
  },
  {
    slug: "tools-for-agent-maintainers",
    title: "Tools for agent maintainers",
    subtitle: "Commercial and open tooling that helps maintain AI workflow repos and integrations.",
    category: "tools",
    tags: ["maintainer", "tooling", "review", "automation", "observability"],
    intro:
      "Tool listings are decision inputs, not paid rankings. Check pricing, disclosure, and source/documentation links before adopting one.",
  },
  {
    slug: "guides-for-claude-code-setup",
    title: "Guides for Claude Code setup",
    subtitle: "Practical setup, troubleshooting, and workflow guides for Claude Code users.",
    category: "guides",
    tags: ["setup", "claude-code", "troubleshooting", "workflow", "install"],
    intro:
      "Setup guides should be specific about environment assumptions and failure modes. Prefer current, source-backed guidance over generic tutorials.",
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
