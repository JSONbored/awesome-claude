import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, GitBranch, ShieldCheck, Layers, Boxes, CalendarClock } from "lucide-react";
import {
  CATEGORIES,
  HARNESSES,
  PLATFORM_LABEL,
  SOURCE_LABEL,
  TRUST_LABEL,
  type Category,
  type Platform,
  type SourceStatus,
  type TrustLevel,
} from "@/types/registry";
import { ENTRIES, QUALITY_STATS, REGISTRY_GENERATED_AT } from "@/data/entries";
import { absoluteUrl } from "@/lib/seo";
import { ogImageUrl, OG_WIDTH, OG_HEIGHT } from "@/lib/og-image";
import { stringifyJsonLd } from "@/lib/json-ld";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CountUp } from "@/components/count-up";
import { NewsletterInline } from "@/components/newsletter-inline";

const PATH = "/state-of-claude-tooling";
const TITLE = "State of Claude Tooling";
const PAGE_TITLE = `${TITLE} — HeyClaude`;
const DESCRIPTION =
  "A data report on the Claude and AI agent tooling ecosystem: total resources, per-category counts, trust-level distribution, source provenance, and platform coverage across the HeyClaude registry.";

// The registry snapshot date (YYYY-MM-DD), used as the report's "as of" date.
const AS_OF = String(REGISTRY_GENERATED_AT).slice(0, 10);

// ---- Derived stats (computed once at module load; the registry is static) ----

interface DistRow {
  label: string;
  count: number;
  pct: number;
}

function pctOf(n: number, total: number) {
  return total ? Math.round((n / total) * 100) : 0;
}

const TOTAL = ENTRIES.length;

const CATEGORY_DIST: DistRow[] = CATEGORIES.map((c) => {
  const count = ENTRIES.filter((e) => e.category === c.id).length;
  return { label: c.label, count, pct: pctOf(count, TOTAL) };
}).sort((a, b) => b.count - a.count);

const CATEGORY_ID_BY_LABEL = new Map<string, Category>(CATEGORIES.map((c) => [c.label, c.id]));

const TRUST_ORDER: TrustLevel[] = ["trusted", "review", "limited", "blocked"];
const TRUST_DIST: DistRow[] = TRUST_ORDER.map((level) => {
  const count = ENTRIES.filter((e) => e.trust === level).length;
  return { label: TRUST_LABEL[level], count, pct: pctOf(count, TOTAL) };
}).filter((row) => row.count > 0);

const SOURCE_ORDER: SourceStatus[] = ["first-party", "source-backed", "external", "unverified"];
const SOURCE_DIST: DistRow[] = SOURCE_ORDER.map((status) => {
  const count = ENTRIES.filter((e) => e.source === status).length;
  return { label: SOURCE_LABEL[status], count, pct: pctOf(count, TOTAL) };
}).filter((row) => row.count > 0);

// Platform coverage — how many entries declare compatibility with each harness.
const PLATFORM_DIST: DistRow[] = HARNESSES.map((h) => {
  const count = ENTRIES.filter((e) => e.platforms.includes(h.id as Platform)).length;
  return { label: PLATFORM_LABEL[h.id], count, pct: pctOf(count, TOTAL) };
})
  .filter((row) => row.count > 0)
  .sort((a, b) => b.count - a.count);

// Recent additions — newest-dated entries by dateAdded.
const RECENT_ADDITIONS = [...ENTRIES]
  .sort((a, b) => String(b.dateAdded).localeCompare(String(a.dateAdded)))
  .slice(0, 10);

const OG_IMAGE = ogImageUrl({
  eyebrow: "Data report",
  title: TITLE,
  description: `${TOTAL} resources across ${CATEGORIES.length} categories`,
});

