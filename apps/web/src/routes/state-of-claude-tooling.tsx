import { createFileRoute, Link } from "@tanstack/react-router";
import { GitBranch, ShieldCheck, Layers, Boxes, CalendarClock } from "lucide-react";
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
import { installMethodDistribution, notesCoverage } from "@/lib/ecosystem-stats";
import { pctOf } from "@/lib/pct-of-lib";
import { absoluteUrl } from "@/lib/seo";
import { ogImageUrl, OG_WIDTH, OG_HEIGHT } from "@/lib/og-image";
import { stringifyJsonLd } from "@/lib/json-ld";
import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { NewsletterInline } from "@/components/newsletter-inline";
import { ReportDownloads } from "@/components/report-downloads";
import { trackEvent } from "@/lib/analytics";
import {
  insightsPageEntryDestination,
  stateReportEntryAnalyticsData,
  stateReportEntryAnalyticsEvent,
} from "@/lib/insights-page-entry-cta-events";
import {
  stateReportCategoryBrowseAnalyticsData,
  stateReportCategoryBrowseAnalyticsEvent,
  stateReportCiteAnalyticsData,
  stateReportCiteAnalyticsEvent,
  stateReportDistRowAnalyticsData,
  stateReportDistRowAnalyticsEvent,
  stateReportEgressAnalyticsData,
  stateReportEgressAnalyticsEvent,
  stateReportEgressRouteDestination,
  stateReportStatAnalyticsData,
  stateReportStatAnalyticsEvent,
  stateReportStatDestination,
  type StateReportEgressDestination,
} from "@/lib/state-report-page-cta-events";
import {
  withCategoryHubDrilldown,
  withInstallMethodDrilldown,
  withNotesSignalDrilldown,
  withPlatformDrilldown,
  withSourceDrilldown,
  withTrustDrilldown,
} from "@/lib/data-report-drilldown-lib";
import { DataSection, DataStat, DistTable, type DistRow } from "@/components/data-report";

const REPORT_ID = "claude-tooling" as const;

function trackStateReportEgress(destination: StateReportEgressDestination) {
  trackEvent(
    stateReportEgressAnalyticsEvent(),
    stateReportEgressAnalyticsData(REPORT_ID, destination),
  );
}

function trackStateReportCite() {
  trackEvent(stateReportCiteAnalyticsEvent(), stateReportCiteAnalyticsData(REPORT_ID));
}

function trackDistRow(dimension: string, row: DistRow, rowIndex: number, rowCount: number) {
  if (!row.rowKey) return;
  trackEvent(
    stateReportDistRowAnalyticsEvent(),
    stateReportDistRowAnalyticsData(REPORT_ID, dimension, row.rowKey, rowIndex, rowCount),
  );
}

function trackStat(statKey: string) {
  const destination = stateReportStatDestination(REPORT_ID, statKey);
  if (!destination) return;
  trackEvent(
    stateReportStatAnalyticsEvent(),
    stateReportStatAnalyticsData(REPORT_ID, statKey, destination.destination),
  );
}

const PATH = "/state-of-claude-tooling";
const TITLE = "State of Claude Tooling";
const PAGE_TITLE = `${TITLE} — HeyClaude`;
const DESCRIPTION =
  "A data report on the Claude and AI agent tooling ecosystem: total resources, per-category counts, trust-level distribution, source provenance, and platform coverage across the HeyClaude registry.";

// The registry snapshot date (YYYY-MM-DD), used as the report's "as of" date.
const AS_OF = String(REGISTRY_GENERATED_AT).slice(0, 10);

// ---- Derived stats (computed once at module load; the registry is static) ----

const TOTAL = ENTRIES.length;

const CATEGORY_ID_BY_LABEL = new Map<string, Category>(CATEGORIES.map((c) => [c.label, c.id]));

const CATEGORY_DIST: DistRow[] = withCategoryHubDrilldown(
  CATEGORIES.map((c) => {
    const count = ENTRIES.filter((e) => e.category === c.id).length;
    return { label: c.label, count, pct: pctOf(count, TOTAL) };
  }).sort((a, b) => b.count - a.count),
  CATEGORY_ID_BY_LABEL,
);

const TRUST_ORDER: TrustLevel[] = ["trusted", "review", "limited", "blocked"];
const TRUST_DIST: DistRow[] = withTrustDrilldown(
  TRUST_ORDER.map((level) => {
    const count = ENTRIES.filter((e) => e.trust === level).length;
    return { label: TRUST_LABEL[level], count, pct: pctOf(count, TOTAL) };
  }).filter((row) => row.count > 0),
);

