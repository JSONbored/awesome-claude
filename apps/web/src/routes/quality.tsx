import { createFileRoute, Link } from "@tanstack/react-router";
import { absoluteUrl } from "@/lib/seo";
import { breadcrumbScript } from "@/lib/seo-jsonld";
import {
  ShieldCheck,
  GitBranch,
  FileText,
  BadgeCheck,
  AlertTriangle,
  ChevronDown,
  MessageSquareWarning,
} from "lucide-react";
import { useState } from "react";
import { CATEGORIES } from "@/types/registry";
import { ENTRIES, QUALITY_STATS } from "@/data/entries";
import { scoreEntry, type QualityRow } from "@/lib/quality-score-lib";
import { ARTIFACT_CONTRACTS, CHANGELOG } from "@/data/changelog";
import { FeedHealthPanel } from "@/components/feed-health-panel";
import { CountUp } from "@/components/count-up";
import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { NewsletterInline } from "@/components/newsletter-inline";
import { entryRef } from "@/lib/entry-identity";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/quality")({
  head: () => ({
    meta: [
      { title: "Registry quality — HeyClaude" },
      {
        name: "description",
        content: "Trust, provenance, and source coverage across the HeyClaude registry.",
      },
      { property: "og:title", content: "Registry quality — HeyClaude" },
      {
        property: "og:description",
        content: "Coverage, improvement queue, and signed artifact contracts.",
      },
      { property: "og:url", content: absoluteUrl("/quality") },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/quality") }],
    scripts: [
      breadcrumbScript([
        { name: "HeyClaude", path: "/" },
        { name: "Quality", path: "/quality" },
      ]),
    ],
  }),
  component: QualityPage,
});

// Precomputed once at module load — the registry is static, so these no longer
// re-run (927× scoreEntry + sort + per-category scans, ~28K iterations) on every
// SSR render of /quality.
const QUALITY_ROWS = ENTRIES.map(scoreEntry);
const IMPROVEMENT_QUEUE = [...QUALITY_ROWS].sort((a, b) => a.score - b.score).slice(0, 8);
const TRUST_QUEUE = QUALITY_ROWS.filter((r) => r.recommendations.length > 0 && r.score >= 60).slice(
  0,
  8,
);
const CATEGORY_COVERAGE = new Map(
  CATEGORIES.map((c) => {
    const inCat = ENTRIES.filter((e) => e.category === c.id);
    const len = inCat.length;
    return [
      c.id,
      {
        count: len,
        trustedPct: len
          ? Math.round((inCat.filter((e) => e.trust === "trusted").length / len) * 100)
          : 0,
        safetyPct: len ? Math.round((inCat.filter((e) => e.safetyNotes).length / len) * 100) : 0,
        sourcedPct: len
          ? Math.round((inCat.filter((e) => e.source !== "unverified").length / len) * 100)
          : 0,
      },
    ];
  }),
);