export const Route = createFileRoute("/state-of-claude-tooling")({
  head: () => {
    const url = absoluteUrl(PATH);
    const dataset = {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: TITLE,
      description: DESCRIPTION,
      url,
      keywords: ["Claude", "Claude Code", "MCP", "AI agents", "Agent skills", "developer tooling"],
      license: "https://creativecommons.org/licenses/by/4.0/",
      isAccessibleForFree: true,
      dateModified: AS_OF,
      creator: {
        "@type": "Organization",
        name: "HeyClaude",
        url: absoluteUrl("/"),
      },
      variableMeasured: [
        "Total resources",
        "Resources per category",
        "Trust-level distribution",
        "Source provenance distribution",
        "Platform coverage",
      ],
    };
    const breadcrumbs = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "HeyClaude", item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: TITLE, item: url },
      ],
    };
    return {
      meta: [
        { title: PAGE_TITLE },
        { name: "description", content: DESCRIPTION },
        { property: "og:type", content: "article" },
        { property: "og:title", content: PAGE_TITLE },
        { property: "og:description", content: DESCRIPTION },
        { property: "og:url", content: url },
        { property: "og:image", content: OG_IMAGE },
        { property: "og:image:type", content: "image/png" },
        { property: "og:image:width", content: String(OG_WIDTH) },
        { property: "og:image:height", content: String(OG_HEIGHT) },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: PAGE_TITLE },
        { name: "twitter:description", content: DESCRIPTION },
        { name: "twitter:image", content: OG_IMAGE },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        { type: "application/ld+json", children: stringifyJsonLd(dataset) },
        { type: "application/ld+json", children: stringifyJsonLd(breadcrumbs) },
      ],
    };
  },
  component: StateOfClaudeToolingPage,
});

