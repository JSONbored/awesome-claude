import { createFileRoute, Link } from "@tanstack/react-router";
import type { ElementType } from "react";
import { Webhook, Zap, ShieldCheck, Gauge, CalendarClock } from "lucide-react";

import { ENTRIES, REGISTRY_GENERATED_AT } from "@/data/entries";
import { buildHooksReport } from "@/lib/hooks-stats";
import { buildReportDataset } from "@/lib/data-reports";
import { statHint } from "@/lib/report-stat-hint-lib";
import { absoluteUrl } from "@/lib/seo";
import { ogImageUrl, OG_WIDTH, OG_HEIGHT } from "@/lib/og-image";
import { stringifyJsonLd } from "@/lib/json-ld";
import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { NewsletterInline } from "@/components/newsletter-inline";
import { ReportDownloads } from "@/components/report-downloads";
import { DataSection, DataStat, DistTable } from "@/components/data-report";
import { withReportDimensionDrilldown } from "@/lib/data-report-drilldown-lib";
import { trackEvent } from "@/lib/analytics";
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

const REPORT_ID = "claude-code-hooks" as const;
const REPORT_CATEGORY = "hooks";

function trackStateReportEgress(destination: StateReportEgressDestination) {
  trackEvent(
    stateReportEgressAnalyticsEvent(),
    stateReportEgressAnalyticsData(REPORT_ID, destination),
  );
}

function trackStateReportCite() {
  trackEvent(stateReportCiteAnalyticsEvent(), stateReportCiteAnalyticsData(REPORT_ID));
}

function trackStat(statKey: string) {
  const destination = stateReportStatDestination(REPORT_ID, statKey);
  if (!destination) return;
  trackEvent(
    stateReportStatAnalyticsEvent(),
    stateReportStatAnalyticsData(REPORT_ID, statKey, destination.destination),
  );
}

const AS_OF = String(REGISTRY_GENERATED_AT).slice(0, 10);
const MODEL = buildHooksReport(ENTRIES, AS_OF);
const PATH = MODEL.slug;
const PAGE_TITLE = `${MODEL.title} — HeyClaude`;

const STAT_ICON: Record<string, ElementType> = {
  total: Webhook,
  events: Zap,
  "safety-privacy": ShieldCheck,
  simple: Gauge,
};

const OG_IMAGE = ogImageUrl({
  eyebrow: "Data report",
  title: MODEL.title,
  description: `${MODEL.total} Claude Code hooks by event, use case & safety`,
});

export const Route = createFileRoute("/state-of-claude-code-hooks")({
  head: () => {
    const url = absoluteUrl(PATH);
    const dataset = buildReportDataset(MODEL);
    const breadcrumbs = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "HeyClaude", item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: MODEL.title, item: url },
      ],
    };
    return {
      meta: [
        { title: PAGE_TITLE },
        { name: "description", content: MODEL.description },
        { property: "og:type", content: "article" },
        { property: "og:title", content: PAGE_TITLE },
        { property: "og:description", content: MODEL.description },
        { property: "og:url", content: url },
        { property: "og:image", content: OG_IMAGE },
        { property: "og:image:type", content: "image/png" },
        { property: "og:image:width", content: String(OG_WIDTH) },
        { property: "og:image:height", content: String(OG_HEIGHT) },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: PAGE_TITLE },
        { name: "twitter:description", content: MODEL.description },
        { name: "twitter:image", content: OG_IMAGE },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        { type: "application/ld+json", children: stringifyJsonLd(dataset) },
        { type: "application/ld+json", children: stringifyJsonLd(breadcrumbs) },
      ],
    };
  },
  component: StateOfClaudeCodeHooksPage,
});

