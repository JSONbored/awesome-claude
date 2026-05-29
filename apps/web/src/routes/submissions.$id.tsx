import * as React from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, MessageSquare, RotateCcw, UserRound, X } from "lucide-react";
import {
  SUBMISSIONS,
  STATUS_META,
  TONE_META,
  getSubmission,
  type ReviewTone,
  type SubmissionDossier,
} from "@/mocks/submissions";
import { CATEGORIES } from "@/types/registry";
import { CopyButton } from "@/components/copy-button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/submissions/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.id} — Submission · HeyClaude` },
      { name: "description", content: "Submission dossier with reviewer thread and approve/return actions." },
    ],
  }),
  loader: ({ params }) => {
    const dossier = getSubmission(params.id);
    if (!dossier) throw notFound();
    const idx = SUBMISSIONS.findIndex((s) => s.id === params.id);
    return {
      dossier,
      prev: idx > 0 ? SUBMISSIONS[idx - 1].id : null,
      next: idx < SUBMISSIONS.length - 1 ? SUBMISSIONS[idx + 1].id : null,
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-md px-4 py-24 text-center sm:px-6">
      <h1 className="font-display text-2xl font-semibold text-ink">Submission not found</h1>
      <p className="mt-2 text-sm text-ink-muted">It may have been merged or returned.</p>
      <Link
        to="/submissions"
        className="mt-6 inline-flex h-9 items-center rounded-md border border-border bg-surface px-3 text-sm font-medium text-ink hover:bg-surface-2"
      >
        Back to queue
      </Link>
    </div>
  ),
  component: SubmissionDetailPage,
});

