import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  ExternalLink,
  GitPullRequest,
  MessageSquare,
  ShieldAlert,
  UserRound,
  XCircle,
} from "lucide-react";
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

const STATUS_META: Record<QueueStatus, { icon: typeof Clock; label: string; tone: string }> = {
  queued: { icon: Clock, label: "Queued", tone: "border-border bg-surface text-ink-muted" },
  in_review: {
    icon: GitPullRequest,
    label: "In review",
    tone: "border-accent/40 bg-accent/15 text-ink",
  },
  ready: {
    icon: CheckCircle2,
    label: "Ready for maintainer",
    tone: "border-trust-trusted/40 bg-trust-trusted/10 text-ink",
  },
  approved: {
    icon: CheckCircle2,
    label: "Approved for import",
    tone: "border-trust-trusted/40 bg-trust-trusted/10 text-ink",
  },
  import_pr_open: {
    icon: GitPullRequest,
    label: "Import PR open",
    tone: "border-trust-trusted/40 bg-trust-trusted/10 text-ink",
  },
  needs_author_input: {
    icon: ShieldAlert,
    label: "Needs author input",
    tone: "border-trust-blocked/40 bg-trust-blocked/10 text-ink",
  },
  source_needs_verification: {
    icon: ShieldAlert,
    label: "Source needs verification",
    tone: "border-trust-review/40 bg-trust-review/10 text-ink",
  },
  stale: {
    icon: ShieldAlert,
    label: "Stale",
    tone: "border-trust-blocked/40 bg-trust-blocked/10 text-ink",
  },
  imported: {
    icon: CheckCircle2,
    label: "Imported",
    tone: "border-trust-trusted/40 bg-trust-trusted/10 text-ink",
  },
  closed: {
    icon: XCircle,
    label: "Closed",
    tone: "border-trust-blocked/40 bg-trust-blocked/10 text-ink",
  },
};

export const Route = createFileRoute("/submissions/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Submission #${params.id} — HeyClaude` },
      {
        name: "description",
        content: "Read-only public submission status from the linked GitHub issue.",
      },
    ],
  }),
  component: SubmissionDetailPage,
});

function useSubmission(number: string) {
  const [item, setItem] = React.useState<QueueItem | null>(null);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const response = await fetch(`/api/submissions/queue?number=${encodeURIComponent(number)}`);
        const payload = (await response.json().catch(() => null)) as
          | { ok: true; entries: QueueItem[] }
          | { error?: { message?: string } }
          | null;
        if (!response.ok || !payload || !("entries" in payload)) {
          throw new Error(
            payload && "error" in payload
              ? payload.error?.message || "Submission not found."
              : "Submission not found.",
          );
        }
        if (!cancelled) {
          setItem(payload.entries[0] ?? null);
          setError(payload.entries[0] ? "" : "Submission not found.");
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Submission not found.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [number]);

  return { item, error, loading };
}

