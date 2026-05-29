import atlasRegistry from "@/generated/atlas-registry.json";
import type {
  Category,
  Entry,
  InstallType,
  Platform,
  PlatformCompatibility,
  PlatformSupport,
  SourceStatus,
  TrustLevel,
} from "@/types/registry";

type RegistryEntry = Record<string, unknown> & {
  category: string;
  slug: string;
  title: string;
  description: string;
  author?: string;
  submittedBy?: string;
  submittedByUrl?: string;
  authorProfileUrl?: string;
  dateAdded?: string;
  contentUpdatedAt?: string;
  tags?: string[];
  keywords?: string[];
  cardDescription?: string;
  installCommand?: string;
  configSnippet?: string;
  copySnippet?: string;
  usageSnippet?: string;
  documentationUrl?: string;
  githubUrl?: string;
  repoUrl?: string;
  brandName?: string;
  brandDomain?: string;
  brandIconUrl?: string;
  prerequisites?: string[];
  safetyNotes?: string | string[];
  privacyNotes?: string | string[];
  body?: string;
  downloadUrl?: string;
  downloadSha256?: string | null;
  packageVerified?: boolean;
  downloadTrust?: string | null;
  githubStars?: number | null;
  trustSignals?: {
    firstPartyEditorial?: boolean;
    sourceStatus?: string;
    lastVerifiedAt?: string;
    platforms?: string[];
    supportLevels?: string[];
  };
  platformCompatibility?: Array<{
    platform: string;
    supportLevel?: string;
    support?: string;
    installPath?: string;
    adapterPath?: string;
    verifiedAt?: string;
  }>;
};

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

const CATEGORIES = new Set<Category>([
  "agents",
  "mcp",
  "tools",
  "skills",
  "rules",
  "commands",
  "hooks",
  "guides",
  "collections",
  "statuslines",
  "plugins",
  "automations",
  "codex-plugins",
  "codex-automations",
  "harness-configs",
  "aider-recipes",
  "continue-configs",
  "zed-extensions",
]);

const PLATFORM_ALIASES: Record<string, Platform> = {
  claude: "claude-code",
  "claude code": "claude-code",
  "claude-code": "claude-code",
  "claude desktop": "claude-desktop",
  "claude-desktop": "claude-desktop",
  codex: "codex",
  cursor: "cursor",
  windsurf: "windsurf",
  gemini: "gemini",
  raycast: "raycast",
  "generic agents": "cli",
  cli: "cli",
  vscode: "vscode",
  "vs code": "vscode",
  aider: "aider",
  zed: "zed",
  continue: "continue",
};

const SUPPORT_ALIASES: Record<string, PlatformSupport> = {
  "native-skill": "native-skill",
  adapter: "adapter",
  "manual-context": "manual-context",
  unsupported: "unsupported",
};

function asCategory(value: string): Category {
  return CATEGORIES.has(value as Category) ? (value as Category) : "tools";
}

function compactText(value: unknown): string | undefined {
  if (typeof value === "string") return value.trim() || undefined;
  if (Array.isArray(value))
    return value.filter((item) => typeof item === "string" && item.trim()).join(" ");
  return undefined;
}

function listText(value: unknown): string[] | undefined {
  if (Array.isArray(value)) {
    const rows = value.filter(
      (item): item is string => typeof item === "string" && item.trim().length > 0,
    );
    return rows.length ? rows : undefined;
  }
  if (typeof value === "string" && value.trim()) return [value.trim()];
  return undefined;
}

function platformFrom(value: string): Platform | undefined {
  return PLATFORM_ALIASES[value.trim().toLowerCase()];
}

function inferPlatforms(entry: RegistryEntry): Platform[] {
  const platforms = new Set<Platform>();
  for (const item of entry.platformCompatibility ?? []) {
    const platform = platformFrom(item.platform);
    if (platform) platforms.add(platform);
  }
  for (const item of entry.trustSignals?.platforms ?? []) {
    const platform = platformFrom(item);
    if (platform) platforms.add(platform);
  }

  const tags = new Set(
    [entry.category, ...(entry.tags ?? []), ...(entry.keywords ?? [])].map((item) =>
      item.toLowerCase(),
    ),
  );
  if (tags.has("cursor")) platforms.add("cursor");
  if (tags.has("codex")) platforms.add("codex");
  if (tags.has("gemini")) platforms.add("gemini");
  if (tags.has("windsurf")) platforms.add("windsurf");
  if (tags.has("raycast")) platforms.add("raycast");
  if (tags.has("aider")) platforms.add("aider");
  if (tags.has("zed")) platforms.add("zed");
  if (tags.has("continue")) platforms.add("continue");
  if (entry.category === "mcp") {
    platforms.add("claude-code");
    platforms.add("claude-desktop");
  }
  if (
    ["skills", "commands", "hooks", "agents", "rules", "statuslines", "guides"].includes(
      entry.category,
    )
  ) {
    platforms.add("claude-code");
  }
  if (entry.category === "tools") platforms.add("cli");
  if (platforms.size === 0) platforms.add("claude-code");
  return [...platforms];
}