function QualityPage() {
  const total = QUALITY_STATS.totalEntries;
  const pct = (n: number) => Math.round((n / total) * 100);
  const improvementQueue = IMPROVEMENT_QUEUE;
  const trustQueue = TRUST_QUEUE;

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Registry quality"
        title="Our quality pledge"
        description="Every entry is reviewed for source-backed identity and metadata completeness before it lands. We surface the trust signals you'd look for yourself — not malware verdicts. Always read the source before installing anything that touches your filesystem, network, or credentials."
      />
      <p className="mt-2 text-xs text-ink-subtle">
        Last rebuilt{" "}
        {new Date(ARTIFACT_CONTRACTS[0].builtAt).toISOString().slice(0, 16).replace("T", " ")} UTC
      </p>

      <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-border bg-border stagger-children sm:grid-cols-4">
        <Stat icon={BadgeCheck} label="Total entries" value={total} percent={100} />
        <Stat
          icon={GitBranch}
          label="Source-backed"
          value={QUALITY_STATS.sourceBacked}
          percent={pct(QUALITY_STATS.sourceBacked)}
        />
        <Stat
          icon={ShieldCheck}
          label="Safety notes present"
          value={QUALITY_STATS.withSafetyNotes}
          percent={pct(QUALITY_STATS.withSafetyNotes)}
        />
        <Stat
          icon={FileText}
          label="Reviewed by maintainer"
          value={QUALITY_STATS.reviewed}
          percent={pct(QUALITY_STATS.reviewed)}
        />
      </div>

      <section id="methodology" className="mt-12 scroll-mt-24">
        <div className="max-w-3xl">
          <h2 className="h-display-2 text-ink text-balance">Trust methodology</h2>
          <p className="mt-2 text-sm leading-6 text-ink-muted">
            These notes define the public labels used across entries, exports, and reports. They are
            editorial metadata checks for source identity, install caution, and registry
            completeness. These checks are not a guarantee that upstream code is safe, and they are
            not malware scans or vulnerability assessments.
          </p>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <MethodologyCard
            id="trust-levels"
            title="Trust levels"
            body="Trusted means a maintainer reviewed the listing metadata and source backing. Review, limited, and blocked are caution states that ask readers to inspect the source before installing. A trust badge is not an endorsement or runtime security guarantee."
          />
          <MethodologyCard
            id="source-provenance"
            title="Source provenance"
            body="Source-backed means the listing has a reachable repository, package registry, official documentation, or project source URL that supports the claimed identity. We do not infer source backing from marketing copy alone."
          />
          <MethodologyCard
            id="safety-notes"
            title="Safety notes"
            body="Risk-bearing categories should explain execution, filesystem access, network access, credentials, destructive actions, background workers, or account-write behavior before a user runs them."
          />
          <MethodologyCard
            id="privacy-notes"
            title="Privacy notes"
            body="Privacy notes call out local files, prompts, credentials, telemetry, third-party services, logs, retention, or user-data exposure so readers can decide whether a resource fits their threat model."
          />
          <MethodologyCard
            id="integrity"
            title="Package and download trust"
            body="Checksums pin hosted downloads byte-for-byte. Package verification means maintainers reviewed the package metadata and source path for the listed artifact. It is not a code audit, malware verdict, or proof that future releases are safe. Community PRs cannot mark packages as verified."
          />
          <MethodologyCard
            id="freshness"
            title="Freshness"
            body="Reviewed and verified dates show the last source or metadata check we recorded. Older checks are still useful provenance, but stale entries should be rechecked before install or citation."
          />
        </div>
      </section>

      <h2 className="mt-12 h-display-2 text-ink text-balance">Coverage by category</h2>
      <div className="mt-4 overflow-x-auto rounded-xl border border-border bg-surface">
        {CATEGORIES.map((c) => {
          const cov = CATEGORY_COVERAGE.get(c.id)!;
          return (
            <Link
              key={c.id}
              to="/browse"
              search={{ category: c.id }}
              className="grid grid-cols-[140px_1fr_110px_110px_110px_50px] items-center gap-4 border-b border-border px-5 py-3 text-sm last:border-0 hover:bg-surface-2"
            >
              <div className="font-display font-semibold text-ink">{c.label}</div>
              <div className="hidden text-xs text-ink-muted md:block">{c.blurb}</div>
              <Bar label="Source" pct={cov.sourcedPct} />
              <Bar label="Trusted" pct={cov.trustedPct} />
              <Bar label="Safety" pct={cov.safetyPct} />
              <div className="text-right font-mono text-xs text-ink-subtle">{cov.count}</div>
            </Link>
          );
        })}
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <Queue
          title="Improvement queue"
          help="Lowest-scoring entries by completeness and trust signals."
          rows={improvementQueue}
        />
        <Queue
          title="Trust queue"
          help="Solid entries with one or two recommendations."
          rows={trustQueue}
        />
      </div>

      <section className="mt-12">
        <h2 className="h-display-2 text-ink text-balance">Feed health</h2>
        <p className="mt-2 text-sm text-ink-muted">
          Build freshness and item counts for every public feed.
        </p>
        <div className="mt-4">
          <FeedHealthPanel compact />
        </div>
      </section>

      <h2 className="mt-12 h-display-2 text-ink text-balance">Artifact contracts</h2>
      <p className="mt-2 max-w-2xl text-sm text-ink-muted">
        Every public registry artifact ships with a SHA-256 and build timestamp. Verify against{" "}
        <code className="rounded bg-surface px-1 py-0.5 font-mono text-xs">
          /api/registry/integrity
        </code>
        .
      </p>
      <div className="mt-4 overflow-x-auto rounded-xl border border-border bg-surface">
        <div className="grid grid-cols-[1fr_120px_180px_180px] gap-4 border-b border-border bg-surface-2 px-5 py-2 text-[11px] uppercase tracking-wider text-ink-subtle">
          <span>Path</span>
          <span className="text-right">Size</span>
          <span>SHA-256</span>
          <span>Built</span>
        </div>
        {ARTIFACT_CONTRACTS.map((a) => (
          <div
            key={a.path}
            className="grid grid-cols-[1fr_120px_180px_180px] items-center gap-4 border-b border-border px-5 py-2.5 text-sm last:border-0"
          >
            <code className="truncate font-mono text-xs text-ink">{a.path}</code>
            <span className="text-right font-mono text-xs text-ink-muted">
              {(a.bytes / 1024).toFixed(1)} KB
            </span>
            <code className="truncate font-mono text-xs text-ink-muted">{a.sha256}</code>
            <span className="font-mono text-xs text-ink-subtle">
              {new Date(a.builtAt).toISOString().slice(0, 16).replace("T", " ")}
            </span>
          </div>
        ))}
      </div>

      <section className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="min-w-0">
          <h2 className="h-display-2 text-ink text-balance">Recent quality events</h2>
          <p className="mt-2 text-sm text-ink-muted">
            Additions, updates, and removals from the public registry feed.
          </p>
          <ol className="mt-4 overflow-hidden rounded-xl border border-border bg-surface">
            {CHANGELOG.slice(0, 6).map((c) => (
              <li
                key={`${c.date}-${c.ref}`}
                className="flex items-start gap-3 border-b border-border px-4 py-3 last:border-0"
              >
                <span
                  className={cn(
                    "mt-1 inline-flex h-1.5 w-1.5 shrink-0 rounded-full",
                    c.kind === "added" && "bg-trust-trusted",
                    c.kind === "updated" && "bg-accent",
                    c.kind === "removed" && "bg-trust-blocked",
                  )}
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2 text-xs text-ink-subtle">
                    <span className="font-mono uppercase tracking-wider">{c.kind}</span>
                    <span className="font-mono">{c.date}</span>
                  </div>
                  <div className="mt-0.5 truncate text-sm font-medium text-ink">{c.title}</div>
                  <code className="font-mono text-[11px] text-ink-muted">{c.ref}</code>
                </div>
              </li>
            ))}
          </ol>
          <Link
            to="/changelog"
            className="mt-3 inline-flex items-center gap-1 text-xs text-ink-muted hover:text-ink"
          >
            Full changelog →
          </Link>
        </div>

        <div className="min-w-0">
          <h2 className="h-display-2 text-ink text-balance">How we score</h2>
          <p className="mt-2 text-sm text-ink-muted">
            Each signal is binary at the entry level. Category scores are averages.
          </p>
          <div className="mt-4 space-y-2">
            <Method
              label="Source-backed"
              detail="A verifiable source URL (repo, package registry, official docs) that matches the claimed author."
            />
            <Method
              label="Safety notes"
              detail="Required for MCP, hooks, skills, and commands — anything that runs code, touches files, or holds credentials."
            />
            <Method
              label="Privacy notes"
              detail="Required for MCP and skills — covers what data leaves your machine."
            />
            <Method
              label="Reviewed"
              detail="A maintainer has eyeballed the metadata. Not a code audit, not a runtime sandbox."
            />
            <Method
              label="Install command"
              detail="An exact, copyable command. We do not run it for you."
            />
          </div>
        </div>
      </section>

      <div className="mt-12 grid gap-4 rounded-xl border border-border bg-ink p-6 text-background sm:flex sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <MessageSquareWarning className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
          <div>
            <div className="eyebrow text-background/60">See something off?</div>
            <h2 className="mt-1 font-display text-xl font-semibold">
              Report an issue or claim a listing
            </h2>
            <p className="mt-1 max-w-md text-sm text-background/70">
              Wrong metadata, stale source, broken install command? Authors and readers can both
              flag it.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            to="/claim"
            className="inline-flex h-10 items-center rounded-md bg-accent px-4 text-sm font-semibold text-accent-ink hover:opacity-90"
          >
            Claim a listing
          </Link>
          <a
            href="https://github.com/jsonbored/awesome-claude/issues"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 items-center rounded-md border border-background/30 px-4 text-sm font-medium hover:bg-background/10"
          >
            Open an issue
          </a>
        </div>
      </div>

      <div className="mt-12">
        <NewsletterInline
          variant="quiet"
          title="Get the weekly quality digest"
          description="Coverage shifts, new safety notes, and what landed each week."
          source="quality"
        />
      </div>
    </PageContainer>
  );
}