function StateOfClaudeToolingPage() {
  const asOfLabel = new Date(`${AS_OF}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-10 sm:px-6">
      <Breadcrumbs home items={[{ label: TITLE }]} />
      <div className="mt-4 eyebrow">Data report</div>
      <h1 className="mt-2 h-display-1 text-ink text-balance">State of Claude Tooling</h1>
      <p className="mt-4 max-w-2xl text-pretty text-base text-ink-muted sm:text-lg">
        A snapshot of the Claude and AI agent tooling ecosystem, derived directly from the HeyClaude
        registry. Every number below is computed from the live, source-backed catalog — no
        estimates, no projections.
      </p>
      <p className="mt-2 text-xs text-ink-subtle">Data as of {asOfLabel} (UTC).</p>

      <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-border bg-border stagger-children sm:grid-cols-4">
        <Stat icon={Boxes} label="Total resources" value={TOTAL} hint="across the registry" />
        <Stat
          icon={Layers}
          label="Categories tracked"
          value={CATEGORIES.length}
          hint="agents to statuslines"
        />
        <Stat
          icon={GitBranch}
          label="Source-backed"
          value={QUALITY_STATS.sourceBacked}
          hint={`${pctOf(QUALITY_STATS.sourceBacked, TOTAL)}% of total`}
        />
        <Stat
          icon={ShieldCheck}
          label="Maintainer-reviewed"
          value={QUALITY_STATS.reviewed}
          hint={`${pctOf(QUALITY_STATS.reviewed, TOTAL)}% of total`}
        />
      </div>

      <Section
        title="Resources by category"
        help="How the catalog breaks down across the ten tracked categories."
      >
        <DistTable rows={CATEGORY_DIST} linkCategory />
      </Section>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="h-display-2 text-ink text-balance">Trust-level distribution</h2>
          <p className="mt-2 text-sm text-ink-muted">
            Every entry carries a trust signal you can verify yourself.{" "}
            <Link to="/quality" className="text-ink underline-offset-2 hover:underline">
              See how we score.
            </Link>
          </p>
          <div className="mt-4">
            <DistTable rows={TRUST_DIST} />
          </div>
        </div>
        <div>
          <h2 className="h-display-2 text-ink text-balance">Source provenance</h2>
          <p className="mt-2 text-sm text-ink-muted">
            Where each listing's identity comes from — repo, package registry, or first-party docs.
          </p>
          <div className="mt-4">
            <DistTable rows={SOURCE_DIST} />
          </div>
        </div>
      </div>

      <Section
        title="Platform coverage"
        help="How many resources declare compatibility with each harness. Entries can support more than one, so percentages do not sum to 100%."
      >
        <DistTable rows={PLATFORM_DIST} />
      </Section>

      <section className="mt-12">
        <div className="flex items-center gap-2">
          <CalendarClock className="h-5 w-5 text-ink-muted" aria-hidden />
          <h2 className="h-display-2 text-ink text-balance">Recent additions</h2>
        </div>
        <p className="mt-2 text-sm text-ink-muted">
          The ten most recently dated entries in the registry snapshot.
        </p>
        <ol className="mt-4 overflow-hidden rounded-xl border border-border bg-surface">
          {RECENT_ADDITIONS.map((e) => (
            <li
              key={`${e.category}/${e.slug}`}
              className="flex items-center justify-between gap-3 border-b border-border px-5 py-3 last:border-0"
            >
              <Link
                to="/entry/$category/$slug"
                params={{ category: e.category, slug: e.slug }}
                className="min-w-0 truncate text-sm font-medium text-ink hover:underline"
              >
                {e.title}
              </Link>
              <div className="flex shrink-0 items-center gap-3">
                <span className="rounded-md border border-border bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-ink-subtle">
                  {e.category}
                </span>
                <span className="font-mono text-xs text-ink-subtle">
                  {String(e.dateAdded).slice(0, 10)}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-12 rounded-xl border border-border bg-surface p-6">
        <h2 className="font-display text-xl font-semibold text-ink">Methodology &amp; citation</h2>
        <p className="mt-2 max-w-2xl text-sm text-ink-muted">
          All figures are computed at build time from the HeyClaude registry — a curated,
          source-backed directory of Claude and AI agent resources. Counts reflect the snapshot
          dated {asOfLabel}. Trust levels and source provenance are assigned during maintainer
          review; platform coverage is derived from each entry's declared harness compatibility.
        </p>
        <p className="mt-3 max-w-2xl text-sm text-ink-muted">
          Citing this report? Link to{" "}
          <a href={absoluteUrl(PATH)} className="text-ink underline-offset-2 hover:underline">
            heyclau.de/state-of-claude-tooling
          </a>{" "}
          and reference the data-as-of date. Browse the underlying catalog on the{" "}
          <Link to="/browse" className="text-ink underline-offset-2 hover:underline">
            directory
          </Link>{" "}
          or review the{" "}
          <Link to="/quality" className="text-ink underline-offset-2 hover:underline">
            quality methodology
          </Link>
          .
        </p>
      </section>

      <div className="mt-12">
        <NewsletterInline
          variant="quiet"
          title="Track the ecosystem"
          description="A weekly digest of new resources, coverage shifts, and what landed in the registry."
          source="state-of-claude-tooling"
        />
      </div>
    </div>
  );

  function DistTable({ rows, linkCategory = false }: { rows: DistRow[]; linkCategory?: boolean }) {
    const max = rows.reduce((m, r) => Math.max(m, r.count), 0);
    return (
      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        {rows.map((row) => {
          const categoryId = linkCategory ? CATEGORY_ID_BY_LABEL.get(row.label) : undefined;
          const inner = (
            <>
              <div className="font-display text-sm font-semibold text-ink">{row.label}</div>
              <div className="h-2 overflow-hidden rounded-full bg-surface-2">
                <div
                  className="h-full bg-ink"
                  style={{ width: `${max ? Math.round((row.count / max) * 100) : 0}%` }}
                />
              </div>
              <div className="text-right font-mono text-xs tabular-nums text-ink">{row.count}</div>
              <div className="text-right font-mono text-xs tabular-nums text-ink-subtle">
                {row.pct}%
              </div>
            </>
          );
          const className =
            "grid grid-cols-[140px_1fr_56px_56px] items-center gap-4 border-b border-border px-5 py-3 last:border-0";
          return categoryId ? (
            <Link
              key={row.label}
              to="/$category"
              params={{ category: categoryId }}
              className={`${className} hover:bg-surface-2`}
            >
              {inner}
            </Link>
          ) : (
            <div key={row.label} className={className}>
              {inner}
            </div>
          );
        })}
      </div>
    );
  }
}

function Section({
  title,
  help,
  children,
}: {
  title: string;
  help: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-12">
      <h2 className="h-display-2 text-ink text-balance">{title}</h2>
      <p className="mt-2 max-w-2xl text-sm text-ink-muted">{help}</p>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  hint: string;
}) {
  return (
    <div className="bg-surface p-5">
      <div className="flex items-center justify-between">
        <Icon className="h-4 w-4 text-ink-muted" />
        <BadgeCheck className="h-3.5 w-3.5 text-ink-subtle" aria-hidden />
      </div>
      <div className="mt-3 font-display text-3xl font-semibold tabular-nums text-ink">
        <CountUp value={value} />
      </div>
      <div className="mt-1 flex items-end justify-between gap-2">
        <div className="text-xs text-ink-muted">{label}</div>
        <span className="font-mono text-[11px] text-ink-subtle">{hint}</span>
      </div>
    </div>
  );
}
