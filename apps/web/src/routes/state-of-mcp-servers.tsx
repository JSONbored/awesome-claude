import { createFileRoute, Link } from "@tanstack/react-router";
import { Boxes, Cloud, HardDrive, GitBranch, CalendarClock } from "lucide-react";

import { SOURCE_LABEL, TRUST_LABEL, type SourceStatus, type TrustLevel } from "@/types/registry";
import { ENTRIES, REGISTRY_GENERATED_AT } from "@/data/entries";
import { installMethodDistribution } from "@/lib/ecosystem-stats";
import {
  hostingDistribution,
  transportDistribution,
  classifyTransport,
  hostingOf,
} from "@/lib/mcp-stats";
import { absoluteUrl } from "@/lib/seo";
import { ogImageUrl, OG_WIDTH, OG_HEIGHT } from "@/lib/og-image";
import { stringifyJsonLd } from "@/lib/json-ld";
import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { NewsletterInline } from "@/components/newsletter-inline";
import { ReportDownloads } from "@/components/report-downloads";
import { DataSection, DataStat, DistTable, pctOf, type DistRow } from "@/components/data-report";
import {
  withSourceDrilldown,
  withTagDrilldown,
  withTrustDrilldown,
  withTransportDrilldown,
  withHostingDrilldown,
  withInstallMethodDrilldown,
} from "@/lib/data-report-drilldown-lib";
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

const REPORT_ID = "mcp-servers" as const;

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

const PATH = "/state-of-mcp-servers";
const TITLE = "State of MCP Servers 2026";
const PAGE_TITLE = `${TITLE} — HeyClaude`;
const DESCRIPTION =
  "A data report on Model Context Protocol (MCP) servers for Claude: how many there are, which transports they use (stdio, HTTP, SSE), local vs hosted split, trust and source provenance, and how they install — computed from the HeyClaude registry.";

const AS_OF = String(REGISTRY_GENERATED_AT).slice(0, 10);

// ---- MCP subset + derived stats (computed once; the registry is static) ----
const MCP = ENTRIES.filter((e) => e.category === "mcp");
const TOTAL = MCP.length;

const TRANSPORT = transportDistribution(MCP);
const TRANSPORT_DIST: DistRow[] = withTransportDrilldown(
  TRANSPORT.rows.map((r) => ({
    label: r.label,
    count: r.count,
    pct: pctOf(r.count, TRANSPORT.total),
  })),
  "mcp",
);

const HOSTING = hostingDistribution(MCP);
const HOSTING_DIST: DistRow[] = withHostingDrilldown(
  HOSTING.rows.map((r) => ({
    label: r.label,
    count: r.count,
    pct: pctOf(r.count, HOSTING.total),
  })),
  "mcp",
);
const REMOTE = MCP.filter((e) => hostingOf(classifyTransport(e)) === "Remote (hosted)").length;
const LOCAL = MCP.filter((e) => hostingOf(classifyTransport(e)) === "Local (stdio)").length;

const TRUST_ORDER: TrustLevel[] = ["trusted", "review", "limited", "blocked"];
const TRUST_DIST: DistRow[] = withTrustDrilldown(
  TRUST_ORDER.map((level) => {
    const count = MCP.filter((e) => e.trust === level).length;
    return { label: TRUST_LABEL[level], count, pct: pctOf(count, TOTAL) };
  }).filter((r) => r.count > 0),
  "mcp",
);

const SOURCE_ORDER: SourceStatus[] = ["first-party", "source-backed", "external", "unverified"];
const SOURCE_BACKED = MCP.filter(
  (e) => e.source === "source-backed" || e.source === "first-party",
).length;
const SOURCE_DIST: DistRow[] = withSourceDrilldown(
  SOURCE_ORDER.map((status) => {
    const count = MCP.filter((e) => e.source === status).length;
    return { label: SOURCE_LABEL[status], count, pct: pctOf(count, TOTAL) };
  }).filter((r) => r.count > 0),
  "mcp",
);

const INSTALL = installMethodDistribution(MCP);
const INSTALL_DIST: DistRow[] = withInstallMethodDrilldown(
  INSTALL.rows.map((r) => ({
    label: r.label,
    count: r.count,
    pct: pctOf(r.count, INSTALL.total),
  })),
  "mcp",
);