function MethodologyCard({ id, title, body }: { id: string; title: string; body: string }) {
  return (
    <article id={id} className="scroll-mt-24 rounded-lg border border-border bg-surface p-4">
      <h3 className="font-display text-base font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-ink-muted">{body}</p>
    </article>
  );
}

function Method({ label, detail }: { label: string; detail: string }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setOpen((v) => !v)}
      className="w-full rounded-lg border border-border bg-surface p-3 text-left transition-colors duration-200 ease-out hover:bg-surface-2"
      aria-expanded={open}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-ink">{label}</span>
        <ChevronDown
          className={cn("h-4 w-4 text-ink-subtle transition-transform", open && "rotate-180")}
        />
      </div>
      {open && <p className="mt-2 text-xs text-ink-muted">{detail}</p>}
    </button>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  percent,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  percent: number;
}) {
  return (
    <div className="bg-surface p-5">
      <div className="flex items-center justify-between">
        <Icon className="h-4 w-4 text-ink-muted" />
        <span className="font-mono text-xs tabular-nums text-ink-subtle">{percent}%</span>
      </div>
      <div className="mt-3 font-display text-3xl font-semibold tabular-nums text-ink">
        <CountUp value={value} />
      </div>
      <div className="mt-1 flex items-end justify-between gap-2">
        <div className="text-xs text-ink-muted">{label}</div>
        <span className="font-mono text-[11px] text-ink-subtle">current snapshot</span>
      </div>
    </div>
  );
}

function Bar({ label, pct }: { label: string; pct: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-[10px] text-ink-subtle">
        <span>{label}</span>
        <span className="font-mono">{pct}%</span>
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-2">
        <div className="h-full bg-ink" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function Queue({ title, help, rows }: { title: string; help: string; rows: QualityRow[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <div className="border-b border-border px-5 py-3">
        <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
        <p className="text-xs text-ink-muted">{help}</p>
      </div>
      <ul>
        {rows.map((r) => (
          <li key={entryRef(r.entry)} className="border-b border-border px-5 py-3 last:border-0">
            <div className="flex items-center justify-between gap-3">
              <Link
                to="/entry/$category/$slug"
                params={{ category: r.entry.category, slug: r.entry.slug }}
                className="truncate text-sm font-medium text-ink hover:underline"
              >
                {r.entry.title}
              </Link>
              <span className="shrink-0 font-mono text-xs text-ink-subtle">{r.score}/100</span>
            </div>
            {r.recommendations.length > 0 && (
              <ul className="mt-1 space-y-0.5 text-[11px] text-ink-muted">
                {r.recommendations.slice(0, 2).map((rec, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-trust-review" />
                    {rec}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
