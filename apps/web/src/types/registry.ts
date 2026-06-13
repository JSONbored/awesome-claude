export type Category =
  | "agents"
  | "mcp"
  | "tools"
  | "skills"
  | "rules"
  | "commands"
  | "hooks"
  | "guides"
  | "collections"
  | "statuslines";

export type Harness = Platform;

export type TrustLevel = "trusted" | "review" | "limited" | "blocked";
export type SourceStatus = "source-backed" | "first-party" | "external" | "unverified";
export type InstallType = "cli" | "config" | "copy" | "package" | "manual";
export type Platform =
  | "claude-code"
  | "claude-desktop"
  | "cursor"
  | "vscode"
  | "windsurf"
  | "codex"
  | "gemini"
  | "raycast"
  | "cli"
  | "aider"
  | "zed"
  | "continue";

export type HookTrigger =
  | "PreToolUse"
  | "PostToolUse"
  | "UserPromptSubmit"
  | "Notification"
  | "Stop"
  | "SubagentStop"
  | "SessionStart";

export type ClaimStatus = "unclaimed" | "pending" | "verified";
export type SkillLevel = "foundational" | "advanced" | "expert";
export type SkillType = "general" | "capability-pack";
export type VerificationStatus = "draft" | "validated" | "production";
export type PlatformSupport = "native-skill" | "adapter" | "manual-context" | "unsupported";

export interface EntryTrustSignals {
  firstPartyEditorial?: boolean;
  packageVerified?: boolean;
  packageTrust?: string | null;
  packageChecksum?: string;
  checksumPresent?: boolean;
  sourceUrlCount?: number;
  sourceUrls?: string[];
  sourceStatus?: string;
  lastVerifiedAt?: string;
  adapterGenerated?: boolean;
  platforms?: string[];
  supportLevels?: string[];
  hasProvenance?: boolean;
  hasSafetyNotes?: boolean;
  hasPrivacyNotes?: boolean;
}

