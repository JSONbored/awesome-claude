import { createFileRoute, Link } from "@tanstack/react-router";
import type { ElementType } from "react";
import { Bot, ShieldCheck, GitBranch, Zap, CalendarClock } from "lucide-react";

import { ENTRIES, REGISTRY_GENERATED_AT } from "@/data/entries";
import { buildAgentsReport } from "@/lib/agents-stats";
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
  stateReportStatAnalyticsData,
  stateReportStatAnalyticsEvent,
  type StateReportEgressDestination,
} from "@/lib/state-report-page-cta-events";

const REPORT_ID = "ai-agents" as const;
const REPORT_CATEGORY = "agents";

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
  trackEvent(
    stateReportStatAnalyticsEvent(),
    stateReportStatAnalyticsData(REPORT_ID, statKey, "browse"),
  );
}

const AS_OF = String(REGISTRY_GENERATED_AT).slice(0, 10);
const MODEL = buildAgentsReport(ENTRIES, AS_OF);
const PATH = MODEL.slug;
const PAGE_TITLE = `${MODEL.title} — HeyClaude`;

const STAT_ICON: Record<string, ElementType> = {
  total: Bot,
  documented: ShieldCheck,
  "source-backed": GitBranch,
  ready: Zap,
};

const OG_IMAGE = ogImageUrl({
  eyebrow: "Data report",
  title: MODEL.title,
  description: `${MODEL.total} AI agents by use case, disclosure & setup`,
});

export const Route = createFileRoute("/state-of-ai-agents")({
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
  component: StateOfAiAgentsPage,
});

function StateOfAiAgentsPage() {
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
        description="A snapshot of the AI agents ecosystem, derived directly from the HeyClaude registry. Agents act with real autonomy for Claude and coding workflows — this report covers what they take on, how consistently they disclose their safety and privacy behavior, and what they need to run."
      />
      <p className="mt-2 text-xs text-ink-subtle">Data as of {asOfLabel} (UTC).</p>

      <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-border bg-border stagger-children sm:grid-cols-4">
        {MODEL.stats.map((stat) => (
          <DataStat
            key={stat.key}
            icon={STAT_ICON[stat.key] ?? Bot}
            label={stat.label}
            value={stat.value}
            hint={statHint(stat)}
            to="/browse"
            search={
              stat.key === "source-backed"
                ? { category: REPORT_CATEGORY, source: "source-backed" }
                : stat.key === "documented"
                  ? { category: REPORT_CATEGORY, signal: "safety-notes" }
                  : { category: REPORT_CATEGORY }
            }
            onNavigate={() => trackStat(stat.key)}
          />
        ))}
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
          Figures are computed at build time from the {MODEL.total} agents in the HeyClaude
          registry, snapshot dated {asOfLabel}. Use cases come from registry tags (mechanism tags
          such as “agents” are excluded); safety and privacy disclosure reflects whether each agent
          documents that behavior; setup prerequisites and source provenance are recorded during
          registry review.
        </p>
        <p className="mt-3 max-w-2xl text-sm text-ink-muted">
          Citing this report? Link to{" "}
          <a
            href={absoluteUrl(PATH)}
            onClick={() => trackStateReportCite()}
            className="text-ink underline-offset-2 hover:underline"
          >
            heyclau.de/state-of-ai-agents
          </a>{" "}
          with the data-as-of date. See also the{" "}
          <Link
            to="/state-of-agent-skills"
            onClick={() => trackStateReportEgress("agent-skills")}
            className="text-ink underline-offset-2 hover:underline"
          >
            State of Agent Skills
          </Link>{" "}
          and the broader{" "}
          <Link
            to="/state-of-claude-tooling"
            onClick={() => trackStateReportEgress("claude-tooling")}
            className="text-ink underline-offset-2 hover:underline"
          >
            State of Claude Tooling
          </Link>
          . Browse all{" "}
          <Link
            to="/$category"
            params={{ category: "agents" }}
            onClick={() =>
              trackEvent(
                stateReportCategoryBrowseAnalyticsEvent(),
                stateReportCategoryBrowseAnalyticsData(REPORT_ID, "agents", MODEL.total, 0, 1),
              )
            }
            className="text-ink underline-offset-2 hover:underline"
          >
            agents
          </Link>
          .
        </p>
      </section>

      <div className="mt-12">
        <NewsletterInline
          variant="quiet"
          title="Track the Claude Code ecosystem"
          description="A weekly digest of new agents, skills, and MCP servers as they land in the registry."
          source="state-of-ai-agents"
        />
      </div>
    </PageContainer>
  );
}