const SOURCE_ORDER: SourceStatus[] = ["first-party", "source-backed", "external", "unverified"];
const SOURCE_DIST: DistRow[] = withSourceDrilldown(
  SOURCE_ORDER.map((status) => {
    const count = ENTRIES.filter((e) => e.source === status).length;
    return { label: SOURCE_LABEL[status], count, pct: pctOf(count, TOTAL) };
  }).filter((row) => row.count > 0),
);

// Platform coverage — how many entries declare compatibility with each harness.
const PLATFORM_DIST: DistRow[] = withPlatformDrilldown(
  HARNESSES.map((h) => {
    const count = ENTRIES.filter((e) => e.platforms.includes(h.id as Platform)).length;
    return { label: PLATFORM_LABEL[h.id], count, pct: pctOf(count, TOTAL) };
  })
    .filter((row) => row.count > 0)
    .sort((a, b) => b.count - a.count),
);

// Install-method distribution — derived from each entry's installCommand, over
// the package-installable subset (file/config drop-ins have no install command).
const INSTALL_METHODS = installMethodDistribution(ENTRIES);
const INSTALL_METHOD_DIST: DistRow[] = withInstallMethodDrilldown(
  INSTALL_METHODS.rows.map((row) => ({
    label: row.label,
    count: row.count,
    pct: pctOf(row.count, INSTALL_METHODS.total),
  })),
);

