import type { Category } from "@/types/registry";

export type SubmissionStatus = "queued" | "in-review" | "merged" | "rejected";
export type ReviewTone = "note" | "request-changes" | "approve" | "reject";

export interface ReviewNote {
  at: string;
  by: string;
  tone: ReviewTone;
  body: string;
}

export interface SubmissionDossier {
  id: string;
  title: string;
  category: Category;
  submittedBy: string;
  submittedAt: string;
  status: SubmissionStatus;
  description: string;
  sourceUrl: string;
  installSnippet?: string;
  configSnippet?: string;
  safetyNotes?: string[];
  privacyNotes?: string[];
  tags: string[];
  reviewer?: string;
  note?: string;
  issueUrl?: string;
  reviewThread: ReviewNote[];
  raw: Record<string, unknown>;
}

export const SUBMISSIONS: SubmissionDossier[] = [
  {
    id: "S-247",
    title: "Postgres explain-plan MCP",
    category: "mcp",
    submittedBy: "wong2",
    submittedAt: "2026-05-26T09:14:00Z",
    status: "in-review",
    description:
      "MCP server that exposes EXPLAIN, EXPLAIN ANALYZE, and pg_stat_statements over a read-only Postgres connection. No DDL, no writes, no superuser required.",
    sourceUrl: "https://github.com/wong2/postgres-explain-mcp",
    installSnippet: 'npx -y @wong2/postgres-explain-mcp --readonly',
    configSnippet: `{
  "mcpServers": {
    "postgres-explain": {
      "command": "npx",
      "args": ["-y", "@wong2/postgres-explain-mcp"],
      "env": { "PG_URL": "postgres://readonly@localhost/app" }
    }
  }
}`,
    safetyNotes: [
      "Read-only connection enforced server-side; rejects non-SELECT statements.",
      "Never logs query results to stdout.",
    ],
    privacyNotes: [
      "Query text is hashed before any telemetry.",
      "No data leaves the process unless the client requests it.",
    ],
    tags: ["postgres", "mcp", "readonly", "explain"],
    reviewer: "jzombie",
    note: "Verifying credentials scope.",
    issueUrl: "https://github.com/jsonbored/awesome-claude/issues/247",
    reviewThread: [
      {
        at: "2026-05-26T09:14:00Z",
        by: "wong2",
        tone: "note",
        body: "Initial submission. Tested against Postgres 14, 15, 16. Read-only enforcement covered by tests/readonly.spec.ts.",
      },
      {
        at: "2026-05-26T14:22:00Z",
        by: "jzombie",
        tone: "request-changes",
        body: "Please add a privacy note about pg_stat_statements possibly containing literal values when track_activity_query_size is high. Otherwise looks clean.",
      },
      {
        at: "2026-05-27T08:01:00Z",
        by: "wong2",
        tone: "note",
        body: "Added the note and a flag --strip-literals that scrubs constants before returning rows.",
      },
    ],
    raw: {
      category: "mcp",
      slug: "postgres-explain-mcp",
      author: "wong2",
      installType: "package",
      packageVerified: false,
      downloadSha256: "9e1a4f2c...",
    },
  },
  {
    id: "S-246",
    title: "Pre-commit lint hook",
    category: "hooks",
    submittedBy: "jzombie",
    submittedAt: "2026-05-25T15:40:00Z",
    status: "queued",
    description: "Runs the project linter before any edit hook completes. Aborts on failure.",
    sourceUrl: "https://github.com/jzombie/claude-precommit-lint",
    installSnippet: "claude hooks add pre-edit jzombie/claude-precommit-lint",
    safetyNotes: ["Executes the local project linter only; never installs packages."],
    tags: ["hooks", "lint", "pre-edit"],
    reviewThread: [
      { at: "2026-05-25T15:40:00Z", by: "jzombie", tone: "note", body: "Filed. Self-review attached." },
    ],
    raw: { category: "hooks", slug: "pre-commit-lint" },
  },
  {
    id: "S-245",
    title: "Cursor MDC: TypeScript baseline",
    category: "rules",
    submittedBy: "cursor",
    submittedAt: "2026-05-25T11:00:00Z",
    status: "merged",
    description: "A baseline .cursor/rules/typescript.mdc with sensible defaults for strict mode projects.",
    sourceUrl: "https://github.com/cursor/rules-typescript",
    tags: ["cursor", "typescript", "rules"],
    reviewer: "designsystems",
    reviewThread: [
      { at: "2026-05-25T11:00:00Z", by: "cursor", tone: "note", body: "Submission." },
      { at: "2026-05-25T13:30:00Z", by: "designsystems", tone: "approve", body: "Clean. Merged." },
    ],
    raw: { category: "rules", slug: "cursor-typescript-baseline" },
  },
  {
    id: "S-244",
    title: "/refactor command",
    category: "commands",
    submittedBy: "claude-workflows",
    submittedAt: "2026-05-24T18:12:00Z",
    status: "in-review",
    description: "Slash command that scaffolds a multi-step refactor with diff previews and a rollback step.",
    sourceUrl: "https://github.com/claude-workflows/refactor-command",
    tags: ["commands", "refactor"],
    reviewer: "jzombie",
    reviewThread: [
      { at: "2026-05-24T18:12:00Z", by: "claude-workflows", tone: "note", body: "Submission." },
    ],
    raw: { category: "commands", slug: "refactor" },
  },
  {
    id: "S-243",
    title: "Statusline: Git branch + battery",
    category: "statuslines",
    submittedBy: "jzombie",
    submittedAt: "2026-05-24T09:00:00Z",
    status: "queued",
    description: "A bash statusline that renders the current Git branch, dirty state, and battery percentage.",
    sourceUrl: "https://github.com/jzombie/statusline-git-battery",
    tags: ["statuslines", "bash"],
    reviewThread: [{ at: "2026-05-24T09:00:00Z", by: "jzombie", tone: "note", body: "Filed." }],
    raw: { category: "statuslines", slug: "git-battery" },
  },
  {
    id: "S-242",
    title: "Ship a Skill in 10 minutes",
    category: "guides",
    submittedBy: "anthropic",
    submittedAt: "2026-05-23T12:00:00Z",
    status: "merged",
    description: "A short guide that walks through building, validating, and shipping a Claude Skill.",
    sourceUrl: "https://github.com/anthropic/skill-quickstart",
    tags: ["guide", "skills"],
    reviewer: "designsystems",
    reviewThread: [
      { at: "2026-05-23T12:00:00Z", by: "anthropic", tone: "note", body: "Submission." },
      { at: "2026-05-23T15:00:00Z", by: "designsystems", tone: "approve", body: "Merged with light copy edits." },
    ],
    raw: { category: "guides", slug: "ship-a-skill" },
  },
  {
    id: "S-241",
    title: "Legacy CLI wrapper",
    category: "tools",
    submittedBy: "unknown",
    submittedAt: "2026-05-22T22:30:00Z",
    status: "rejected",
    description: "A CLI wrapper around a deprecated tool.",
    sourceUrl: "https://example.com/legacy-cli",
    tags: ["cli"],
    note: "Source URL unreachable; resubmit with provenance.",
    reviewer: "wong2",
    reviewThread: [
      { at: "2026-05-22T22:30:00Z", by: "unknown", tone: "note", body: "Submission." },
      { at: "2026-05-23T08:14:00Z", by: "wong2", tone: "reject", body: "Source URL 404s and no GitHub identity attached. Returning." },
    ],
    raw: { category: "tools", slug: "legacy-cli" },
  },
  {
    id: "S-240",
    title: "Notion MCP",
    category: "mcp",
    submittedBy: "notion-community",
    submittedAt: "2026-05-22T10:00:00Z",
    status: "in-review",
    description: "Read-only MCP server for Notion databases.",
    sourceUrl: "https://github.com/notion-community/notion-mcp",
    tags: ["mcp", "notion"],
    note: "Awaiting safety + privacy notes.",
    reviewer: "wong2",
    reviewThread: [
      { at: "2026-05-22T10:00:00Z", by: "notion-community", tone: "note", body: "Submission." },
      { at: "2026-05-22T16:00:00Z", by: "wong2", tone: "request-changes", body: "Needs explicit safety + privacy notes for the OAuth scopes." },
    ],
    raw: { category: "mcp", slug: "notion-mcp" },
  },
  {
    id: "S-239",
    title: "Agent: SRE on-call",
    category: "agents",
    submittedBy: "ops-guild",
    submittedAt: "2026-05-21T19:00:00Z",
    status: "merged",
    description: "An agent that triages PagerDuty incidents and proposes a remediation runbook.",
    sourceUrl: "https://github.com/ops-guild/sre-oncall-agent",
    tags: ["agents", "sre"],
    reviewer: "ops-guild",
    reviewThread: [
      { at: "2026-05-21T19:00:00Z", by: "ops-guild", tone: "note", body: "Submission." },
      { at: "2026-05-21T22:00:00Z", by: "ops-guild", tone: "approve", body: "Approved by another guild member." },
    ],
    raw: { category: "agents", slug: "sre-oncall" },
  },
  {
    id: "S-238",
    title: "Skill: design tokens linter",
    category: "skills",
    submittedBy: "designsystems",
    submittedAt: "2026-05-20T13:00:00Z",
    status: "queued",
    description: "A Skill that flags raw color values in components and points to the matching token.",
    sourceUrl: "https://github.com/designsystems/tokens-linter-skill",
    tags: ["skills", "tokens"],
    reviewThread: [{ at: "2026-05-20T13:00:00Z", by: "designsystems", tone: "note", body: "Filed." }],
    raw: { category: "skills", slug: "design-tokens-linter" },
  },
];

export const STATUS_META: Record<SubmissionStatus, { label: string; tone: string }> = {
  queued: { label: "Queued", tone: "border-border bg-surface text-ink-muted" },
  "in-review": { label: "In review", tone: "border-accent/40 bg-accent/15 text-ink" },
  merged: { label: "Merged", tone: "border-trust-trusted/40 bg-trust-trusted/10 text-ink" },
  rejected: { label: "Returned", tone: "border-trust-blocked/40 bg-trust-blocked/10 text-ink" },
};

export const TONE_META: Record<ReviewTone, { label: string; tone: string }> = {
  note: { label: "Note", tone: "border-border bg-surface text-ink-muted" },
  "request-changes": { label: "Requested changes", tone: "border-trust-review/40 bg-trust-review/10 text-ink" },
  approve: { label: "Approved", tone: "border-trust-trusted/40 bg-trust-trusted/10 text-ink" },
  reject: { label: "Returned", tone: "border-trust-blocked/40 bg-trust-blocked/10 text-ink" },
};

export function getSubmission(id: string): SubmissionDossier | undefined {
  return SUBMISSIONS.find((s) => s.id === id);
}
