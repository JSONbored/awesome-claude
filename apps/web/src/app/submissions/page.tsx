import type { Metadata } from "next";
import Link from "next/link";
import { buildSubmissionQueue } from "@heyclaude/registry/submission";
import type { SubmissionQueueEntry } from "@heyclaude/registry";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { EntryCopyButton } from "@/components/entry-copy-button";
import { JsonLd } from "@/components/json-ld";
import { buildPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import {
  buildBreadcrumbJsonLd,
  buildCollectionPageJsonLd,
} from "@heyclaude/registry/seo";

type GitHubIssue = {
  number: number;
  title: string;
  body: string | null;
  html_url: string;
  updated_at: string;
  user?: {
    login?: string;
  };
  labels: Array<string | { name?: string }>;
  pull_request?: unknown;
};

type SubmissionTriageGroup = SubmissionQueueEntry["triageGroup"];
type SubmissionFilter = "all" | SubmissionTriageGroup;

type SubmissionsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const FILTERS: Array<{ key: SubmissionFilter; label: string }> = [
  { key: "all", label: "All" },
  { key: "ready", label: "Ready" },
  { key: "blocked", label: "Blocked" },
  { key: "maintainer_review", label: "Maintainer review" },
  { key: "needs_author_input", label: "Author input" },
  { key: "source_verification", label: "Source review" },
  { key: "likely_promo_spam", label: "Promo/spam" },
  { key: "stale", label: "Reminder due" },
  { key: "close_eligible", label: "Close eligible" },
  { key: "skipped", label: "Skipped" },
];

export const dynamic = "force-dynamic";
export const revalidate = 300;

export const metadata: Metadata = buildPageMetadata({
  title: "Submission queue",
  description:
    "Track open HeyClaude content submissions, review status, import readiness, and maintainer feedback before entries become public.",
  path: "/submissions",
  keywords: ["heyclaude submissions", "claude resource submission queue"],
});

async function getSubmissionQueue() {
  try {
    const response = await fetch(
      "https://api.github.com/repos/JSONbored/awesome-claude/issues?state=open&per_page=100",
      {
        headers: {
          accept: "application/vnd.github+json",
          "user-agent": "heyclaude-submission-queue",
        },
        next: { revalidate: 300 },
      },
    );

    if (!response.ok) {
      return {
        available: false,
        error: `GitHub responded with ${response.status}`,
        queue: buildSubmissionQueue([]),
      };
    }

    const issues = ((await response.json()) as GitHubIssue[])
      .filter((issue) => !issue.pull_request)
      .map((issue) => ({
        number: issue.number,
        title: issue.title,
        body: issue.body || "",
        url: issue.html_url,
        updatedAt: issue.updated_at,
        author: issue.user?.login || "",
        labels: issue.labels,
      }));

    return {
      available: true,
      error: "",
      queue: buildSubmissionQueue(issues),
    };
  } catch (error) {
    return {
      available: false,
      error: error instanceof Error ? error.message : "Unknown queue error",
      queue: buildSubmissionQueue([]),
    };
  }
}

function statusLabel(status: string) {
  if (status === "import_ready") return "Import ready";
  if (status === "maintainer_review") return "Maintainer review";
  if (status === "needs_author_input") return "Needs author input";
  if (status === "source_needs_verification") return "Source verification";
  if (status === "stale_reminder_due") return "Reminder due";
  if (status === "close_eligible") return "Close eligible";
  return "Skipped";
}

function nextActionLabel(action: SubmissionQueueEntry["nextAction"]) {
  if (action === "import") return "Import after approval";
  if (action === "review_risk") return "Review risk";
  if (action === "verify_source") return "Verify source";
  if (action === "request_author_input") return "Request author input";
  if (action === "send_stale_reminder") return "Send stale reminder";
  if (action === "close_stale") return "Close stale submission";
  return "Skip";
}

function triageLabel(group: SubmissionTriageGroup) {
  if (group === "ready") return "Ready";
  if (group === "blocked") return "Blocked";
  if (group === "needs_author_input") return "Needs author input";
  if (group === "source_verification") return "Source verification";
  if (group === "likely_promo_spam") return "Likely promo/spam";
  if (group === "stale") return "Reminder due";
  if (group === "close_eligible") return "Close eligible";
  if (group === "maintainer_review") return "Maintainer review";
  return "Skipped";
}

function normalizeFilter(value: string | string[] | undefined) {
  const normalized = Array.isArray(value) ? value[0] : value;
  return FILTERS.some((filter) => filter.key === normalized)
    ? (normalized as SubmissionFilter)
    : "all";
}

function filterEntries(
  entries: SubmissionQueueEntry[],
  filter: SubmissionFilter,
) {
  if (filter === "all") return entries;
  return entries.filter((entry) => entry.triageGroup === filter);
}

function filterCount(
  entries: SubmissionQueueEntry[],
  filter: SubmissionFilter,
) {
  return filterEntries(entries, filter).length;
}

function riskClass(entry: SubmissionQueueEntry) {
  if (entry.riskTier === "critical" || entry.riskTier === "high") {
    return "border-destructive/40 bg-destructive/10 text-destructive";
  }
  if (entry.riskTier === "medium") {
    return "border-yellow-500/40 bg-yellow-500/10 text-yellow-300";
  }
  return "border-emerald-500/35 bg-emerald-500/10 text-emerald-300";
}

function safeHttpUrl(value: string) {
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") return "";
    return url.toString();
  } catch {
    return "";
  }
}

