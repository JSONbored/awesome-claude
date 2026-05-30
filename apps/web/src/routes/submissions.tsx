import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, CheckCircle2, Clock, GitPullRequest, XCircle } from "lucide-react";
import { CATEGORIES } from "@/types/registry";
import { cn } from "@/lib/utils";

type QueueStatus =
  | "queued"
  | "in_review"
  | "ready"
  | "approved"
  | "import_pr_open"
  | "needs_author_input"
  | "source_needs_verification"
  | "stale"
  | "imported"
  | "closed";

interface QueueItem {
  number: number;
  url: string;
  title: string;
  author: string;
  authorUrl?: string;
  category: string;
  slug: string;
  status: QueueStatus;
  state: "open" | "closed";
  labels: string[];
  blockers: string[];
  updatedAt: string;
  bodyFingerprint?: string;
  bodyUpdatedAt?: string;
  authorCommentedAfterReview?: boolean;
  authorCommentedWithoutBodyUpdate?: boolean;
  lastAuthorCommentAt?: string;
  createdAt: string;
  closedAt?: string | null;
  importPrUrl?: string;
}

interface QueueResponse {
  ok: true;
  generatedAt: string;
  repo: string;
  count: number;
  entries: QueueItem[];
}

const STATUS_META: Record<
  QueueStatus,
  {
    icon: typeof Clock;
    label: string;
    tone: string;
    group: "active" | "ready" | "blocked" | "done";
  }
> = {
  queued: {
    icon: Clock,
    label: "Queued",
    tone: "border-border bg-surface text-ink-muted",
    group: "active",
  },
  in_review: {
    icon: GitPullRequest,
    label: "In review",
    tone: "border-accent/40 bg-accent/15 text-ink",
    group: "active",
  },
  ready: {
    icon: CheckCircle2,
    label: "Ready for maintainer",
    tone: "border-trust-trusted/40 bg-trust-trusted/10 text-ink",
    group: "ready",
  },
  approved: {
    icon: CheckCircle2,
    label: "Approved for import",
    tone: "border-trust-trusted/40 bg-trust-trusted/10 text-ink",
    group: "ready",
  },
  import_pr_open: {
    icon: GitPullRequest,
    label: "Import PR open",
    tone: "border-trust-trusted/40 bg-trust-trusted/10 text-ink",
    group: "ready",
  },
  needs_author_input: {
    icon: AlertTriangle,
    label: "Needs author input",
    tone: "border-trust-blocked/40 bg-trust-blocked/10 text-ink",
    group: "blocked",
  },
  source_needs_verification: {
    icon: AlertTriangle,
    label: "Source needs verification",
    tone: "border-trust-review/40 bg-trust-review/10 text-ink",
    group: "blocked",
  },
  stale: {
    icon: AlertTriangle,
    label: "Stale",
    tone: "border-trust-blocked/40 bg-trust-blocked/10 text-ink",
    group: "blocked",
  },
  imported: {
    icon: CheckCircle2,
    label: "Imported",
    tone: "border-trust-trusted/40 bg-trust-trusted/10 text-ink",
    group: "done",
  },
  closed: {
    icon: XCircle,
    label: "Closed",
    tone: "border-trust-blocked/40 bg-trust-blocked/10 text-ink",
    group: "done",
  },
};

export const Route = createFileRoute("/submissions")({
  head: () => ({
    meta: [
      { title: "Submission queue — HeyClaude" },
      {
        name: "description",
        content:
          "Public queue of source-backed HeyClaude submissions with live GitHub issue status.",
      },
      { property: "og:title", content: "Submission queue — HeyClaude" },
      {
        property: "og:description",
        content: "Transparent read-only view of what's queued, blocked, approved, and imported.",
      },
    ],
  }),
  component: SubmissionsPage,
});

