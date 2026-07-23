import { normalizePlatform } from "@heyclaude/registry";

import type {
  Category,
  Entry,
  EntryRelation,
  EntryTrustSignals,
  HookTrigger,
  InstallType,
  Platform,
  PlatformCompatibility,
  PlatformSupport,
  SourceStatus,
  TrustLevel,
} from "@/types/registry";

export type RegistryEntry = Record<string, unknown> & {
  category: string;
  slug: string;
  title: string;
  description: string;
  seoTitle?: string;
  seoDescription?: string;
  author?: string;
  submittedBy?: string;
  submittedByUrl?: string;
  submittedAt?: string;
  sourceSubmissionUrl?: string;
  importPrUrl?: string;
  reviewedBy?: string;
  reviewedAt?: string;
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
  repoUrl?: string | null;
  websiteUrl?: string;
  brandName?: string;
  brandDomain?: string;
  brandIconUrl?: string;
  brandLogoUrl?: string;
  brandAssetSource?: string;
  brandVerifiedAt?: string;
  brandColors?: string[];
  prerequisites?: string[];
  safetyNotes?: string | string[];
  privacyNotes?: string | string[];
  body?: string;
  bodyHtml?: string;
  sections?: Array<{
    title: string;
    id: string;
    markdown?: string;
    html?: string;
    codeBlocks?: Array<{ language?: string; code: string }>;
  }>;
  headings?: Array<{ depth: number; text: string; id: string }>;
  codeBlocks?: Array<{ language?: string; code: string }>;
  downloadUrl?: string;
  downloadSha256?: string | null;
  packageVerified?: boolean;
  downloadTrust?: string | null;
  githubStars?: number | null;
  githubForks?: number | null;
  repoUpdatedAt?: string | null;
  repoStats?: {
    repository?: string;
    url?: string;
    stars?: number | null;
    forks?: number | null;
    updatedAt?: string | null;
    appliesTo?: "listing_source_repo" | "upstream_reference" | "directory_repo" | "none";
    label?: string;
  };
  trustSignals?: EntryTrustSignals;
  relatedEntries?: Array<{
    key?: string;
    category?: string;
    slug?: string;
    title?: string;
    relation?: string;
    score?: number;
    reasons?: string[];
    url?: string;
  }>;
  platformCompatibility?: Array<{
    platform: string;
    supportLevel?: string;
    support?: string;
    installPath?: string;
    adapterPath?: string;
    verifiedAt?: string;
  }>;
  commandSyntax?: string;
  argumentHint?: string;
  allowedTools?: string[];
  scriptLanguage?: string;
  scriptBody?: string;
  trigger?: string;
  items?: Array<{ category: string; slug: string }> | string[];
  installationOrder?: string[];
  estimatedSetupTime?: string;
  difficulty?: string;
  skillType?: string;
  skillLevel?: string;
  verificationStatus?: string;
  verifiedAt?: string;
  retrievalSources?: string[];
  testedPlatforms?: string[];
  pricingModel?: string;
  disclosure?: string;
  applicationCategory?: string;
  operatingSystem?: string;
  readingTime?: number;
  difficultyScore?: number;
  hasPrerequisites?: boolean;
  hasTroubleshooting?: boolean;
  hasBreakingChanges?: boolean;
  claimStatus?: string;
  claimedBy?: string;
  claimedByUrl?: string;
  claimedAt?: string;
};

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
]);

const SUPPORT_ALIASES: Record<string, PlatformSupport> = {
  "native-skill": "native-skill",
  native: "native-skill",
  full: "native-skill",
  complete: "native-skill",
  adapter: "adapter",
  partial: "adapter",
  adapted: "adapter",
  "manual-context": "manual-context",
  manual: "manual-context",
  context: "manual-context",
  unsupported: "unsupported",
  none: "unsupported",
  no: "unsupported",
};

function normalizeSupportKey(raw: unknown) {
  return String(raw ?? "")
    .trim()
    .toLowerCase()
    .replace(/_/g, "-")
    .replace(/\s+/g, "-");
}

export function normalizeSupportLevel(raw: unknown): PlatformSupport {
  const key = normalizeSupportKey(raw);
  if (!key) return "manual-context";
  if (Object.hasOwn(SUPPORT_ALIASES, key)) {
    return SUPPORT_ALIASES[key];
  }
  return "manual-context";
}