function safeHttpsUrl(value: string) {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return "";
    return url.toString();
  } catch {
    return "";
  }
}

function submissionFormHref(category: string) {
  const params = new URLSearchParams();
  const normalizedCategory = category.trim();
  if (normalizedCategory) params.set("category", normalizedCategory);
  const query = params.toString();
  return query ? `/submit?${query}` : "/submit";
}

type SubmissionPageLogger = {
  info: (event: string, meta?: Record<string, unknown>) => void;
  error: (event: string, meta?: Record<string, unknown>) => void;
};

function writeSubmissionPageLog(
  level: "info" | "error",
  event: string,
  requestId: string,
  meta: Record<string, unknown> = {},
) {
  const payload = {
    ts: new Date().toISOString(),
    level,
    event,
    requestId,
    ...meta,
  };
  const line = JSON.stringify(payload);
  if (level === "error") {
    console.error(line);
    return;
  }
  console.info(line);
}

function createSubmissionPageLogger(requestId: string): SubmissionPageLogger {
  return {
    info(event, meta = {}) {
      writeSubmissionPageLog("info", event, requestId, meta);
    },
    error(event, meta = {}) {
      writeSubmissionPageLog("error", event, requestId, meta);
    },
  };
}

async function withDuration<T>(
  callback: (context: {
    getDurationMs: () => number;
    logger: SubmissionPageLogger;
    requestId: string;
  }) => Promise<T>,
) {
  const startedAt = Date.now();
  const requestId = crypto.randomUUID();
  const logger = createSubmissionPageLogger(requestId);
  const getDurationMs = () => Date.now() - startedAt;

  try {
    return await callback({ getDurationMs, logger, requestId });
  } catch (error) {
    logger.error("submissions.page.failed", {
      durationMs: getDurationMs(),
      error: error instanceof Error ? error.message : "Unknown error",
    });
    throw error;
  }
}