// Safety & privacy notes coverage — HeyClaude's differentiating metadata, quantified.
const NOTES = notesCoverage(ENTRIES);
const NOTES_DIST: DistRow[] = withNotesSignalDrilldown([
  { label: "Safety notes", count: NOTES.safety, pct: pctOf(NOTES.safety, TOTAL) },
  { label: "Privacy notes", count: NOTES.privacy, pct: pctOf(NOTES.privacy, TOTAL) },
  { label: "Both", count: NOTES.both, pct: pctOf(NOTES.both, TOTAL) },
]);

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
        "Install-method distribution",
        "Safety and privacy notes coverage",
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
    <PageContainer>
      <PageHeader
        eyebrow="Data report"
        title="State of Claude Tooling"
        description="A snapshot of the Claude and AI agent tooling ecosystem, derived directly from the HeyClaude registry. Every number below is computed from the live, source-backed catalog — no estimates, no projections."
      />
      <p className="mt-2 text-xs text-ink-subtle">Data as of {asOfLabel} (UTC).</p>

      <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-border bg-border stagger-children sm:grid-cols-4">
        {(
          [
            {
              key: "total",
              icon: Boxes,
              label: "Total resources",
              value: TOTAL,
              hint: "across the registry",
            },
            {
              key: "categories",
              icon: Layers,
              label: "Categories tracked",
              value: CATEGORIES.length,
              hint: "agents to statuslines",
            },
            {
              key: "source-backed",
              icon: GitBranch,
              label: "Source-backed",
              value: QUALITY_STATS.sourceBacked,
              hint: `${pctOf(QUALITY_STATS.sourceBacked, TOTAL)}% of total`,
            },
            {
              key: "reviewed",
              icon: ShieldCheck,
              label: "Maintainer-reviewed",
              value: QUALITY_STATS.reviewed,
              hint: `${pctOf(QUALITY_STATS.reviewed, TOTAL)}% of total`,
            },
          ] as const
        ).map((stat) => {
          const destination = stateReportStatDestination(REPORT_ID, stat.key);
          return (
            <DataStat
              key={stat.key}
              icon={stat.icon}
              label={stat.label}
              value={stat.value}
              hint={stat.hint}
              to={destination?.to}
              search={destination?.search}
              onNavigate={() => trackStat(stat.key)}
            />
          );
        })}
      </div>

      <DataSection
        title="Resources by category"
        help="How the catalog breaks down across the ten tracked categories."
      >
        <DistTable
          rows={CATEGORY_DIST}
          onRowClick={(row, rowIndex) => {
            if (!row.rowKey) return;
            trackEvent(
              stateReportCategoryBrowseAnalyticsEvent(),
              stateReportCategoryBrowseAnalyticsData(
                REPORT_ID,
                row.rowKey,
                row.count,
                rowIndex,
                CATEGORY_DIST.length,
              ),
            );
          }}
        />
      </DataSection>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="h-display-2 text-ink text-balance">Trust-level distribution</h2>
          <p className="mt-2 text-sm text-ink-muted">
            Every entry carries a trust signal you can verify yourself.{" "}
            {(() => {
              const destination = stateReportEgressRouteDestination("quality");
              if (!destination) return "See how we score.";
              return (
                <Link
                  to={destination.to}
                  onClick={() => trackStateReportEgress("quality")}
                  className="text-ink underline-offset-2 hover:underline"
                >
                  See how we score.
                </Link>
              );
            })()}
          </p>
          <div className="mt-4">
            <DistTable
              rows={TRUST_DIST}
              onRowClick={(row, rowIndex) =>
                trackDistRow("trust-level", row, rowIndex, TRUST_DIST.length)
              }
            />
          </div>
        </div>
        <div>
          <h2 className="h-display-2 text-ink text-balance">Source provenance</h2>
          <p className="mt-2 text-sm text-ink-muted">
            Where each listing's identity comes from — repo, package registry, or first-party docs.
          </p>
          <div className="mt-4">
            <DistTable
              rows={SOURCE_DIST}
              onRowClick={(row, rowIndex) =>
                trackDistRow("source-provenance", row, rowIndex, SOURCE_DIST.length)
              }
            />
          </div>
        </div>
      </div>

      <DataSection
        title="Platform coverage"
        help="How many resources declare compatibility with each harness. Entries can support more than one, so percentages do not sum to 100%."
      >
        <DistTable
          rows={PLATFORM_DIST}
          onRowClick={(row, rowIndex) =>
            trackDistRow("platform-coverage", row, rowIndex, PLATFORM_DIST.length)
          }
        />
      </DataSection>

      <DataSection
        title="Install methods"
        help={`How the ${INSTALL_METHODS.total} package-installable resources are delivered, by install command. File and config drop-ins (agents, rules, skills, and the like) install by copying into your project rather than a package manager, so they are excluded here.`}
      >
        <DistTable
          rows={INSTALL_METHOD_DIST}
          onRowClick={(row, rowIndex) =>
            trackDistRow("install-methods", row, rowIndex, INSTALL_METHOD_DIST.length)
          }
        />
      </DataSection>

      <DataSection
        title="Safety & privacy coverage"
        help="Share of the catalog carrying reviewer-checked safety and privacy notes — the execution/permissions and data-handling metadata that sets HeyClaude apart. Percentages are of the full catalog; entries can carry both."
      >
        <DistTable
          rows={NOTES_DIST}
          onRowClick={(row, rowIndex) =>
            trackDistRow("notes-coverage", row, rowIndex, NOTES_DIST.length)
          }
        />
      </DataSection>

      <ReportDownloads exportSlug="claude-tooling" />

      <section className="mt-12">
        <div className="flex items-center gap-2">
          <CalendarClock className="h-5 w-5 text-ink-muted" aria-hidden />
          <h2 className="h-display-2 text-ink text-balance">Recent additions</h2>
        </div>
        <p className="mt-2 text-sm text-ink-muted">
          The ten most recently dated entries in the registry snapshot.
        </p>
        <ol className="mt-4 overflow-hidden rounded-xl border border-border bg-surface">
          {RECENT_ADDITIONS.map((e, rowIndex) => (
            <li
              key={`${e.category}/${e.slug}`}
              className="flex items-center justify-between gap-3 border-b border-border px-5 py-3 last:border-0"
            >
              {(() => {
                const destination = insightsPageEntryDestination(e.category, e.slug);
                if (!destination) {
                  return (
                    <span className="min-w-0 truncate text-sm font-medium text-ink">{e.title}</span>
                  );
                }
                return (
                  <Link
                    to={destination.to}
                    params={destination.params}
                    onClick={() =>
                      trackEvent(
                        stateReportEntryAnalyticsEvent(),
                        stateReportEntryAnalyticsData(
                          e.category,
                          e.slug,
                          "claude-tooling",
                          rowIndex,
                          RECENT_ADDITIONS.length,
                        ),
                      )
                    }
                    className="min-w-0 truncate text-sm font-medium text-ink hover:underline"
                  >
                    {e.title}
                  </Link>
                );
              })()}
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
          <a
            href={absoluteUrl(PATH)}
            onClick={() => trackStateReportCite()}
            className="text-ink underline-offset-2 hover:underline"
          >
            heyclau.de/state-of-claude-tooling
          </a>{" "}
          and reference the data-as-of date. Browse the underlying catalog on the{" "}
          {(() => {
            const destination = stateReportEgressRouteDestination("browse");
            if (!destination) return "directory";
            return (
              <Link
                to={destination.to}
                onClick={() => trackStateReportEgress("browse")}
                className="text-ink underline-offset-2 hover:underline"
              >
                directory
              </Link>
            );
          })()}{" "}
          or review the{" "}
          {(() => {
            const destination = stateReportEgressRouteDestination("quality");
            if (!destination) return "quality methodology";
            return (
              <Link
                to={destination.to}
                onClick={() => trackStateReportEgress("quality")}
                className="text-ink underline-offset-2 hover:underline"
              >
                quality methodology
              </Link>
            );
          })()}
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
    </PageContainer>
  );
}
