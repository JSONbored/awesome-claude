import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { FileJson, ShieldCheck, Terminal } from "lucide-react";
import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
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
import { trackEvent } from "@/lib/analytics";
import {
  validatorsAttentionEntryAnalyticsData,
  validatorsAttentionEntryAnalyticsEvent,
  validatorsRecentReviewedEntryAnalyticsData,
  validatorsRecentReviewedEntryAnalyticsEvent,
  insightsPageEntryDestination,
} from "@/lib/insights-page-entry-cta-events";
import {
  validatorsExpertiseFilterAnalyticsData,
  validatorsExpertiseFilterAnalyticsEvent,
} from "@/lib/validators-expertise-cta-events";
import {
  validatorsSummaryStatAnalyticsData,
  validatorsSummaryStatAnalyticsEvent,
  validatorsSummaryStatDestination,
  validatorsToolCardAnalyticsData,
  validatorsToolCardAnalyticsEvent,
  validatorsToolCardDestination,
  type ValidatorsSummaryStatId,
  type ValidatorsToolId,
} from "@/lib/validators-tools-cta-events";
import {
  validatorsCoverageMetricAnalyticsData,
  validatorsCoverageMetricAnalyticsEvent,
  validatorsCoverageMetricDestination,
  type ValidatorsCoverageMetricId,
} from "@/lib/validators-coverage-cta-events";
import {
  badgeChromeCategoryAnalyticsData,
  badgeChromeCategoryAnalyticsEvent,
  badgeChromeSourceAnalyticsData,
  badgeChromeSourceAnalyticsEvent,
  badgeChromeTrustAnalyticsData,
  badgeChromeTrustAnalyticsEvent,
} from "@/lib/badge-chrome-cta-events";
import atlasRegistry from "@/generated/atlas-registry.json";

