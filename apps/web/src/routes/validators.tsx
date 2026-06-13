import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { FileJson, ShieldCheck, Terminal } from "lucide-react";
import {
  EXPERTISE_OPTIONS,
  RECENT_REVIEWED,
  REVIEW_COVERAGE,
  REVIEW_SUMMARY,
  type Expertise,
} from "@/data/validators";
import { CategoryPill, SourceBadge, TrustBadge } from "@/components/badges";
import { FilterChip, FilterChipGroup } from "@/components/filter-chip";
import { stringifyJsonLd } from "@/lib/json-ld";
import { absoluteUrl } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import atlasRegistry from "@/generated/atlas-registry.json";

export const Route = createFileRoute("/validators")({
  head: () => ({
    meta: [
      { title: "Maintainer review coverage — HeyClaude" },
      {
        name: "description",
        content:
          "Maintainer review coverage, safety/privacy metadata gaps, and source-backed registry quality checks.",
      },
      { property: "og:title", content: "Maintainer review coverage — HeyClaude" },
      {
        property: "og:description",
        content:
          "Coverage dashboards and local validation tools for source, safety, privacy, and install metadata.",
      },
      { property: "og:url", content: absoluteUrl("/validators") },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/validators") }],
    scripts: [
      {
        type: "application/ld+json",
        children: stringifyJsonLd({
          "@context": "https://schema.org",
          "@type": "Dataset",
          name: "HeyClaude maintainer review coverage",
          description:
            "Registry coverage metrics for source-backed entries, review status, safety notes, and privacy notes.",
          url: absoluteUrl("/validators"),
          isAccessibleForFree: true,
          license: "https://opensource.org/licenses/MIT",
          creator: {
            "@type": "Organization",
            name: siteConfig.name,
            url: siteConfig.url,
          },
          ...(atlasRegistry.generatedAt
            ? {
                datePublished: String(atlasRegistry.generatedAt).slice(0, 10),
                dateModified: String(atlasRegistry.generatedAt).slice(0, 10),
              }
            : {}),
          keywords: [
            "Claude",
            "registry",
            "review coverage",
            "safety metadata",
            "privacy metadata",
          ],
        }),
      },
    ],
  }),
  component: ValidatorsPage,
});

function ValidatorsPage() {
  const [active, setActive] = React.useState<Expertise | "all">("all");
  const list = REVIEW_COVERAGE.filter((coverage) => active === "all" || coverage.id === active);

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-12 sm:px-6">
      <div className="eyebrow">Review coverage</div>
      <h1 className="mt-2 h-display-1 text-ink text-balance">
        What has been checked, and what still needs maintainer attention.
      </h1>
      <p className="mt-4 max-w-2xl text-pretty text-base text-ink-muted sm:text-lg">
        HeyClaude does not publish a named validator roster yet. This page exposes the real registry
        coverage we can stand behind today: source status, maintainer review flags, and
        safety/privacy metadata completeness.
      </p>

      <div className="mt-8 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-4">
        <SummaryStat label="Entries" value={REVIEW_SUMMARY.total} />
        <SummaryStat
          label="Reviewed"
          value={`${REVIEW_SUMMARY.pct(REVIEW_SUMMARY.reviewed, REVIEW_SUMMARY.total)}%`}
          help={`${REVIEW_SUMMARY.reviewed} entries`}
        />
        <SummaryStat
          label="Source-backed"
          value={`${REVIEW_SUMMARY.pct(REVIEW_SUMMARY.sourceBacked, REVIEW_SUMMARY.total)}%`}
          help={`${REVIEW_SUMMARY.sourceBacked} entries`}
        />
        <SummaryStat label="Needs attention" value={REVIEW_SUMMARY.needsAttention} />
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-2">
        <FilterChipGroup label="Filter review coverage by area" multi={false}>
          <FilterChip
            role="radio"
            size="md"
            active={active === "all"}
            onClick={() => setActive("all")}
          >
            All
          </FilterChip>
          {EXPERTISE_OPTIONS.map((option) => (
            <FilterChip
              key={option}
              role="radio"
              size="md"
              active={active === option}
              onClick={() => setActive(option)}
            >
              {option}
            </FilterChip>
          ))}
        </FilterChipGroup>
        <span className="ml-1 font-mono text-xs text-ink-subtle" aria-live="polite">
          {list.length} coverage areas
        </span>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {list.map((coverage) => (
          <article key={coverage.id} className="rounded-xl border border-border bg-surface p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-lg font-semibold tracking-tight text-ink">
                  {coverage.label}
                </h2>
                <p className="mt-1 text-sm text-ink-muted">{coverage.description}</p>
              </div>
              <span className="rounded-md border border-border bg-background px-2 py-1 font-mono text-[11px] text-ink-muted">
                {coverage.entries} entries
              </span>
            </div>

            <div className="mt-4 grid gap-2 text-xs sm:grid-cols-2">
              <Metric label="Reviewed" value={coverage.reviewed} total={coverage.entries} />
              <Metric
                label="Source-backed"
                value={coverage.sourceBacked}
                total={coverage.entries}
              />
              <Metric
                label="Safety notes"
                value={coverage.withSafetyNotes}
                total={coverage.entries}
              />
              <Metric
                label="Privacy notes"
                value={coverage.withPrivacyNotes}
                total={coverage.entries}
              />
            </div>

            <div className="mt-5 border-t border-border pt-4">
              <div className="mb-2 font-mono text-[10px] uppercase tracking-wider text-ink-subtle">
                Attention queue
              </div>
              {coverage.needsAttention.length === 0 ? (
                <p className="text-xs text-ink-muted">No obvious metadata gaps in this area.</p>
              ) : (
                <ul className="space-y-2">
                  {coverage.needsAttention.map((entry) => (
                    <li key={`${entry.category}/${entry.slug}`}>
                      <Link
                        to="/entry/$category/$slug"
                        params={{ category: entry.category, slug: entry.slug }}
                        className="block rounded-lg border border-border bg-background p-3 transition-colors hover:bg-surface-2"
                      >
                        <div className="flex flex-wrap items-center gap-1.5">
                          <CategoryPill>{entry.category}</CategoryPill>
                          <TrustBadge level={entry.trust} />
                          <SourceBadge status={entry.source} />
                        </div>
                        <div className="mt-1 line-clamp-1 text-sm font-medium text-ink">
                          {entry.title}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </article>
        ))}
      </div>

      <section className="mt-16">
        <div className="eyebrow">Recent reviewed entries</div>
        <h2 className="mt-2 h-display-2 text-ink text-balance">Latest review-backed metadata</h2>
        <div className="mt-5 overflow-hidden rounded-xl border border-border bg-surface">
          {RECENT_REVIEWED.length === 0 ? (
            <p className="px-5 py-8 text-sm text-ink-muted">
              No reviewed entries with public timestamps are present in the generated registry
              snapshot.
            </p>
          ) : (
            RECENT_REVIEWED.map((entry) => (
              <Link
                key={`${entry.category}/${entry.slug}`}
                to="/entry/$category/$slug"
                params={{ category: entry.category, slug: entry.slug }}
                className="grid gap-3 border-b border-border px-5 py-3 text-sm last:border-0 hover:bg-surface-2 sm:grid-cols-[1fr_120px]"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <CategoryPill>{entry.category}</CategoryPill>
                    <TrustBadge level={entry.trust} />
                  </div>
                  <div className="mt-1 truncate font-display font-semibold text-ink">
                    {entry.title}
                  </div>
                </div>
                <span className="font-mono text-xs text-ink-subtle sm:text-right">
                  {entry.reviewedAt?.slice(0, 10)}
                </span>
              </Link>
            ))
          )}
        </div>
      </section>

      <section className="mt-16">
        <div className="eyebrow">Tools maintainers use</div>
        <h2 className="mt-2 h-display-2 text-ink text-balance">Local review helpers</h2>
        <p className="mt-2 max-w-2xl text-sm text-ink-muted">
          These tools inspect submitted metadata locally. They are review aids, not malware scanning
          or install approval.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <ToolCard
            icon={FileJson}
            title="SKILL.md package"
            blurb="Frontmatter, package references, checksum facts, submission metadata."
          />
          <ToolCard
            icon={Terminal}
            title="MCP config JSON"
            blurb="Server shape, package targets, placeholders, risky shell syntax, secret-like values."
          />
        </div>
      </section>

      <p className="mt-10 text-xs text-ink-subtle">
        Want to improve coverage? Open a focused PR that adds source-backed safety, privacy, or
        provenance metadata for specific entries.
      </p>
    </div>
  );
}

function SummaryStat({
  label,
  value,
  help,
}: {
  label: string;
  value: React.ReactNode;
  help?: string;
}) {
  return (
    <div className="bg-surface p-5">
      <div className="flex items-center justify-between">
        <ShieldCheck className="h-4 w-4 text-ink-subtle" />
        <span className="font-mono text-[11px] text-ink-subtle">{label}</span>
      </div>
      <div className="mt-3 font-display text-2xl font-semibold tabular-nums text-ink">{value}</div>
      {help && <div className="mt-1 font-mono text-[11px] text-ink-subtle">{help}</div>}
    </div>
  );
}

function Metric({ label, value, total }: { label: string; value: number; total: number }) {
  const pct = total ? Math.round((value / total) * 100) : 0;
  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-ink-muted">{label}</span>
        <span className="font-mono text-ink">{pct}%</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2">
        <div className="h-full bg-ink" style={{ width: `${Math.max(pct, value > 0 ? 3 : 0)}%` }} />
      </div>
    </div>
  );
}

function ToolCard({
  icon: Icon,
  title,
  blurb,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  blurb: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-ink-muted" />
        <h3 className="font-display text-base font-semibold text-ink">{title}</h3>
      </div>
      <p className="mt-2 text-sm text-ink-muted">{blurb}</p>
    </div>
  );
}