export default async function SubmissionsPage({
  searchParams,
}: SubmissionsPageProps) {
  return withDuration(async ({ getDurationMs, logger }) => {
    const params = await searchParams;
    const activeFilter = normalizeFilter(params?.filter);
    const { available, error, queue } = await getSubmissionQueue();
    const entries = filterEntries(queue.entries, activeFilter);
    const jsonLd = [
      buildBreadcrumbJsonLd([
        { name: "Home", url: siteConfig.url },
        { name: "Submissions", url: `${siteConfig.url}/submissions` },
      ]),
      buildCollectionPageJsonLd({
        siteUrl: siteConfig.url,
        path: "/submissions",
        name: "Submission queue",
        description:
          "Open content submissions grouped by import readiness and validation status.",
        breadcrumbId: `${siteConfig.url}/submissions#breadcrumb`,
      }),
    ];

    logger.info("submissions.page.summary", {
      activeFilter,
      available,
      durationMs: getDurationMs(),
      error: error || undefined,
      queueLength: queue.entries.length,
    });

    return (
      <div className="container-shell space-y-8 py-12">
        <JsonLd data={jsonLd} />
        <div className="space-y-4 border-b border-border/80 pb-8">
          <Breadcrumbs
            items={[{ label: "Home", href: "/" }, { label: "Submissions" }]}
          />
          <span className="eyebrow">Maintainer workbench</span>
          <h1 className="section-title">Submission queue.</h1>
          <p className="max-w-3xl text-sm leading-8 text-muted-foreground">
            Open GitHub issues are grouped into maintainer review states with
            suggested labels, source checks, risk signals, policy gates, and
            copyable reply drafts. This page is read-only and never imports,
            closes, or comments on submissions.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/submit"
              className="inline-flex items-center rounded-full border border-primary/40 bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              Submit free resource
            </Link>
            <a
              href={`${siteConfig.githubUrl}/issues?q=is%3Aissue+is%3Aopen+label%3Acontent-submission`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground transition hover:border-primary/40"
            >
              Open GitHub queue
            </a>
          </div>
        </div>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Ready", queue.summary.ready],
            ["Blocked", queue.summary.blocked],
            ["Likely promo/spam", queue.summary.likelyPromoSpam],
            ["Needs author input", queue.summary.needsAuthorInput],
            ["Source verification", queue.summary.sourceNeedsVerification],
            ["Reminder due", queue.summary.stale],
            ["Close eligible", queue.summary.closeEligible],
            ["Maintainer review", queue.summary.maintainerReview],
            ["Tracked issues", queue.count],
          ].map(([label, value]) => (
            <div key={label} className="surface-panel p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-primary">
                {label}
              </p>
              <p className="mt-2 text-3xl font-semibold text-foreground">
                {value}
              </p>
            </div>
          ))}
        </section>

        <nav className="flex flex-wrap gap-2" aria-label="Submission filters">
          {FILTERS.map((filter) => {
            const active = filter.key === activeFilter;
            const href =
              filter.key === "all"
                ? "/submissions"
                : `/submissions?filter=${filter.key}`;
            return (
              <Link
                key={filter.key}
                href={href}
                className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs transition ${
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
              >
                {filter.label}
                <span className="ml-2 rounded-full bg-background/35 px-1.5 py-0.5 text-[10px]">
                  {filterCount(queue.entries, filter.key)}
                </span>
              </Link>
            );
          })}
        </nav>

        {!available ? (
          <section className="surface-panel p-5 text-sm leading-7 text-muted-foreground">
            GitHub issue status is temporarily unavailable: {error}. Use the
            GitHub queue link above for the current source of truth.
          </section>
        ) : null}

        <section className="space-y-3">
          {entries.length ? (
            entries.map((entry) => {
              const sourceHref = safeHttpsUrl(entry.sourceUrl);
              const sourceUrls = entry.sourceUrls
                .map((url) => safeHttpsUrl(url))
                .filter(Boolean);
              const contributorProfileHref = safeHttpUrl(
                entry.contributorContext.profileUrl,
              );
              const submitHref = submissionFormHref(entry.category || "mcp");

              return (
                <article key={entry.number} className="surface-panel p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-primary/35 bg-primary/10 px-2.5 py-1 text-[11px] uppercase tracking-[0.14em] text-primary">
                          {triageLabel(entry.triageGroup)}
                        </span>
                        <span className="rounded-full border border-border bg-background px-2.5 py-1 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                          {statusLabel(entry.status)}
                        </span>
                        <span
                          className={`rounded-full border px-2.5 py-1 text-[11px] uppercase tracking-[0.14em] ${riskClass(entry)}`}
                        >
                          {entry.riskSummary}
                        </span>
                        <span className="rounded-full border border-border bg-background px-2.5 py-1 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                          {entry.policyDecision || "unknown"}
                        </span>
                        {entry.autoImportEligible ? (
                          <span className="rounded-full border border-primary/35 bg-primary/10 px-2.5 py-1 text-[11px] uppercase tracking-[0.14em] text-primary">
                            Approval-gated PR eligible
                          </span>
                        ) : null}
                      </div>
                      <h2 className="text-xl font-semibold tracking-tight text-foreground">
                        <a
                          href={entry.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-primary"
                        >
                          #{entry.number} {entry.title}
                        </a>
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {entry.category || "unknown"} /{" "}
                        {entry.slug || "no slug"}
                        {entry.author ? ` / @${entry.author}` : ""}
                        {entry.ageDays ? ` / ${entry.ageDays}d waiting` : ""}
                      </p>
                      <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
                        {entry.triageReason}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground">
                        {nextActionLabel(entry.nextAction)}
                      </span>
                      {entry.importPath ? (
                        <span className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground">
                          {entry.importPath}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                    <div className="space-y-4">
                      {entry.errors.length || entry.warnings.length ? (
                        <div>
                          <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                            Validation
                          </p>
                          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-7 text-muted-foreground">
                            {[...entry.errors, ...entry.warnings].map(
                              (issue) => (
                                <li key={issue}>{issue}</li>
                              ),
                            )}
                          </ul>
                        </div>
                      ) : null}

                      {entry.reviewChecklist.length ? (
                        <div>
                          <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                            Review checklist
                          </p>
                          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-7 text-muted-foreground">
                            {entry.reviewChecklist.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      ) : null}

                      {entry.policyReasons.length ? (
                        <div>
                          <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                            Policy matrix
                          </p>
                          <div className="mt-2 grid gap-2 sm:grid-cols-2">
                            {entry.policyReasons.map((gate) => (
                              <div
                                key={gate.name}
                                className="rounded-lg border border-border bg-background/60 px-3 py-2"
                              >
                                <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                                  {gate.name} / {gate.status}
                                </p>
                                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                  {gate.summary || "No summary available."}
                                </p>
                                {gate.detail.length ? (
                                  <p className="mt-2 text-xs leading-5 text-muted-foreground">
                                    {gate.detail.slice(0, 3).join(", ")}
                                  </p>
                                ) : null}
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null}

                      {entry.commentDraft ? (
                        <div className="rounded-lg border border-border bg-background/60 p-4">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                              Suggested reply
                            </p>
                            <EntryCopyButton
                              text={entry.commentDraft}
                              label="Copy reply"
                              className="directory-link-chip"
                            />
                          </div>
                          <p className="mt-3 whitespace-pre-line text-sm leading-7 text-muted-foreground">
                            {entry.commentDraft}
                          </p>
                        </div>
                      ) : null}
                    </div>

                    <div className="space-y-4 rounded-lg border border-border bg-background/40 p-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                          Current labels
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {entry.labels.length ? (
                            entry.labels.map((label) => (
                              <span
                                key={label}
                                className="rounded-full border border-border bg-card px-2.5 py-1 text-[11px] text-muted-foreground"
                              >
                                {label}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              No managed labels yet
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                          Recommended labels
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {entry.recommendedLabels.map((label) => (
                            <span
                              key={label}
                              className="rounded-full border border-border bg-card px-2.5 py-1 text-[11px] text-muted-foreground"
                            >
                              {label}
                            </span>
                          ))}
                        </div>
                      </div>
                      {entry.missingLabels.length ? (
                        <div>
                          <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                            Missing suggested labels
                          </p>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {entry.missingLabels.map((label) => (
                              <span
                                key={label}
                                className="rounded-full border border-primary/35 bg-primary/10 px-2.5 py-1 text-[11px] text-primary"
                              >
                                {label}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : null}
                      <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                          Source context
                        </p>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {entry.sourceState}
                        </p>
                        <div className="mt-2 space-y-1">
                          {[sourceHref, ...sourceUrls]
                            .filter(Boolean)
                            .filter(
                              (url, index, urls) => urls.indexOf(url) === index,
                            )
                            .slice(0, 4)
                            .map((url) => (
                              <a
                                key={url}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block truncate text-sm text-primary hover:underline"
                              >
                                {url}
                              </a>
                            ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                          Contributor context
                        </p>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {entry.contributorContext.login ||
                            entry.author ||
                            "Unknown contributor"}
                          {" / "}
                          {entry.contributorContext.resolutionStatus}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                          {entry.contributorContext.accountAgeDays === null
                            ? "Account age unknown"
                            : `${entry.contributorContext.accountAgeDays}d account age`}
                          {" / "}
                          {entry.contributorContext.publicRepos === null
                            ? "public repos unknown"
                            : `${entry.contributorContext.publicRepos} public repos`}
                        </p>
                        {entry.contributorContext.signals.length ? (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {entry.contributorContext.signals.map((signal) => (
                              <span
                                key={signal}
                                className="rounded-full border border-border bg-card px-2.5 py-1 text-[11px] text-muted-foreground"
                              >
                                {signal}
                              </span>
                            ))}
                          </div>
                        ) : null}
                        {contributorProfileHref ? (
                          <a
                            href={contributorProfileHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex text-sm text-primary hover:underline"
                          >
                            Open contributor profile
                          </a>
                        ) : null}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <a
                          href={entry.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="directory-link-chip"
                        >
                          Open issue
                        </a>
                        <Link href={submitHref} className="directory-link-chip">
                          Submit form
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <section className="surface-panel p-8 text-sm leading-7 text-muted-foreground">
              No open submission-shaped issues match this filter.
            </section>
          )}
        </section>
      </div>
    );
  });
}