function SubmissionDetailPage() {
  const { dossier, prev, next } = Route.useLoaderData() as {
    dossier: SubmissionDossier;
    prev: string | null;
    next: string | null;
  };
  const [showRaw, setShowRaw] = React.useState(false);
  const [compose, setCompose] = React.useState("");
  const [composeTone, setComposeTone] = React.useState<ReviewTone>("note");

  const status = STATUS_META[dossier.status];
  const category = CATEGORIES.find((c) => c.id === dossier.category);

  const act = (label: string) => toast.success(`${label} (mock)`, { description: `Submission ${dossier.id}` });

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6">
      <nav className="flex items-center justify-between text-xs text-ink-muted">
        <Link to="/submissions" className="inline-flex items-center gap-1.5 hover:text-ink">
          <ArrowLeft className="h-3.5 w-3.5" /> Submission queue
        </Link>
        <div className="flex items-center gap-2">
          {prev && (
            <Link to="/submissions/$id" params={{ id: prev }} className="font-mono hover:text-ink">
              ← {prev}
            </Link>
          )}
          {next && (
            <Link to="/submissions/$id" params={{ id: next }} className="font-mono hover:text-ink">
              {next} →
            </Link>
          )}
        </div>
      </nav>

      <header className="mt-6 flex flex-col gap-5 border-b border-border pb-8 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-xs text-ink-muted">
              {dossier.id}
            </code>
            <span className="rounded-md border border-border bg-surface px-2 py-0.5 text-[11px] text-ink-muted">
              {category?.label ?? dossier.category}
            </span>
            <span className={cn("inline-flex items-center rounded-md border px-2 py-0.5 text-[11px]", status.tone)}>
              {status.label}
            </span>
          </div>
          <h1 className="mt-3 h-display-1 text-ink text-balance">
            {dossier.title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-muted">
            <span className="inline-flex items-center gap-1.5">
              <UserRound className="h-3.5 w-3.5" />
              <Link to="/contributors/$slug" params={{ slug: dossier.submittedBy }} className="hover:text-ink">
                @{dossier.submittedBy}
              </Link>
            </span>
            <span className="font-mono">submitted {dossier.submittedAt.slice(0, 10)}</span>
            {dossier.reviewer && (
              <span className="font-mono">
                reviewer ·{" "}
                <Link
                  to="/validators"
                  className="hover:text-ink"
                >
                  @{dossier.reviewer}
                </Link>
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => act("Approved")}
            className="inline-flex h-9 items-center gap-1.5 rounded-md bg-trust-trusted px-3 text-sm font-medium text-background hover:opacity-90"
          >
            <Check className="h-3.5 w-3.5" /> Approve
          </button>
          <button
            type="button"
            onClick={() => act("Changes requested")}
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-surface px-3 text-sm font-medium text-ink hover:bg-surface-2"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Request changes
          </button>
          <button
            type="button"
            onClick={() => act("Returned")}
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-surface px-3 text-sm font-medium text-ink hover:bg-surface-2"
          >
            <X className="h-3.5 w-3.5" /> Return
          </button>
        </div>
      </header>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          <Section title="Description">
            <p className="text-sm leading-relaxed text-ink">{dossier.description}</p>
          </Section>

          <Section title="Source">
            <a
              href={dossier.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="break-all font-mono text-sm text-ink hover:underline"
            >
              {dossier.sourceUrl}
            </a>
          </Section>

          {dossier.installSnippet && (
            <Section title="Install" right={<CopyButton value={dossier.installSnippet} />}>
              <pre className="overflow-x-auto rounded-md bg-background p-3 font-mono text-xs text-ink">
{dossier.installSnippet}
              </pre>
            </Section>
          )}

          {dossier.configSnippet && (
            <Section title="Config" right={<CopyButton value={dossier.configSnippet} />}>
              <pre className="overflow-x-auto rounded-md bg-background p-3 font-mono text-xs text-ink">
{dossier.configSnippet}
              </pre>
            </Section>
          )}

          {dossier.safetyNotes && dossier.safetyNotes.length > 0 && (
            <Section title="Safety notes">
              <ul className="space-y-1.5 text-sm text-ink-muted">
                {dossier.safetyNotes.map((n, i) => (
                  <li key={i}>· {n}</li>
                ))}
              </ul>
            </Section>
          )}

          {dossier.privacyNotes && dossier.privacyNotes.length > 0 && (
            <Section title="Privacy notes">
              <ul className="space-y-1.5 text-sm text-ink-muted">
                {dossier.privacyNotes.map((n, i) => (
                  <li key={i}>· {n}</li>
                ))}
              </ul>
            </Section>
          )}

          <Section title="Tags">
            <div className="flex flex-wrap gap-1.5">
              {dossier.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-md border border-border bg-surface px-2 py-0.5 font-mono text-[11px] text-ink-muted"
                >
                  {t}
                </span>
              ))}
            </div>
          </Section>

          <Section
            title="Raw payload"
            right={
              <button
                type="button"
                onClick={() => setShowRaw((v) => !v)}
                className="text-xs text-ink-muted hover:text-ink"
              >
                {showRaw ? "Hide" : "Show"}
              </button>
            }
          >
            {showRaw && (
              <pre className="overflow-x-auto rounded-md bg-background p-3 font-mono text-[11px] text-ink-muted">
{JSON.stringify(dossier.raw, null, 2)}
              </pre>
            )}
          </Section>
        </div>

        <aside>
          <div className="sticky top-20 space-y-4">
            <div className="rounded-xl border border-border bg-surface">
              <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                <MessageSquare className="h-4 w-4 text-ink-muted" />
                <div className="eyebrow">Review thread</div>
                <span className="ml-auto font-mono text-[11px] text-ink-subtle">
                  {dossier.reviewThread.length}
                </span>
              </div>
              <ol className="max-h-[420px] divide-y divide-border overflow-auto">
                {dossier.reviewThread.map((n, i) => {
                  const meta = TONE_META[n.tone];
                  return (
                    <li key={i} className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <Link
                          to="/contributors/$slug"
                          params={{ slug: n.by }}
                          className="font-mono text-ink hover:underline"
                        >
                          @{n.by}
                        </Link>
                        <span className={cn("inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px]", meta.tone)}>
                          {meta.label}
                        </span>
                        <span className="ml-auto font-mono text-[10px] text-ink-subtle">
                          {n.at.slice(0, 16).replace("T", " ")}
                        </span>
                      </div>
                      <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{n.body}</p>
                    </li>
                  );
                })}
              </ol>
              <form
                className="border-t border-border p-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!compose.trim()) return;
                  act(`Posted ${TONE_META[composeTone].label.toLowerCase()}`);
                  setCompose("");
                }}
              >
                <textarea
                  value={compose}
                  onChange={(e) => setCompose(e.target.value)}
                  rows={3}
                  placeholder="Leave a reviewer note…"
                  className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm text-ink placeholder:text-ink-subtle focus:border-ink focus:outline-none"
                />
                <div className="mt-2 flex items-center justify-between gap-2">
                  <select
                    value={composeTone}
                    onChange={(e) => setComposeTone(e.target.value as ReviewTone)}
                    className="rounded-md border border-border bg-surface px-2 py-1 text-xs text-ink"
                  >
                    <option value="note">Note</option>
                    <option value="request-changes">Request changes</option>
                    <option value="approve">Approve</option>
                    <option value="reject">Return</option>
                  </select>
                  <button
                    type="submit"
                    disabled={!compose.trim()}
                    className="inline-flex h-8 items-center rounded-md bg-ink px-3 text-xs font-medium text-background hover:bg-ink/90 disabled:opacity-50"
                  >
                    Post
                  </button>
                </div>
              </form>
            </div>

            {next && (
              <Link
                to="/submissions/$id"
                params={{ id: next }}
                className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3 text-sm text-ink hover:bg-surface-2"
              >
                <span className="text-ink-muted">Next in queue</span>
                <span className="inline-flex items-center gap-1 font-mono">
                  {next} <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            )}
          </div>
        </aside>
      </div>
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
