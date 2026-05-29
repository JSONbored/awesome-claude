import type { ArtifactContract, ChangelogDiff, ChangelogEntry } from "@/types/registry";

export const CHANGELOG: ChangelogEntry[] = [
  { date: "2026-05-26", kind: "added", ref: "mcp/postgres-mcp", title: "Postgres MCP", category: "mcp", hash: "a1f2…b9" },
  { date: "2026-05-25", kind: "updated", ref: "skills/scaffold-skill", title: "Scaffold a Skill", category: "skills", hash: "c8d2…41" },
  { date: "2026-05-24", kind: "added", ref: "hooks/pre-edit-test", title: "Run tests before edits", category: "hooks", hash: "9e1a…02" },
  { date: "2026-05-22", kind: "removed", ref: "tools/legacy-cli", title: "Legacy CLI", hash: "0b44…ff" },
  { date: "2026-05-20", kind: "updated", ref: "rules/claude-md-baseline", title: "CLAUDE.md baseline", category: "rules", hash: "5c10…7a" },
];

export const ARTIFACT_CONTRACTS: ArtifactContract[] = [
  { path: "/data/directory-index.json", bytes: 184_320, sha256: "a1f29c…b9d4", builtAt: "2026-05-26T08:12:00Z" },
  { path: "/data/search-index.json", bytes: 312_018, sha256: "c8d2af…41e0", builtAt: "2026-05-26T08:12:00Z" },
  { path: "/data/ecosystem-feed.json", bytes: 24_512, sha256: "9e1aef…02b1", builtAt: "2026-05-26T08:12:00Z" },
  { path: "/data/raycast-index.json", bytes: 96_440, sha256: "5c1029…7a55", builtAt: "2026-05-26T08:12:00Z" },
  { path: "/data/registry-trust-report.json", bytes: 18_044, sha256: "33aa12…ff10", builtAt: "2026-05-26T08:12:00Z" },
  { path: "/llms-full.txt", bytes: 1_204_512, sha256: "ee01a4…cd22", builtAt: "2026-05-26T08:12:00Z" },
];

export type ReleaseStream = "release" | "policy" | "security";

export interface ReleaseNote {
  date: string;
  stream: ReleaseStream;
  version?: string;
  title: string;
  body: string;
  href?: string;
  counts?: { added?: number; updated?: number; removed?: number };
  hash?: string;
  /** Previous release hash for compare links. */
  prevHash?: string;
  /** Per-entry diff for the "What changed" drill-down. */
  diff?: ChangelogDiff;
}

export const RELEASE_NOTES: ReleaseNote[] = [
  {
    date: "2026-05-26",
    stream: "release",
    version: "registry@2026.21",
    title: "Weekly registry build",
    body:
      "Postgres MCP and the pre-edit test hook landed. Skill scaffolder refreshed for the SKILL.md 1.1 frontmatter. Two stale tools were retired.",
    counts: { added: 2, updated: 2, removed: 1 },
    hash: "b71c4a…02f9",
    prevHash: "9a31de…7e12",
    diff: {
      added: [
        { category: "mcp", slug: "postgres-mcp", title: "Postgres MCP", artifactHash: "a1f29c…b9d4" },
        { category: "hooks", slug: "pre-edit-test", title: "Run tests before edits", artifactHash: "9e1aef…02b1" },
      ],
      updated: [
        { category: "skills", slug: "scaffold-skill", title: "Scaffold a Skill", artifactHash: "c8d2af…41e0" },
        { category: "rules", slug: "claude-md-baseline", title: "CLAUDE.md baseline", artifactHash: "5c1029…7a55" },
      ],
      removed: [{ category: "tools", slug: "legacy-cli", title: "Legacy CLI" }],
    },
  },
  {
    date: "2026-05-25",
    stream: "security",
    title: "Checksum rotation for MCP package artifacts",
    body:
      "Rotated SHA-256 baselines after upstream npm published new tags. /api/registry/integrity now returns the new hashes; older clients see a soft warning for 7 days.",
    href: "/quality#integrity",
    hash: "f102ab…cc40",
  },
  {
    date: "2026-05-23",
    stream: "policy",
    title: "Safety notes now required for hooks and statuslines",
    body:
      "Submissions in risk-bearing categories must declare what the hook executes, which paths it touches, and whether it spawns subprocesses. Existing entries get a 30-day grace period.",
    href: "/legal#content-policy",
  },
  {
    date: "2026-05-19",
    stream: "release",
    version: "registry@2026.20",
    title: "Cursor adapter feed promoted to stable",
    body:
      "Per-skill .mdc generation moved out of beta. Adapter schema is frozen at v1 and ships under /data/skill-adapters/cursor/.",
    counts: { added: 4, updated: 6, removed: 0 },
    hash: "9a31de…7e12",
    prevHash: "44ee01…b218",
    diff: {
      added: [
        { category: "skills", slug: "design-review", title: "Design review skill" },
        { category: "commands", slug: "scaffold-skill", title: "/scaffold-skill" },
        { category: "agents", slug: "release-notes", title: "Release notes agent" },
        { category: "guides", slug: "cursor-adapter", title: "Cursor adapter guide" },
      ],
      updated: [
        { category: "mcp", slug: "github-mcp", title: "GitHub MCP" },
        { category: "skills", slug: "code-review", title: "Code review skill" },
        { category: "hooks", slug: "pre-commit-format", title: "Pre-commit formatter" },
        { category: "rules", slug: "react-rules", title: "React rules" },
        { category: "commands", slug: "create-issue", title: "/create-issue" },
        { category: "guides", slug: "claude-code-onboarding", title: "Claude Code onboarding" },
      ],
      removed: [],
    },
  },
  {
    date: "2026-05-17",
    stream: "security",
    title: "Removed unsigned commit author from validator set",
    body:
      "One validator's commits were not signed across the last 90 days; their sign-offs were revoked pending re-attestation. No published entries changed.",
    href: "/validators",
  },
  {
    date: "2026-05-15",
    stream: "policy",
    title: "Sponsored placements gain explicit labelling",
    body:
      "Any commercial tool flagged sponsored now renders a Sponsored chip in every card, list, and dossier — never styled to look organic.",
    href: "/legal#disclosure",
  },
  {
    date: "2026-05-12",
    stream: "release",
    version: "registry@2026.19",
    title: "First-pass community signals",
    body:
      "Upvotes, works, and broken counters are now wired through /api/community-signals and rendered on entry dossiers.",
    counts: { added: 6, updated: 3, removed: 0 },
    hash: "44ee01…b218",
  },
];