function SubmissionDetailPage() {
  const { id } = Route.useParams();
  const { item, error, loading } = useSubmission(id);
  const meta = item ? STATUS_META[item.status] : null;
  const Icon = meta?.icon ?? Clock;
  const category = item ? CATEGORIES.find((c) => c.id === item.category) : null;

  return (
    <div className="mx-auto max-w-[1050px] px-4 py-10 sm:px-6">
      <nav className="flex items-center justify-between text-xs text-ink-muted">
        <Link to="/submissions" className="inline-flex items-center gap-1.5 hover:text-ink">
          <ArrowLeft className="h-3.5 w-3.5" /> Submission queue
        </Link>
      </nav>

      {loading && (
        <div className="mt-12 rounded-xl border border-border bg-surface p-8 text-sm text-ink-muted">
          Loading submission from GitHub…
        </div>
      )}

      {!loading && error && (
        <div className="mt-12 rounded-xl border border-trust-blocked/40 bg-trust-blocked/10 p-8 text-sm text-ink">
          <h1 className="font-display text-2xl font-semibold">Submission not available</h1>
          <p className="mt-2 text-ink-muted">{error}</p>
        </div>
      )}

      {!loading && item && meta && (
        <>
          <header className="mt-6 flex flex-col gap-5 border-b border-border pb-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-xs text-ink-muted">
                  #{item.number}
                </code>
                <span className="rounded-md border border-border bg-surface px-2 py-0.5 text-[11px] text-ink-muted">
                  {category?.label ?? item.category}
                </span>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px]",
                    meta.tone,
                  )}
                >
                  <Icon className="h-3 w-3" /> {meta.label}
                </span>
              </div>
              <h1 className="mt-3 h-display-1 text-ink text-balance">{item.title}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-muted">
                <span className="inline-flex items-center gap-1.5">
                  <UserRound className="h-3.5 w-3.5" />
                  <a
                    href={item.authorUrl || `https://github.com/${item.author}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-ink"
                  >
                    @{item.author}
                  </a>
                </span>
                <span className="font-mono">created {item.createdAt.slice(0, 10)}</span>
                <span className="font-mono">updated {item.updatedAt.slice(0, 10)}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-9 items-center gap-1.5 rounded-md bg-ink px-3 text-sm font-medium text-background hover:opacity-90"
              >
                Open GitHub issue <ExternalLink className="h-3.5 w-3.5" />
              </a>
              {item.importPrUrl && (
                <a
                  href={item.importPrUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-surface px-3 text-sm font-medium text-ink hover:bg-surface-2"
                >
                  Import PR <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </header>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
            <div className="space-y-8">
              <Section title="Public status">
                <p className="text-sm leading-relaxed text-ink-muted">
                  This is a sanitized, read-only projection of the public GitHub issue. Review
                  decisions, author discussion, labels, and import actions are maintained on GitHub.
                </p>
              </Section>

              <Section title="Registry target">
                <div className="rounded-md border border-border bg-surface px-3 py-2 font-mono text-sm text-ink">
                  {item.category}/{item.slug}
                </div>
              </Section>

              <Section title="Validation source">
                <div className="grid gap-2 text-sm text-ink-muted sm:grid-cols-2">
                  <div className="rounded-md border border-border bg-surface px-3 py-2">
                    <div className="font-mono text-[11px] uppercase tracking-wider text-ink-subtle">
                      Issue body last edited
                    </div>
                    <div className="mt-1 font-mono text-ink">
                      {item.bodyUpdatedAt ? item.bodyUpdatedAt.slice(0, 10) : "unknown"}
                    </div>
                  </div>
                  <div className="rounded-md border border-border bg-surface px-3 py-2">
                    <div className="font-mono text-[11px] uppercase tracking-wider text-ink-subtle">
                      Author reply state
                    </div>
                    <div className="mt-1 text-ink">
                      {item.authorCommentedWithoutBodyUpdate
                        ? "Reply needs issue-body edit"
                        : "No unresolved body-edit mismatch"}
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-xs text-ink-subtle">
                  Validation uses the issue body fields as the source of truth. Comments do not
                  update import eligibility.
                </p>
              </Section>

              {item.blockers.length > 0 && (
                <Section title="Current blockers">
                  <ul className="space-y-2 text-sm text-ink-muted">
                    {item.blockers.map((blocker) => (
                      <li
                        key={blocker}
                        className="rounded-md border border-trust-blocked/30 bg-trust-blocked/10 px-3 py-2"
                      >
                        {blocker}
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              <Section title="Labels">
                <div className="flex flex-wrap gap-1.5">
                  {item.labels.map((label) => (
                    <span
                      key={label}
                      className="rounded-md border border-border bg-surface px-2 py-0.5 font-mono text-[11px] text-ink-muted"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </Section>
            </div>

            <aside className="space-y-4">
              <div className="rounded-xl border border-border bg-surface p-5">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-ink-muted" />
                  <div className="eyebrow">Review discussion</div>
                </div>
                <p className="mt-3 text-sm text-ink-muted">
                  Full reviewer comments and author replies stay on the GitHub issue so public
                  status cannot drift from maintainer action.
                </p>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex h-9 items-center rounded-md border border-border bg-background px-3 text-sm font-medium text-ink hover:bg-surface-2"
                >
                  View thread on GitHub
                </a>
              </div>
            </aside>
          </div>
        </>
      )}
    </div>
  );
}

function Section({
  title,
  right,
  children,
}: {
  title: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-2 flex items-center justify-between">
        <div className="eyebrow">{title}</div>
        {right}
      </div>
      {children}
    </section>
  );
}