const HOOK_TRIGGERS = new Set<HookTrigger>([
  "PreToolUse",
  "PostToolUse",
  "UserPromptSubmit",
  "Notification",
  "Stop",
  "SubagentStop",
  "SessionStart",
]);

export function asCategory(value: string): Category {
  return CATEGORIES.has(value as Category) ? (value as Category) : "tools";
}

export function compactText(value: unknown): string | undefined {
  if (typeof value === "string") return value.trim() || undefined;
  if (Array.isArray(value)) {
    const rows = value.filter(
      (item): item is string => typeof item === "string" && item.trim().length > 0,
    );
    return rows.length ? rows.join("\n") : undefined;
  }
  return undefined;
}

export function listText(value: unknown): string[] | undefined {
  if (Array.isArray(value)) {
    const rows = value.filter(
      (item): item is string => typeof item === "string" && item.trim().length > 0,
    );
    return rows.length ? rows : undefined;
  }
  if (typeof value === "string" && value.trim()) return [value.trim()];
  return undefined;
}

function stringList(value: unknown): string[] | undefined {
  return listText(value);
}

function platformFrom(value: string): Platform | undefined {
  // Canonical IDs come from the registry's shared taxonomy (#3920).
  return normalizePlatform(value) as Platform | undefined;
}

export function inferPlatforms(entry: RegistryEntry): Platform[] {
  const platforms = new Set<Platform>();
  for (const item of entry.platformCompatibility ?? []) {
    const platform = platformFrom(item.platform);
    if (platform) platforms.add(platform);
  }
  for (const item of entry.trustSignals?.platforms ?? []) {
    const platform = platformFrom(item);
    if (platform) platforms.add(platform);
  }
  for (const item of entry.testedPlatforms ?? []) {
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

export function inferInstallType(entry: RegistryEntry): InstallType {
  if (entry.downloadUrl) return "package";
  if (entry.installCommand) return "cli";
  if (entry.configSnippet) return "config";
  if (entry.copySnippet || entry.usageSnippet || entry.body) return "copy";
  return "manual";
}

export function inferSource(entry: RegistryEntry): SourceStatus {
  if (entry.downloadTrust === "first-party" || entry.trustSignals?.firstPartyEditorial) {
    return "first-party";
  }
  if (entry.repoUrl || entry.githubUrl || entry.trustSignals?.sourceStatus === "available") {
    return "source-backed";
  }
  if (entry.documentationUrl || entry.websiteUrl) return "external";
  return "unverified";
}

/**
 * Trust posture for a normalized registry entry.
 *
 * Risk-bearing categories (mcp / hooks / skills / commands / statuslines) can
 * execute code, touch the filesystem, or call the network. When neither
 * safetyNotes nor privacyNotes disclose that behavior, the listing is
 * `blocked` — the highest caution tier — so install-risk surfaces can warn
 * "High risk — do not install without human review." Notes present (or a
 * non-risk category) stay at `review`.
 */
export function inferTrust(entry: RegistryEntry, source: SourceStatus): TrustLevel {
  const hasNotes = Boolean(entry.safetyNotes || entry.privacyNotes);
  if (entry.packageVerified && entry.downloadSha256) return "trusted";
  if (entry.trustSignals?.firstPartyEditorial) return "trusted";
  if (source === "unverified") return "limited";
  if (["mcp", "hooks", "skills", "commands", "statuslines"].includes(entry.category) && !hasNotes) {
    return "blocked";
  }
  return "review";
}

export function normalizeClaimStatus(value: unknown): Entry["claimStatus"] {
  const normalized = String(value ?? "")
    .trim()
    .toLowerCase();
  if (normalized === "verified" || normalized === "pending") return normalized;
  return "unclaimed";
}

export function normalizeCompatibility(entry: RegistryEntry): PlatformCompatibility[] | undefined {
  const rows: PlatformCompatibility[] = [];
  for (const item of entry.platformCompatibility ?? []) {
    const platform = platformFrom(item.platform);
    if (!platform) continue;
    const rawSupport = item.support ?? item.supportLevel ?? "";
    const support = normalizeSupportLevel(rawSupport);
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

export function normalizeItems(value: RegistryEntry["items"]): Entry["items"] {
  if (!Array.isArray(value)) return undefined;
  const rows = value
    .map((item) => {
      if (typeof item === "string") return item;
      if (item && typeof item === "object" && "category" in item && "slug" in item) {
        return `${String(item.category)}/${String(item.slug)}`;
      }
      return "";
    })
    .filter(Boolean);
  return rows.length ? rows : undefined;
}

export function normalizeRepoStats(entry: RegistryEntry): Entry["repoStats"] {
  const stats = entry.repoStats;
  const stars = stats?.stars ?? entry.githubStars ?? null;
  const forks = stats?.forks ?? entry.githubForks ?? null;
  const updatedAt = stats?.updatedAt ?? entry.repoUpdatedAt ?? null;
  const url = stats?.url ?? entry.repoUrl ?? undefined;
  if (stars == null && forks == null && !updatedAt && !url) return undefined;
  return {
    repository: stats?.repository,
    url: url || undefined,
    stars: typeof stars === "number" ? stars : undefined,
    forks: typeof forks === "number" ? forks : undefined,
    updatedAt: updatedAt || undefined,
    appliesTo: stats?.appliesTo ?? (url ? "listing_source_repo" : "none"),
    label: stats?.label ?? "Source repo",
  };
}

export function normalizeRelatedEntries(
  value: RegistryEntry["relatedEntries"],
): EntryRelation[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const rows = value
    .map((item) => {
      const category = asCategory(String(item.category || ""));
      const slug = String(item.slug || "").trim();
      const title = String(item.title || "").trim();
      if (!slug || !title) return null;
      return {
        key: item.key || `${category}:${slug}`,
        category,
        slug,
        title,
        relation:
          item.relation === "duplicate" ||
          item.relation === "same-project" ||
          item.relation === "collection-member" ||
          item.relation === "complementary" ||
          item.relation === "same-ecosystem" ||
          item.relation === "prerequisite" ||
          item.relation === "works-with" ||
          item.relation === "extends" ||
          item.relation === "alternative" ||
          item.relation === "related"
            ? item.relation
            : "related",
        score: typeof item.score === "number" ? item.score : 0,
        reasons: Array.isArray(item.reasons) ? item.reasons.map(String) : [],
        url: String(item.url || `/entry/${category}/${slug}`),
      } satisfies EntryRelation;
    })
    .filter((item): item is EntryRelation => Boolean(item));
  return rows.length ? rows : undefined;
}

export type EntryAttribution = {
  author: string;
  authorProfileUrl?: string;
  submittedByUrl?: string;
};

export function buildEntryFromRegistry(entry: RegistryEntry, attribution: EntryAttribution): Entry {
  const category = asCategory(entry.category);
  const source = inferSource(entry);
  const safetyNotes = compactText(entry.safetyNotes);
  const privacyNotes = compactText(entry.privacyNotes);
  const copyPayload = entry.copySnippet ?? entry.body ?? entry.usageSnippet;
  const platforms = inferPlatforms(entry);
  const reviewedAt =
    entry.reviewedAt ?? entry.trustSignals?.lastVerifiedAt ?? entry.contentUpdatedAt;

  return {
    category,
    slug: entry.slug,
    title: entry.title,
    description: entry.description,
    seoTitle: entry.seoTitle,
    seoDescription: entry.seoDescription,
    cardDescription: entry.cardDescription,
    author: attribution.author,
    authorProfileUrl: attribution.authorProfileUrl,
    submittedBy: entry.submittedBy,
    submittedByUrl: attribution.submittedByUrl,
    submittedAt: entry.submittedAt ?? entry.dateAdded,
    sourceSubmissionUrl: entry.sourceSubmissionUrl,
    importPrUrl: entry.importPrUrl,
    reviewedBy: entry.reviewedBy,
    reviewedAt,
    brandName: entry.brandName,
    brandDomain: entry.brandDomain,
    brandIconUrl: entry.brandIconUrl,
    brandLogoUrl: entry.brandLogoUrl,
    brandAssetSource: entry.brandAssetSource,
    brandVerifiedAt: entry.brandVerifiedAt,
    brandColors: entry.brandColors,
    tags: entry.tags ?? [],
    keywords: entry.keywords ?? [],
    platforms,
    installType: inferInstallType(entry),
    installCommand: entry.installCommand,
    configSnippet: entry.configSnippet,
    fullCopy: copyPayload,
    usageSnippet: entry.usageSnippet,
    copySnippet: entry.copySnippet,
    sourceUrl: entry.repoUrl ?? entry.githubUrl ?? entry.documentationUrl ?? entry.websiteUrl,
    docsUrl: entry.documentationUrl,
    repoUrl: entry.repoUrl ?? undefined,
    websiteUrl: entry.websiteUrl,
    trust: inferTrust(entry, source),
    source,
    trustSignals: entry.trustSignals,
    repoStats: normalizeRepoStats(entry),
    relatedEntries: normalizeRelatedEntries(entry.relatedEntries),
    dateAdded: entry.dateAdded ?? entry.contentUpdatedAt?.slice(0, 10) ?? "2026-01-01",
    // Requires a named reviewer. `reviewedAt` falls back to the build-time
    // `contentUpdatedAt`, and `packageVerified` is an automated package check,
    // so neither evidences the human sign-off the "Maintainer-reviewed" label
    // claims.
    reviewed: Boolean(entry.reviewedBy),
    claimed: normalizeClaimStatus(entry.claimStatus) === "verified",
    claimStatus: normalizeClaimStatus(entry.claimStatus),
    safetyNotes,
    safetyNotesList: listText(entry.safetyNotes),
    privacyNotes,
    privacyNotesList: listText(entry.privacyNotes),
    prerequisites: entry.prerequisites,
    body: entry.body,
    bodyHtml: entry.bodyHtml,
    sections: entry.sections,
    headings: entry.headings,
    codeBlocks: entry.codeBlocks,
    downloadSha256: entry.downloadSha256 ?? undefined,
    downloadUrl: entry.downloadUrl || undefined,
    downloadTrust: entry.downloadTrust ?? undefined,
    packageVerified: entry.packageVerified,
    commandSyntax: typeof entry.commandSyntax === "string" ? entry.commandSyntax : undefined,
    argumentHint: entry.argumentHint,
    allowedTools: stringList(entry.allowedTools),
    scriptLanguage:
      entry.scriptLanguage === "bash" ||
      entry.scriptLanguage === "zsh" ||
      entry.scriptLanguage === "fish" ||
      entry.scriptLanguage === "python" ||
      entry.scriptLanguage === "javascript" ||
      entry.scriptLanguage === "other"
        ? entry.scriptLanguage
        : undefined,
    scriptBody: entry.scriptBody,
    trigger: HOOK_TRIGGERS.has(entry.trigger as HookTrigger)
      ? (entry.trigger as HookTrigger)
      : undefined,
    items: normalizeItems(entry.items),
    installationOrder: stringList(entry.installationOrder),
    estimatedSetupTime: entry.estimatedSetupTime,
    difficulty: entry.difficulty,
    skillType:
      entry.skillType === "general" || entry.skillType === "capability-pack"
        ? entry.skillType
        : undefined,
    skillLevel:
      entry.skillLevel === "foundational" ||
      entry.skillLevel === "advanced" ||
      entry.skillLevel === "expert"
        ? entry.skillLevel
        : undefined,
    verificationStatus:
      entry.verificationStatus === "draft" ||
      entry.verificationStatus === "validated" ||
      entry.verificationStatus === "production"
        ? entry.verificationStatus
        : undefined,
    verifiedAt: entry.verifiedAt,
    retrievalSources: stringList(entry.retrievalSources),
    testedPlatforms: stringList(entry.testedPlatforms),
    platformCompatibility: normalizeCompatibility(entry),
    pricingModel: entry.pricingModel,
    disclosure: entry.disclosure,
    applicationCategory: entry.applicationCategory,
    operatingSystem: entry.operatingSystem,
    readingTime: entry.readingTime,
    difficultyScore: entry.difficultyScore,
    hasPrerequisites: entry.hasPrerequisites,
    hasTroubleshooting: entry.hasTroubleshooting,
    hasBreakingChanges: entry.hasBreakingChanges,
    harness: platforms,
  };
}