function StateOfClaudeCodeHooksPage() {
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
        title={MODEL.title}
        description="A snapshot of the Claude Code hooks ecosystem, derived directly from the HeyClaude registry. Hooks run shell commands automatically on Claude Code events — this report covers which events they fire on, what they automate, how involved they are to set up, and how consistently they disclose what they do."
      />
      <p className="mt-2 text-xs text-ink-subtle">Data as of {asOfLabel} (UTC).</p>

      <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-border bg-border stagger-children sm:grid-cols-4">
        {MODEL.stats.map((stat) => {
          const destination = stateReportStatDestination(REPORT_ID, stat.key);
          return (
            <DataStat
              key={stat.key}
              icon={STAT_ICON[stat.key] ?? Webhook}
              label={stat.label}
              value={stat.value}
              hint={statHint(stat)}
              to={destination?.to}
              search={destination?.search}
              onNavigate={() => trackStat(stat.key)}
            />
          );
        })}
      </div>

      {MODEL.dimensions.map((dimension) => {
        const rows = withReportDimensionDrilldown(dimension.key, dimension.rows, REPORT_CATEGORY);
        return (
          <DataSection key={dimension.key} title={dimension.title} help={dimension.help}>
            <DistTable
              rows={rows}
              onRowClick={(row, rowIndex) => {
                if (!row.rowKey) return;
                trackEvent(
                  stateReportDistRowAnalyticsEvent(),
                  stateReportDistRowAnalyticsData(
                    REPORT_ID,
                    dimension.key,
                    row.rowKey,
                    rowIndex,
                    rows.length,
                  ),
                );
              }}
            />
          </DataSection>
        );
      })}

      <ReportDownloads exportSlug={MODEL.exportSlug} />

      <section className="mt-12 rounded-xl border border-border bg-surface p-6">
        <div className="flex items-center gap-2">
          <CalendarClock className="h-5 w-5 text-ink-muted" aria-hidden />
          <h2 className="font-display text-xl font-semibold text-ink">
            Methodology &amp; citation
          </h2>
        </div>
        <p className="mt-2 max-w-2xl text-sm text-ink-muted">
          Figures are computed at build time from the {MODEL.total} Claude Code hooks in the
          HeyClaude registry, snapshot dated {asOfLabel}. The hook event is read from each entry's
          declared <code>trigger</code>; use cases come from registry tags (mechanism tags such as
          “hooks” are excluded); complexity uses the maintainer-assigned difficulty score. Safety
          and privacy disclosure is required during review, which is why coverage is near-total —
          the differentiator is that every hook says what it executes and what data it touches.
        </p>
        <p className="mt-3 max-w-2xl text-sm text-ink-muted">
          Citing this report? Link to{" "}
          <a
            href={absoluteUrl(PATH)}
            onClick={() => trackStateReportCite()}
            className="text-ink underline-offset-2 hover:underline"
          >
            heyclau.de/state-of-claude-code-hooks
          </a>{" "}
          with the data-as-of date. See also the broader{" "}
          {(() => {
            const destination = stateReportEgressRouteDestination("claude-tooling");
            if (!destination) return "State of Claude Tooling";
            return (
              <Link
                to={destination.to}
                onClick={() => trackStateReportEgress("claude-tooling")}
                className="text-ink underline-offset-2 hover:underline"
              >
                State of Claude Tooling
              </Link>
            );
          })()}
          . Browse all{" "}
          {(() => {
            const destination = stateReportEgressRouteDestination("category", "hooks");
            if (!destination || !("params" in destination)) return "hooks";
            return (
              <Link
                to={destination.to}
                params={destination.params}
                onClick={() =>
                  trackEvent(
                    stateReportCategoryBrowseAnalyticsEvent(),
                    stateReportCategoryBrowseAnalyticsData(REPORT_ID, "hooks", MODEL.total, 0, 1),
                  )
                }
                className="text-ink underline-offset-2 hover:underline"
              >
                hooks
              </Link>
            );
          })()}
          .
        </p>
      </section>

      <div className="mt-12">
        <NewsletterInline
          variant="quiet"
          title="Track the Claude Code ecosystem"
          description="A weekly digest of new hooks, agents, and MCP servers as they land in the registry."
          source="state-of-claude-code-hooks"
        />
      </div>
    </PageContainer>
  );
}