const VALIDATOR_TOOL_COUNT = 2;

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

  const onExpertiseFilter = React.useCallback(
    (expertiseId: Expertise | "all", matchCount: number) => {
      trackEvent(
        validatorsExpertiseFilterAnalyticsEvent(),
        validatorsExpertiseFilterAnalyticsData(expertiseId, matchCount, EXPERTISE_OPTIONS.length),
      );
      setActive(expertiseId);
    },
    [],
  );

  return (
    <PageContainer className="py-12">
      <PageHeader
        eyebrow="Review coverage"
        title="What has been checked, and what still needs maintainer attention."
        description="HeyClaude does not publish a named validator roster yet. This page exposes the real registry coverage we can stand behind today: source status, maintainer review flags, and safety/privacy metadata completeness."
      />

      <div className="mt-8 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-4">
        {(
          [
            {
              label: "Entries",
              value: REVIEW_SUMMARY.total,
              statId: "entries" as const,
            },
            {
              label: "Reviewed",
              value: `${REVIEW_SUMMARY.pct(REVIEW_SUMMARY.reviewed, REVIEW_SUMMARY.total)}%`,
              help: `${REVIEW_SUMMARY.reviewed} entries`,
              statId: "safety-coverage" as const,
            },
            {
              label: "Source-backed",
              value: `${REVIEW_SUMMARY.pct(REVIEW_SUMMARY.sourceBacked, REVIEW_SUMMARY.total)}%`,
              help: `${REVIEW_SUMMARY.sourceBacked} entries`,
              statId: "source-backed" as const,
            },
            {
              label: "Needs attention",
              value: REVIEW_SUMMARY.needsAttention,
              statId: "needs-attention" as const,
            },
          ] as const
        ).map((stat) => {
          const destination = validatorsSummaryStatDestination(stat.statId);
          return (
            <SummaryStat
              key={stat.statId}
              label={stat.label}
              value={stat.value}
              help={"help" in stat ? stat.help : undefined}
              to={destination?.to}
              search={destination?.search}
              statId={stat.statId}
              destination={destination?.destination}
            />
          );
        })}
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-2">
        <FilterChipGroup label="Filter review coverage by area" multi={false}>
          <FilterChip
            role="radio"
            size="md"
            active={active === "all"}
            onClick={() => onExpertiseFilter("all", REVIEW_COVERAGE.length)}
          >
            All
          </FilterChip>
          {EXPERTISE_OPTIONS.map((option) => (
            <FilterChip
              key={option}
              role="radio"
              size="md"
              active={active === option}
              onClick={() =>
                onExpertiseFilter(
                  option,
                  REVIEW_COVERAGE.filter((coverage) => coverage.id === option).length,
                )
              }
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
              <Metric
                label="Reviewed"
                metricId="reviewed"
                expertiseId={coverage.id}
                value={coverage.reviewed}
                total={coverage.entries}
              />
              <Metric
                label="Source-backed"
                metricId="source-backed"
                expertiseId={coverage.id}
                value={coverage.sourceBacked}
                total={coverage.entries}
              />
              <Metric
                label="Safety notes"
                metricId="safety-notes"
                expertiseId={coverage.id}
                value={coverage.withSafetyNotes}
                total={coverage.entries}
              />
              <Metric
                label="Privacy notes"
                metricId="privacy-notes"
                expertiseId={coverage.id}
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
                  {coverage.needsAttention.map((entry, rowIndex) => (
                    <li key={`${entry.category}/${entry.slug}`}>
                      <div className="rounded-lg border border-border bg-background p-3 transition-colors hover:bg-surface-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <CategoryPill
                            asLink
                            category={entry.category}
                            onNavigate={() =>
                              trackEvent(
                                badgeChromeCategoryAnalyticsEvent(),
                                badgeChromeCategoryAnalyticsData(
                                  entry.category,
                                  "validators-attention",
                                ),
                              )
                            }
                          >
                            {entry.category}
                          </CategoryPill>
                          <TrustBadge
                            level={entry.trust}
                            asLink
                            onNavigate={() =>
                              trackEvent(
                                badgeChromeTrustAnalyticsEvent(),
                                badgeChromeTrustAnalyticsData(entry.trust, "validators-attention"),
                              )
                            }
                          />
                          <SourceBadge
                            status={entry.source}
                            asLink
                            onNavigate={() =>
                              trackEvent(
                                badgeChromeSourceAnalyticsEvent(),
                                badgeChromeSourceAnalyticsData(
                                  entry.source,
                                  "validators-attention",
                                ),
                              )
                            }
                          />
                        </div>
                        {(() => {
                          const destination = insightsPageEntryDestination(
                            entry.category,
                            entry.slug,
                          );
                          if (!destination) {
                            return (
                              <span className="mt-1 block line-clamp-1 text-sm font-medium text-ink">
                                {entry.title}
                              </span>
                            );
                          }
                          return (
                            <Link
                              to={destination.to}
                              params={destination.params}
                              onClick={() =>
                                trackEvent(
                                  validatorsAttentionEntryAnalyticsEvent(),
                                  validatorsAttentionEntryAnalyticsData(
                                    entry.category,
                                    entry.slug,
                                    coverage.id,
                                    rowIndex,
                                    coverage.needsAttention.length,
                                  ),
                                )
                              }
                              className="mt-1 block line-clamp-1 text-sm font-medium text-ink hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 rounded-sm"
                            >
                              {entry.title}
                            </Link>
                          );
                        })()}
                      </div>
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
            RECENT_REVIEWED.map((entry, rowIndex) => (
              <div
                key={`${entry.category}/${entry.slug}`}
                className="grid gap-3 border-b border-border px-5 py-3 text-sm last:border-0 hover:bg-surface-2 sm:grid-cols-[1fr_120px]"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <CategoryPill
                      asLink
                      category={entry.category}
                      onNavigate={() =>
                        trackEvent(
                          badgeChromeCategoryAnalyticsEvent(),
                          badgeChromeCategoryAnalyticsData(
                            entry.category,
                            "validators-recent-reviewed",
                          ),
                        )
                      }
                    >
                      {entry.category}
                    </CategoryPill>
                    <TrustBadge
                      level={entry.trust}
                      asLink
                      onNavigate={() =>
                        trackEvent(
                          badgeChromeTrustAnalyticsEvent(),
                          badgeChromeTrustAnalyticsData(entry.trust, "validators-recent-reviewed"),
                        )
                      }
                    />
                  </div>
                  {(() => {
                    const destination = insightsPageEntryDestination(entry.category, entry.slug);
                    if (!destination) {
                      return (
                        <span className="mt-1 block truncate font-display font-semibold text-ink">
                          {entry.title}
                        </span>
                      );
                    }
                    return (
                      <Link
                        to={destination.to}
                        params={destination.params}
                        onClick={() =>
                          trackEvent(
                            validatorsRecentReviewedEntryAnalyticsEvent(),
                            validatorsRecentReviewedEntryAnalyticsData(
                              entry.category,
                              entry.slug,
                              rowIndex,
                              RECENT_REVIEWED.length,
                            ),
                          )
                        }
                        className="mt-1 block truncate font-display font-semibold text-ink hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 rounded-sm"
                      >
                        {entry.title}
                      </Link>
                    );
                  })()}
                </div>
                <span className="font-mono text-xs text-ink-subtle sm:text-right">
                  {entry.reviewedAt?.slice(0, 10)}
                </span>
              </div>
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
          {(
            [
              {
                icon: FileJson,
                title: "SKILL.md package",
                blurb: "Frontmatter, package references, checksum facts, submission metadata.",
                toolId: "skill-package" as const,
              },
              {
                icon: Terminal,
                title: "MCP config JSON",
                blurb:
                  "Server shape, package targets, placeholders, risky shell syntax, secret-like values.",
                toolId: "mcp-config" as const,
              },
            ] as const
          ).map((tool) => {
            const destination = validatorsToolCardDestination(tool.toolId);
            if (!destination) return null;
            return (
              <ToolCard
                key={tool.toolId}
                icon={tool.icon}
                title={tool.title}
                blurb={tool.blurb}
                toolId={tool.toolId}
                to={destination.to}
              />
            );
          })}
        </div>
      </section>

      <p className="mt-10 text-xs text-ink-subtle">
        Want to improve coverage? Open a focused PR that adds source-backed safety, privacy, or
        provenance metadata for specific entries.
      </p>
    </PageContainer>
  );
}

function SummaryStat({
  label,
  value,
  help,
  to,
  search,
  statId,
  destination,
}: {
  label: string;
  value: React.ReactNode;
  help?: string;
  to?: "/browse" | "/quality";
  search?: { source?: string };
  statId?: ValidatorsSummaryStatId;
  destination?: "browse" | "quality" | "validators-skill-package" | "validators-mcp-config";
}) {
  const body = (
    <>
      <div className="flex items-center justify-between">
        <ShieldCheck className="h-4 w-4 text-ink-subtle" />
        <span className="font-mono text-[11px] text-ink-subtle">{label}</span>
      </div>
      <div className="mt-3 font-display text-2xl font-semibold tabular-nums text-ink">{value}</div>
      {help && <div className="mt-1 font-mono text-[11px] text-ink-subtle">{help}</div>}
    </>
  );

  if (to && statId && destination) {
    return (
      <Link
        to={to}
        search={to === "/browse" ? search : undefined}
        onClick={() =>
          trackEvent(
            validatorsSummaryStatAnalyticsEvent(),
            validatorsSummaryStatAnalyticsData(statId, destination),
          )
        }
        className="block bg-surface p-5 transition-colors duration-200 ease-out hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent/60"
      >
        {body}
      </Link>
    );
  }

  return <div className="bg-surface p-5">{body}</div>;
}

function Metric({
  label,
  metricId,
  expertiseId,
  value,
  total,
}: {
  label: string;
  metricId: ValidatorsCoverageMetricId;
  expertiseId: Expertise;
  value: number;
  total: number;
}) {
  const pct = total ? Math.round((value / total) * 100) : 0;
  const destination = validatorsCoverageMetricDestination(expertiseId, metricId);
  const body = (
    <>
      <div className="flex items-center justify-between gap-2">
        <span className="text-ink-muted">{label}</span>
        <span className="font-mono text-ink">{pct}%</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2">
        <div className="h-full bg-ink" style={{ width: `${Math.max(pct, value > 0 ? 3 : 0)}%` }} />
      </div>
    </>
  );

  if (!destination) {
    return <div className="rounded-lg border border-border bg-background p-3">{body}</div>;
  }

  return (
    <Link
      to={destination.to}
      search={destination.search}
      onClick={() =>
        trackEvent(
          validatorsCoverageMetricAnalyticsEvent(),
          validatorsCoverageMetricAnalyticsData(expertiseId, metricId, pct, value, total),
        )
      }
      className="block rounded-lg border border-border bg-background p-3 transition-colors hover:border-ink/20 hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
    >
      {body}
    </Link>
  );
}

function ToolCard({
  icon: Icon,
  title,
  blurb,
  toolId,
  to,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  blurb: string;
  toolId: ValidatorsToolId;
  to: "/validators/skill-package" | "/validators/mcp-config";
}) {
  return (
    <Link
      to={to}
      onClick={() =>
        trackEvent(
          validatorsToolCardAnalyticsEvent(),
          validatorsToolCardAnalyticsData(toolId, VALIDATOR_TOOL_COUNT),
        )
      }
      className="rounded-xl border border-border bg-surface p-5 transition-colors duration-200 ease-out hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
    >
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-ink-muted" />
        <h3 className="font-display text-base font-semibold text-ink">{title}</h3>
      </div>
      <p className="mt-2 text-sm text-ink-muted">{blurb}</p>
      <span className="mt-3 inline-flex text-xs font-medium text-ink-muted">Open tool →</span>
    </Link>
  );
}
