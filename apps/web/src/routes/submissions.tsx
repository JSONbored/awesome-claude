import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, CheckCircle2, GitPullRequest, XCircle } from "lucide-react";
import { CATEGORIES, type Category } from "@/types/registry";
import { cn } from "@/lib/utils";

type Status = "queued" | "in-review" | "merged" | "rejected";

interface QueueItem {
  id: string;
  title: string;
  category: Category;
  submittedBy: string;
  submittedAt: string;
  status: Status;
  note?: string;
  issueUrl?: string;
}

const QUEUE: QueueItem[] = [
  { id: "S-247", title: "Postgres explain-plan MCP", category: "mcp", submittedBy: "wong2", submittedAt: "2026-05-26", status: "in-review", note: "Verifying credentials scope." },
  { id: "S-246", title: "Pre-commit lint hook", category: "hooks", submittedBy: "jzombie", submittedAt: "2026-05-25", status: "queued" },
  { id: "S-245", title: "Cursor MDC: TypeScript baseline", category: "rules", submittedBy: "cursor", submittedAt: "2026-05-25", status: "merged" },
  { id: "S-244", title: "/refactor command", category: "commands", submittedBy: "claude-workflows", submittedAt: "2026-05-24", status: "in-review" },
  { id: "S-243", title: "Statusline: Git branch + battery", category: "statuslines", submittedBy: "jzombie", submittedAt: "2026-05-24", status: "queued" },
  { id: "S-242", title: "Ship a Skill in 10 minutes", category: "guides", submittedBy: "anthropic", submittedAt: "2026-05-23", status: "merged" },
  { id: "S-241", title: "Legacy CLI wrapper", category: "tools", submittedBy: "unknown", submittedAt: "2026-05-22", status: "rejected", note: "Source URL unreachable; resubmit with provenance." },
  { id: "S-240", title: "Notion MCP", category: "mcp", submittedBy: "notion-community", submittedAt: "2026-05-22", status: "in-review", note: "Awaiting safety + privacy notes." },
  { id: "S-239", title: "Agent: SRE on-call", category: "agents", submittedBy: "ops-guild", submittedAt: "2026-05-21", status: "merged" },
  { id: "S-238", title: "Skill: design tokens linter", category: "skills", submittedBy: "designsystems", submittedAt: "2026-05-20", status: "queued" },
];

const STATUS_META = {
  queued: { icon: Clock, label: "Queued", tone: "border-border bg-surface text-ink-muted" },
  "in-review": { icon: GitPullRequest, label: "In review", tone: "border-accent/40 bg-accent/15 text-ink" },
  merged: { icon: CheckCircle2, label: "Merged", tone: "border-trust-trusted/40 bg-trust-trusted/10 text-ink" },
  rejected: { icon: XCircle, label: "Returned", tone: "border-trust-blocked/40 bg-trust-blocked/10 text-ink" },
} as const;

export const Route = createFileRoute("/submissions")({
  head: () => ({
    meta: [
      { title: "Submission queue — HeyClaude" },
      { name: "description", content: "Public queue of submissions in review, merged, and returned across the HeyClaude registry." },
      { property: "og:title", content: "Submission queue — HeyClaude" },
      { property: "og:description", content: "Transparent look at what's in review and what's landed." },
    ],
  }),
  component: SubmissionsPage,
});

function SubmissionsPage() {
  const counts = QUEUE.reduce<Record<Status, number>>(
    (acc, q) => ({ ...acc, [q.status]: (acc[q.status] ?? 0) + 1 }),
    { queued: 0, "in-review": 0, merged: 0, rejected: 0 },
  );

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-12 sm:px-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="eyebrow">Public queue</div>
          <h1 className="mt-2 h-display-1 text-ink text-balance">
            Submission queue
          </h1>
          <p className="mt-3 max-w-xl text-ink-muted">
            Everything submitted to the registry shows up here. Reviewers leave a note when they return
            something — usually missing source URL, missing safety notes, or a duplicate.
          </p>
        </div>
        <Link
          to="/submit"
          className="inline-flex h-9 shrink-0 items-center rounded-md bg-ink px-3 text-sm font-medium text-background hover:bg-ink/90"
        >
          Submit a resource
        </Link>
      </div>

      <div className="mt-8 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-4">
        {(["in-review", "queued", "merged", "rejected"] as Status[]).map((s) => {
          const meta = STATUS_META[s];
          const Icon = meta.icon;
          return (
            <div key={s} className="bg-surface p-5">
              <div className="flex items-center justify-between">
                <Icon className="h-4 w-4 text-ink-muted" />
                <span className="font-mono text-xs text-ink-subtle">{meta.label}</span>
              </div>
              <div className="mt-3 font-display text-3xl font-semibold text-ink">{counts[s]}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 overflow-hidden rounded-xl border border-border bg-surface">
        <div className="hidden grid-cols-[80px_1fr_100px_140px_120px_120px] gap-4 border-b border-border bg-surface-2 px-5 py-2 text-[11px] uppercase tracking-wider text-ink-subtle md:grid">
          <span>ID</span>
          <span>Title</span>
          <span>Category</span>
          <span>Submitted by</span>
          <span>Submitted</span>
          <span>Status</span>
        </div>
        {QUEUE.map((q) => {
          const meta = STATUS_META[q.status];
          const Icon = meta.icon;
          const category = CATEGORIES.find((c) => c.id === q.category);
          return (
            <div key={q.id} className="border-b border-border px-5 py-3 last:border-0">
              <div className="grid grid-cols-1 items-center gap-3 md:grid-cols-[80px_1fr_100px_140px_120px_120px] md:gap-4">
                <code className="font-mono text-xs text-ink-subtle">{q.id}</code>
                <div className="text-sm font-medium text-ink">{q.title}</div>
                <span className="rounded-md border border-border bg-background px-2 py-0.5 text-[11px] text-ink-muted w-fit">
                  {category?.label ?? q.category}
                </span>
                <Link
                  to="/contributors/$slug"
                  params={{ slug: q.submittedBy }}
                  className="truncate font-mono text-xs text-ink-muted hover:text-ink"
                >
                  @{q.submittedBy}
                </Link>
                <span className="font-mono text-xs text-ink-subtle">{q.submittedAt}</span>
                <span className={cn("inline-flex w-fit items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px]", meta.tone)}>
                  <Icon className="h-3 w-3" /> {meta.label}
                </span>
              </div>
              {q.note && (
                <div className="mt-2 text-xs text-ink-muted md:pl-[88px]">{q.note}</div>
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-xs text-ink-subtle">
        Queue refreshes from <code className="rounded bg-surface px-1 py-0.5 font-mono">/api/submissions</code>{" "}
        every hour. Status reflects reviewer state, not automated checks.
      </p>
    </div>
  );
}