function useSubmissionQueue() {
  const [data, setData] = React.useState<QueueResponse | null>(null);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const response = await fetch("/api/submissions/queue?limit=25");
        const payload = (await response.json().catch(() => null)) as
          | QueueResponse
          | { error?: { message?: string } }
          | null;
        if (!response.ok || !payload || !("entries" in payload)) {
          throw new Error(
            payload && "error" in payload
              ? payload.error?.message || "Could not load submission queue."
              : "Could not load submission queue.",
          );
        }
        if (!cancelled) {
          setData(payload);
          setError("");
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not load submission queue.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { data, error, loading };
}

function SubmissionsPage() {
  const { data, error, loading } = useSubmissionQueue();
  const entries = data?.entries ?? [];
  const counts = React.useMemo(() => {
    const next = { active: 0, ready: 0, blocked: 0, done: 0 };
    for (const entry of entries) next[STATUS_META[entry.status].group] += 1;
    return next;
  }, [entries]);

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-12 sm:px-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="eyebrow">Public queue</div>
          <h1 className="mt-2 h-display-1 text-ink text-balance">Submission queue</h1>
          <p className="mt-3 max-w-xl text-ink-muted">
            Read-only status pulled from public GitHub content-submission issues. Approval, import,
            and review still happen on GitHub after maintainer review.
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
        {[
          ["active", "Active"],
          ["ready", "Maintainer-ready"],
          ["blocked", "Needs changes"],
          ["done", "Closed/imported"],
        ].map(([key, label]) => (
          <div key={key} className="bg-surface p-5">
            <div className="flex items-center justify-between">
              <Clock className="h-4 w-4 text-ink-muted" />
              <span className="font-mono text-xs text-ink-subtle">{label}</span>
            </div>
            <div className="mt-3 font-display text-3xl font-semibold text-ink">
              {counts[key as keyof typeof counts]}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 overflow-hidden rounded-xl border border-border bg-surface">
        <div className="hidden grid-cols-[80px_1fr_100px_140px_130px_170px] gap-4 border-b border-border bg-surface-2 px-5 py-2 text-[11px] uppercase tracking-wider text-ink-subtle md:grid">
          <span>Issue</span>
          <span>Title</span>
          <span>Category</span>
          <span>Submitted by</span>
          <span>Updated</span>
          <span>Status</span>
        </div>

        {loading && (
          <div className="px-5 py-8 text-sm text-ink-muted">
            Loading public GitHub submission queue…
          </div>
        )}

        {!loading && error && <div className="px-5 py-8 text-sm text-trust-blocked">{error}</div>}

        {!loading && !error && entries.length === 0 && (
          <div className="px-5 py-8 text-sm text-ink-muted">
            No public content submissions are currently visible.
          </div>
        )}

        {entries.map((q) => {
          const meta = STATUS_META[q.status];
          const Icon = meta.icon;
          const category = CATEGORIES.find((c) => c.id === q.category);
          return (
            <div key={q.number} className="border-b border-border px-5 py-3 last:border-0">
              <div className="grid grid-cols-1 items-center gap-3 md:grid-cols-[80px_1fr_100px_140px_130px_170px] md:gap-4">
                <Link
                  to="/submissions/$id"
                  params={{ id: String(q.number) }}
                  className="font-mono text-xs text-ink-subtle hover:text-ink"
                >
                  #{q.number}
                </Link>
                <div className="min-w-0">
                  <Link
                    to="/submissions/$id"
                    params={{ id: String(q.number) }}
                    className="block truncate text-sm font-medium text-ink hover:underline"
                  >
                    {q.title}
                  </Link>
                  <code className="font-mono text-[11px] text-ink-subtle">
                    {q.category}/{q.slug}
                  </code>
                </div>
                <span className="w-fit rounded-md border border-border bg-background px-2 py-0.5 text-[11px] text-ink-muted">
                  {category?.label ?? q.category}
                </span>
                <a
                  href={q.authorUrl || `https://github.com/${q.author}`}
                  target="_blank"
                  rel="noreferrer"
                  className="truncate font-mono text-xs text-ink-muted hover:text-ink"
                >
                  @{q.author}
                </a>
                <span className="font-mono text-xs text-ink-subtle">
                  {q.updatedAt.slice(0, 10)}
                </span>
                <span
                  className={cn(
                    "inline-flex w-fit items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px]",
                    meta.tone,
                  )}
                >
                  <Icon className="h-3 w-3" /> {meta.label}
                </span>
              </div>
              {q.blockers.length > 0 && (
                <ul className="mt-2 space-y-1 text-xs text-ink-muted md:pl-[88px]">
                  {q.blockers.map((blocker) => (
                    <li key={blocker}>- {blocker}</li>
                  ))}
                </ul>
              )}
              {q.authorCommentedWithoutBodyUpdate && (
                <div className="mt-2 text-xs text-trust-blocked md:pl-[88px]">
                  Author replied after review, but the original issue body still needs to be edited
                  before validation can move forward.
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-xs text-ink-subtle">
        Queue data comes from{" "}
        <code className="rounded bg-surface px-1 py-0.5 font-mono">/api/submissions/queue</code>
        {data?.generatedAt ? ` · refreshed ${data.generatedAt.slice(0, 16).replace("T", " ")}` : ""}
        . This page is read-only and cannot approve, reject, label, or import submissions.
      </p>
    </div>
  );
}