function inferInstallType(entry: RegistryEntry): InstallType {
  if (entry.downloadUrl) return "package";
  if (entry.installCommand) return "cli";
  if (entry.configSnippet) return "config";
  if (entry.copySnippet || entry.usageSnippet || entry.body) return "copy";
  return "manual";
}

function inferSource(entry: RegistryEntry): SourceStatus {
  if (entry.downloadTrust === "first-party" || entry.trustSignals?.firstPartyEditorial)
    return "first-party";
  if (entry.repoUrl || entry.githubUrl || entry.trustSignals?.sourceStatus === "available")
    return "source-backed";
  if (entry.documentationUrl) return "external";
  return "unverified";
}

function inferTrust(entry: RegistryEntry, source: SourceStatus): TrustLevel {
  const hasNotes = Boolean(entry.safetyNotes || entry.privacyNotes);
  if (entry.packageVerified && entry.downloadSha256) return "trusted";
  if (entry.trustSignals?.firstPartyEditorial) return "trusted";
  if (source === "unverified") return "limited";
  if (["mcp", "hooks", "skills", "commands", "statuslines"].includes(entry.category) && !hasNotes)
    return "review";
  return "review";
}

function normalizeCompatibility(entry: RegistryEntry): PlatformCompatibility[] | undefined {
  const rows: PlatformCompatibility[] = [];
  for (const item of entry.platformCompatibility ?? []) {
    const platform = platformFrom(item.platform);
    if (!platform) continue;
    const rawSupport = item.support ?? item.supportLevel ?? "";
    const support = SUPPORT_ALIASES[rawSupport] ?? "manual-context";
    rows.push({
      platform,
      support,
      installPath: item.installPath,
      adapterPath: item.adapterPath,
      verifiedAt: item.verifiedAt,
    });
  }
  return rows.length ? rows : undefined;
}

function buildEntry(entry: RegistryEntry): Entry {
  const category = asCategory(entry.category);
  const source = inferSource(entry);
  const safetyNotes = compactText(entry.safetyNotes);
  const privacyNotes = compactText(entry.privacyNotes);
  const copyPayload = entry.copySnippet ?? entry.usageSnippet ?? entry.body;
  const platforms = inferPlatforms(entry);
  const reviewedAt = entry.trustSignals?.lastVerifiedAt ?? entry.contentUpdatedAt;

  return {
    category,
    slug: entry.slug,
    title: entry.title,
    description: entry.description,
    cardDescription: entry.cardDescription,
    author: entry.author ?? entry.submittedBy ?? entry.brandName ?? "Unknown",
    submittedBy: entry.submittedBy,
    submittedByUrl: entry.submittedByUrl ?? entry.authorProfileUrl,
    submittedAt: entry.dateAdded,
    reviewedAt,
    brandName: entry.brandName,
    brandDomain: entry.brandDomain,
    brandIconUrl: entry.brandIconUrl,
    tags: entry.tags ?? [],
    keywords: entry.keywords ?? [],
    platforms,
    installType: inferInstallType(entry),
    installCommand: entry.installCommand,
    configSnippet: entry.configSnippet,
    fullCopy: copyPayload,
    sourceUrl: entry.repoUrl ?? entry.githubUrl ?? entry.documentationUrl,
    docsUrl: entry.documentationUrl,
    repoUrl: entry.repoUrl,
    trust: inferTrust(entry, source),
    source,
    stars: entry.githubStars ?? undefined,
    dateAdded: entry.dateAdded ?? entry.contentUpdatedAt?.slice(0, 10) ?? "2026-01-01",
    reviewed: Boolean(entry.trustSignals?.lastVerifiedAt || entry.packageVerified),
    claimed: false,
    claimStatus: "unclaimed",
    safetyNotes,
    safetyNotesList: listText(entry.safetyNotes),
    privacyNotes,
    privacyNotesList: listText(entry.privacyNotes),
    prerequisites: entry.prerequisites,
    body: entry.body,
    downloadSha256: entry.downloadSha256 ?? undefined,
    downloadUrl: entry.downloadUrl || undefined,
    packageVerified: entry.packageVerified,
    commandSyntax: typeof entry.commandSyntax === "string" ? entry.commandSyntax : undefined,
    scriptLanguage:
      entry.scriptLanguage === "bash" ||
      entry.scriptLanguage === "zsh" ||
      entry.scriptLanguage === "fish" ||
      entry.scriptLanguage === "python" ||
      entry.scriptLanguage === "javascript" ||
      entry.scriptLanguage === "other"
        ? entry.scriptLanguage
        : undefined,
    platformCompatibility: normalizeCompatibility(entry),
    harness: platforms,
  };
}

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
    Math.min(entry.stars ?? 0, 10_000) / 500
  );
}

function makeBestPick(entry: Entry): BestPick {
  const reasons = [
    entry.packageVerified ? "maintainer-built package" : undefined,
    entry.safetyNotes ? "safety notes present" : undefined,
    entry.privacyNotes ? "privacy notes present" : undefined,
    entry.source !== "unverified" ? `${entry.source} source posture` : undefined,
    entry.stars ? `${entry.stars.toLocaleString()} GitHub stars` : undefined,
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