export interface Provenance {
  submittedBy?: string;
  submittedByUrl?: string;
  submittedAt?: string;
  sourceSubmissionUrl?: string;
  importPrUrl?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface BrandInfo {
  brandName?: string;
  brandDomain?: string;
  brandIconUrl?: string;
  brandColors?: string[];
  brandVerifiedAt?: string;
}

export interface PlatformCompatibility {
  platform: Platform;
  support: PlatformSupport;
  installPath?: string;
  adapterPath?: string;
  verifiedAt?: string;
}

export interface SkillFields {
  skillType?: SkillType;
  skillLevel?: SkillLevel;
  verificationStatus?: VerificationStatus;
  retrievalSources?: string[];
  testedPlatforms?: string[];
}

export interface RepoStats {
  repository?: string;
  url?: string;
  stars?: number;
  forks?: number;
  updatedAt?: string;
  appliesTo?: "listing_source_repo" | "upstream_reference" | "directory_repo" | "none";
  label?: string;
}

export type EntryRelationType =
  | "duplicate"
  | "same-project"
  | "collection-member"
  | "complementary"
  | "same-ecosystem"
  | "prerequisite"
  | "works-with"
  | "extends"
  | "alternative"
  | "related";

export interface EntryRelation {
  key: string;
  category: Category;
  slug: string;
  title: string;
  relation: EntryRelationType;
  score: number;
  reasons: string[];
  url: string;
}

export interface EntrySection {
  title: string;
  id: string;
  markdown?: string;
  html?: string;
  codeBlocks?: Array<{ language?: string; code: string }>;
}

export interface Entry extends Provenance, BrandInfo, SkillFields {
  category: Category;
  slug: string;
  title: string;
  description: string;
  seoTitle?: string;
  seoDescription?: string;
  cardDescription?: string;
  author: string;
  tags: string[];
  keywords?: string[];
  platforms: Platform[];
  installType: InstallType;
  installCommand?: string;
  configSnippet?: string;
  fullCopy?: string;
  /**
   * Optional per-harness overrides for install/config/full payloads. When
   * present, the dossier and Peek surface a harness picker; payloads fall back
   * to the top-level fields when a harness has no override.
   */
  harnessVariants?: Partial<
    Record<
      Harness,
      {
        installCommand?: string;
        configSnippet?: string;
        fullCopy?: string;
        note?: string;
      }
    >
  >;
  sourceUrl?: string;
  docsUrl?: string;
  repoUrl?: string;
  trust: TrustLevel;
  source: SourceStatus;
  trustSignals?: EntryTrustSignals;
  repoStats?: RepoStats;
  relatedEntries?: EntryRelation[];
  /** @deprecated Repo stars are source metadata, not listing popularity. */
  stars?: number;
  dateAdded: string;
  reviewed?: boolean;
  claimed?: boolean;
  claimStatus?: ClaimStatus;
  safetyNotes?: string;
  safetyNotesList?: string[];
  privacyNotes?: string;
  privacyNotesList?: string[];
  prerequisites?: string[];
  body?: string;
  bodyHtml?: string;
  sections?: EntrySection[];
  headings?: Array<{ depth: number; text: string; id: string }>;
  codeBlocks?: Array<{ language?: string; code: string }>;
  /** SHA-256 checksum for downloadable package, if any. */
  downloadSha256?: string;
  downloadUrl?: string;
  packageVerified?: boolean;
  usageSnippet?: string;
  copySnippet?: string;
  /** Hooks */
  trigger?: HookTrigger;
  /** Commands */
  commandSyntax?: string;
  argumentHint?: string;
  allowedTools?: string[];
  /** Statuslines */
  scriptLanguage?: "bash" | "zsh" | "fish" | "python" | "javascript" | "other";
  scriptBody?: string;
  /** Collections */
  items?: string[];
  installationOrder?: string[];
  estimatedSetupTime?: string;
  difficulty?: string;
  /** Skills/MCP */
  platformCompatibility?: PlatformCompatibility[];
  verifiedAt?: string;
  readingTime?: number;
  difficultyScore?: number;
  hasPrerequisites?: boolean;
  hasTroubleshooting?: boolean;
  hasBreakingChanges?: boolean;
  websiteUrl?: string;
  pricingModel?: string;
  disclosure?: string;
  applicationCategory?: string;
  operatingSystem?: string;
  harness?: Harness[];
}

export const CATEGORIES: { id: Category; label: string; blurb: string }[] = [
  { id: "agents", label: "Agents", blurb: "Autonomous and semi-autonomous agents" },
  { id: "mcp", label: "MCP servers", blurb: "Model Context Protocol servers and bridges" },
  { id: "skills", label: "Skills", blurb: "Reusable Claude Skills and capability packs" },
  { id: "commands", label: "Commands", blurb: "Slash commands for Claude Code and Codex" },
  { id: "hooks", label: "Hooks", blurb: "Pre/post hooks for agent lifecycles" },
  { id: "rules", label: "Rules", blurb: "Editor rules and CLAUDE.md / AGENTS.md presets" },
  { id: "statuslines", label: "Statuslines", blurb: "Status line renderers" },
  { id: "guides", label: "Guides", blurb: "Practical guides and playbooks" },
  { id: "collections", label: "Collections", blurb: "Curated bundles of registry entries" },
  { id: "tools", label: "Tools", blurb: "Commercial tools and integrations" },
];

export const HARNESSES: { id: Harness; label: string }[] = [
  { id: "claude-code", label: "Claude Code" },
  { id: "claude-desktop", label: "Claude Desktop" },
  { id: "codex", label: "Codex" },
  { id: "gemini", label: "Gemini" },
  { id: "cursor", label: "Cursor" },
  { id: "windsurf", label: "Windsurf" },
  { id: "zed", label: "Zed" },
  { id: "aider", label: "Aider" },
  { id: "continue", label: "Continue" },
];

export const TRUST_LABEL: Record<TrustLevel, string> = {
  trusted: "Trusted",
  review: "Review first",
  limited: "Limited",
  blocked: "Blocked",
};

export const SOURCE_LABEL: Record<SourceStatus, string> = {
  "source-backed": "Source-backed",
  "first-party": "First-party",
  external: "External",
  unverified: "Unverified",
};

export const PLATFORM_LABEL: Record<Platform, string> = {
  "claude-code": "Claude Code",
  "claude-desktop": "Claude Desktop",
  cursor: "Cursor",
  vscode: "VS Code",
  windsurf: "Windsurf",
  codex: "Codex",
  gemini: "Gemini",
  raycast: "Raycast",
  cli: "CLI",
  aider: "Aider",
  zed: "Zed",
  continue: "Continue",
};

export const PLATFORM_SUPPORT_LABEL: Record<PlatformSupport, string> = {
  "native-skill": "Native",
  adapter: "Adapter",
  "manual-context": "Manual",
  unsupported: "Unsupported",
};

export const CLAIM_LABEL: Record<ClaimStatus, string> = {
  unclaimed: "Unclaimed",
  pending: "Claim pending",
  verified: "Claimed",
};

/* -------- Jobs -------- */

export type JobTier = "free" | "standard" | "featured" | "sponsored";
export type JobSourceKind = "official_ats" | "employer_careers" | "employer_submitted";

export interface JobListing {
  slug: string;
  title: string;
  company: string;
  companyUrl?: string;
  location: string;
  isRemote?: boolean;
  isWorldwide?: boolean;
  type: string;
  postedAt: string;
  lastVerifiedAt?: string;
  compensation?: string;
  equity?: string;
  bonus?: string;
  description: string;
  benefits?: string[];
  responsibilities?: string[];
  requirements?: string[];
  labels?: string[];
  applyUrl?: string;
  tier: JobTier;
  sourceKind?: JobSourceKind;
  sourceUrl?: string;
  curationNote?: string;
  featured?: boolean;
  sponsored?: boolean;
}

/* -------- Commercial tools -------- */

export type PricingModel =
  | "free"
  | "freemium"
  | "paid"
  | "open-source"
  | "subscription"
  | "usage-based"
  | "contact-sales";
export type Disclosure = "editorial" | "heyclaude_pick" | "affiliate" | "sponsored" | "claimed";

export interface CommercialTool {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  websiteUrl: string;
  affiliateUrl?: string;
  brandDomain?: string;
  brandIconUrl?: string;
  pricingModel: PricingModel;
  disclosure: Disclosure;
  category: string;
  tags: string[];
  operatingSystem?: string[];
  dateAdded: string;
  featured?: boolean;
}

/* -------- Integrations -------- */

export type IntegrationKind = "extension" | "mcp-server" | "feed" | "adapter" | "api" | "package";
export type IntegrationStatus = "live" | "beta" | "read-only";

export interface Integration {
  slug: string;
  name: string;
  tagline: string;
  kind: IntegrationKind;
  tier:
    | "Official extension"
    | "First-party server"
    | "Public feed"
    | "Adapter"
    | "Public API"
    | "npm package";
  status: IntegrationStatus;
  mark:
    | "raycast"
    | "mcp"
    | "npm"
    | "cursor"
    | "claude"
    | "rss"
    | "json"
    | "openapi"
    | "github"
    | "zed"
    | "openai"
    | "continue"
    | "aider"
    | "anthropic"
    | "gemini"
    | "vscode"
    | "windsurf";
  bullets: string[];
  primaryAction: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
  version?: string;
  updatedAt?: string;
  install?: { client: string; snippet: string }[];
  trustPosture?: string;
  /** Real npm package name for live version chip. */
  npmPackage?: string;
  /** owner/repo for GitHub live stats. */
  githubRepo?: string;
  /** Consumption surface this integration represents (folded into the card). */
  surface?: {
    kind: "web" | "mcp" | "raycast" | "api";
    label: string;
    snippet: string;
  };
}

/* -------- Contributor -------- */

export interface Contributor {
  slug: string;
  handle: string;
  name: string;
  avatarUrl?: string;
  bio?: string;
  github?: string;
  acceptedCount: number;
}

/* -------- Changelog / artifact contracts -------- */

export type ChangeKind = "added" | "updated" | "removed";

export interface ChangelogEntry {
  date: string;
  kind: ChangeKind;
  ref: string;
  title: string;
  category?: Category;
  hash: string;
}

export interface ChangelogDiffRef {
  category: Category;
  slug: string;
  title: string;
  artifactHash?: string;
}

export interface ChangelogDiff {
  added: ChangelogDiffRef[];
  updated: ChangelogDiffRef[];
  removed: ChangelogDiffRef[];
}

export interface ArtifactContract {
  path: string;
  bytes: number;
  sha256: string;
  builtAt: string;
}