// Most common integration tags — what these servers actually connect Claude to.
const GENERIC_TAGS = new Set(["mcp", "mcp-server", "mcp-servers", "claude", "ai", "integration"]);
const TAG_COUNTS = new Map<string, number>();
for (const e of MCP) {
  for (const tag of e.tags ?? []) {
    const t = tag.toLowerCase().trim();
    if (!t || GENERIC_TAGS.has(t)) continue;
    TAG_COUNTS.set(t, (TAG_COUNTS.get(t) ?? 0) + 1);
  }
}
const TAG_DIST: DistRow[] = withTagDrilldown(
  [...TAG_COUNTS.entries()]
    .map(([label, count]) => ({ label, count, pct: pctOf(count, TOTAL) }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
    .slice(0, 12),
);

const RECENT = [...MCP]
  .sort((a, b) => String(b.dateAdded).localeCompare(String(a.dateAdded)))
  .slice(0, 10);

const OG_IMAGE = ogImageUrl({
  eyebrow: "Data report",
  title: TITLE,
  description: `${TOTAL} MCP servers analyzed by transport, trust & install`,
});

export const Route = createFileRoute("/state-of-mcp-servers")({
  head: () => {
    const url = absoluteUrl(PATH);
    const dataset = {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: TITLE,
      description: DESCRIPTION,
      url,
      keywords: [
        "MCP servers",
        "Model Context Protocol",
        "Claude",
        "MCP transport",
        "stdio HTTP SSE",
        "AI tooling",
      ],
      license: "https://creativecommons.org/licenses/by/4.0/",
      isAccessibleForFree: true,
      dateModified: AS_OF,
      creator: { "@type": "Organization", name: "HeyClaude", url: absoluteUrl("/") },
      variableMeasured: [
        "Total MCP servers",
        "Transport distribution",
        "Local vs hosted split",
        "Trust-level distribution",
        "Source provenance distribution",
        "Install-method distribution",
        "Most common integration tags",
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
  component: StateOfMcpServersPage,
});

function StateOfMcpServersPage() {
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
        title="State of MCP Servers 2026"
        description="A snapshot of the Model Context Protocol server ecosystem for Claude, derived directly from the HeyClaude registry. Every number is computed from the live, source-backed catalog — how these servers transport, where they run, and how you install them."
      />
      <p className="mt-2 text-xs text-ink-subtle">Data as of {asOfLabel} (UTC).</p>

      <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-border bg-border stagger-children sm:grid-cols-4">
        {(
          [
            {
              key: "total",
              icon: Boxes,
              label: "MCP servers",
              value: TOTAL,
              hint: "in the registry",
            },
            {
              key: "remote",
              icon: Cloud,
              label: "Hosted (remote)",
              value: REMOTE,
              hint: `${pctOf(REMOTE, TOTAL)}% of total`,
            },
            {
              key: "local",
              icon: HardDrive,
              label: "Local (stdio)",
              value: LOCAL,
              hint: `${pctOf(LOCAL, TOTAL)}% of total`,
            },
            {
              key: "source-backed",
              icon: GitBranch,
              label: "Source-backed",
              value: SOURCE_BACKED,
              hint: `${pctOf(SOURCE_BACKED, TOTAL)}% of total`,
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
        title="Transport distribution"
        help="How MCP servers connect to Claude. Local servers speak stdio; hosted servers expose an HTTP (streamable) or SSE endpoint. Classified from each entry's declared config and install command."
      >
        <DistTable
          rows={TRANSPORT_DIST}
          onRowClick={(row, rowIndex) =>
            trackDistRow("transport", row, rowIndex, TRANSPORT_DIST.length)
          }
        />
      </DataSection>

      <DataSection
        title="Local vs hosted"
        help="Whether a server runs as a local process you launch (stdio) or a remote endpoint you connect to (HTTP/SSE)."
      >
        <DistTable
          rows={HOSTING_DIST}
          onRowClick={(row, rowIndex) =>
            trackDistRow("hosting", row, rowIndex, HOSTING_DIST.length)
          }
        />
      </DataSection>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="h-display-2 text-ink text-balance">Trust-level distribution</h2>
          <p className="mt-2 text-sm text-ink-muted">
            Every server carries a trust signal you can verify.{" "}
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
            Where each server's identity comes from — first-party docs, a repo, or a package
            registry.
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
        title="Install methods"
        help={`How the ${INSTALL.total} MCP servers with an install command are delivered. Servers configured purely by editing a config file (no install command) are excluded here.`}
      >
        <DistTable
          rows={INSTALL_DIST}
          onRowClick={(row, rowIndex) =>
            trackDistRow("install-methods", row, rowIndex, INSTALL_DIST.length)
          }
        />
      </DataSection>

      <DataSection
        title="Most common integrations"
        help="The services and capabilities these servers connect Claude to most often, by tag. Generic tags (mcp, claude) are excluded."
      >
        <DistTable
          rows={TAG_DIST}
          onRowClick={(row, rowIndex) =>
            trackDistRow("integrations", row, rowIndex, TAG_DIST.length)
          }
        />
      </DataSection>

      <ReportDownloads exportSlug="mcp-servers" />

      <section className="mt-12">
        <div className="flex items-center gap-2">
          <CalendarClock className="h-5 w-5 text-ink-muted" aria-hidden />
          <h2 className="h-display-2 text-ink text-balance">Recently added servers</h2>
        </div>
        <p className="mt-2 text-sm text-ink-muted">
          The ten most recently dated MCP servers in the registry snapshot.
        </p>
        <ol className="mt-4 overflow-hidden rounded-xl border border-border bg-surface">
          {RECENT.map((e, rowIndex) => (
            <li
              key={`${e.category}/${e.slug}`}
              className="flex items-center justify-between gap-3 border-b border-border px-5 py-3 last:border-0"
            >
              {(() => {
                const destination = insightsPageEntryDestination(e.category, e.slug);
                if (!destination)
                  return (
                    <span className="min-w-0 truncate text-sm font-medium text-ink">{e.title}</span>
                  );
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
                          "mcp-servers",
                          rowIndex,
                          RECENT.length,
                        ),
                      )
                    }
                    className="min-w-0 truncate text-sm font-medium text-ink hover:underline"
                  >
                    {e.title}
                  </Link>
                );
              })()}
              <span className="shrink-0 font-mono text-xs text-ink-subtle">
                {String(e.dateAdded).slice(0, 10)}
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-12 rounded-xl border border-border bg-surface p-6">
        <h2 className="font-display text-xl font-semibold text-ink">Methodology &amp; citation</h2>
        <p className="mt-2 max-w-2xl text-sm text-ink-muted">
          Figures are computed at build time from the {TOTAL} MCP servers in the HeyClaude registry,
          snapshot dated {asOfLabel}. Transport and local/hosted classification are inferred from
          each server's declared config and install command (stdio for a local <code>command</code>,
          HTTP/SSE for a remote <code>url</code> or explicit transport). Trust and source provenance
          are assigned during maintainer review.
        </p>
        <p className="mt-3 max-w-2xl text-sm text-ink-muted">
          Citing this report? Link to{" "}
          <a
            href={absoluteUrl(PATH)}
            onClick={() => trackStateReportCite()}
            className="text-ink underline-offset-2 hover:underline"
          >
            heyclau.de/state-of-mcp-servers
          </a>{" "}
          with the data-as-of date. See also the{" "}
          {(() => {
            const destination = stateReportEgressRouteDestination("mcp-security-report");
            if (!destination) return "MCP Security & Privacy Report";
            return (
              <Link
                to={destination.to}
                onClick={() => trackStateReportEgress("mcp-security-report")}
                className="text-ink underline-offset-2 hover:underline"
              >
                MCP Security &amp; Privacy Report
              </Link>
            );
          })()}{" "}
          and the broader{" "}
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
            const destination = stateReportEgressRouteDestination("category", "mcp");
            if (!destination || !("params" in destination)) return "MCP servers";
            return (
              <Link
                to={destination.to}
                params={destination.params}
                onClick={() =>
                  trackEvent(
                    stateReportCategoryBrowseAnalyticsEvent(),
                    stateReportCategoryBrowseAnalyticsData(REPORT_ID, "mcp", TOTAL, 0, 1),
                  )
                }
                className="text-ink underline-offset-2 hover:underline"
              >
                MCP servers
              </Link>
            );
          })()}
          .
        </p>
      </section>

      <div className="mt-12">
        <NewsletterInline
          variant="quiet"
          title="Track the MCP ecosystem"
          description="A weekly digest of new servers, coverage shifts, and what landed in the registry."
          source="state-of-mcp-servers"
        />
      </div>
    </PageContainer>
  );
}
