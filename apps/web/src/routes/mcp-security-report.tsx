import { createFileRoute, Link } from "@tanstack/react-router";
import { Boxes, ShieldCheck, Eye, KeyRound, PackageCheck } from "lucide-react";

import { ENTRIES, REGISTRY_GENERATED_AT } from "@/data/entries";
import { notesCoverage } from "@/lib/ecosystem-stats";
import { authDistribution, hostingDistribution, supplyChainCoverage } from "@/lib/mcp-stats";
import { absoluteUrl } from "@/lib/seo";
import { ogImageUrl, OG_WIDTH, OG_HEIGHT } from "@/lib/og-image";
import { stringifyJsonLd } from "@/lib/json-ld";
import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { NewsletterInline } from "@/components/newsletter-inline";
import { DataSection, DataStat, DistTable, pctOf, type DistRow } from "@/components/data-report";
import {
  withCategoryBrowseDrilldown,
  withDocsCoverageDrilldown,
  withHostingDrilldown,
  withNotesSignalDrilldown,
  withSupplyChainSignalDrilldown,
} from "@/lib/data-report-drilldown-lib";
import { trackEvent } from "@/lib/analytics";
import {
  mcpSecurityReportCategoryBrowseAnalyticsData,
  mcpSecurityReportCategoryBrowseAnalyticsEvent,
  mcpSecurityReportCiteAnalyticsData,
  mcpSecurityReportCiteAnalyticsEvent,
  mcpSecurityReportDistRowAnalyticsData,
  mcpSecurityReportDistRowAnalyticsEvent,
  mcpSecurityReportEgressAnalyticsData,
  mcpSecurityReportEgressAnalyticsEvent,
  mcpSecurityReportStatAnalyticsData,
  mcpSecurityReportStatAnalyticsEvent,
  mcpSecurityReportStatBrowseSearch,
  type McpSecurityReportEgressDestination,
} from "@/lib/mcp-security-report-page-cta-events";

function trackMcpSecurityReportEgress(destination: McpSecurityReportEgressDestination) {
  trackEvent(
    mcpSecurityReportEgressAnalyticsEvent(),
    mcpSecurityReportEgressAnalyticsData(destination),
  );
}

function trackDistRow(dimension: string, row: DistRow, rowIndex: number, rowCount: number) {
  if (!row.rowKey) return;
  trackEvent(
    mcpSecurityReportDistRowAnalyticsEvent(),
    mcpSecurityReportDistRowAnalyticsData(dimension, row.rowKey, rowIndex, rowCount),
  );
}

function trackStat(statKey: string, destination: "browse" | "quality" = "browse") {
  trackEvent(
    mcpSecurityReportStatAnalyticsEvent(),
    mcpSecurityReportStatAnalyticsData(statKey, destination),
  );
}

const PATH = "/mcp-security-report";
const TITLE = "MCP Server Security & Privacy Report";
const PAGE_TITLE = `${TITLE} — HeyClaude`;
const DESCRIPTION =
  "A data report on the security and privacy posture of Model Context Protocol (MCP) servers for Claude: authentication methods, network exposure, supply-chain verification, and safety/privacy-note coverage across the HeyClaude registry.";

const AS_OF = String(REGISTRY_GENERATED_AT).slice(0, 10);

const MCP = ENTRIES.filter((e) => e.category === "mcp");
const TOTAL = MCP.length;

const NOTES = notesCoverage(MCP);
const NOTES_DIST: DistRow[] = withNotesSignalDrilldown(
  [
    {
      label: "Safety notes",
      count: NOTES.safety,
      pct: pctOf(NOTES.safety, TOTAL),
    },
    {
      label: "Privacy notes",
      count: NOTES.privacy,
      pct: pctOf(NOTES.privacy, TOTAL),
    },
    { label: "Both", count: NOTES.both, pct: pctOf(NOTES.both, TOTAL), rowKey: "both" },
  ],
  "mcp",
);

const AUTH = authDistribution(MCP);
const AUTH_DIST: DistRow[] = withCategoryBrowseDrilldown(
  AUTH.rows.map((r) => ({
    label: r.label,
    count: r.count,
    pct: pctOf(r.count, AUTH.total),
    rowKey: r.label.toLowerCase().replace(/\s+/g, "-"),
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

const SUPPLY = supplyChainCoverage(MCP);
const SUPPLY_DIST: DistRow[] = withSupplyChainSignalDrilldown(
  [
    {
      label: "Verified package",
      count: SUPPLY.packageVerified,
      pct: pctOf(SUPPLY.packageVerified, TOTAL),
    },
    {
      label: "Checksummed download",
      count: SUPPLY.checksummedDownload,
      pct: pctOf(SUPPLY.checksummedDownload, TOTAL),
    },
  ],
  "mcp",
);

// Documentation & disclosure coverage — how well servers are documented for safe rollout.
const WITH_PREREQS = MCP.filter((e) => (e.prerequisites?.length ?? 0) > 0).length;
const WITH_TROUBLESHOOTING = MCP.filter((e) => e.hasTroubleshooting).length;
const DOCS_DIST: DistRow[] = withDocsCoverageDrilldown(
  [
    {
      label: "Prerequisites listed",
      count: WITH_PREREQS,
      pct: pctOf(WITH_PREREQS, TOTAL),
      rowKey: "prerequisites",
    },
    {
      label: "Safety notes",
      count: NOTES.safety,
      pct: pctOf(NOTES.safety, TOTAL),
    },
    {
      label: "Privacy notes",
      count: NOTES.privacy,
      pct: pctOf(NOTES.privacy, TOTAL),
    },
    {
      label: "Troubleshooting",
      count: WITH_TROUBLESHOOTING,
      pct: pctOf(WITH_TROUBLESHOOTING, TOTAL),
      rowKey: "troubleshooting",
    },
  ],
  "mcp",
);

const OG_IMAGE = ogImageUrl({
  eyebrow: "Data report",
  title: "MCP Security & Privacy",
  description: `Auth, network exposure & supply-chain across ${TOTAL} MCP servers`,
});

export const Route = createFileRoute("/mcp-security-report")({
  head: () => {
    const url = absoluteUrl(PATH);
    const dataset = {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: TITLE,
      description: DESCRIPTION,
      url,
      keywords: [
        "MCP security",
        "MCP server authentication",
        "Model Context Protocol",
        "OAuth API key",
        "supply chain",
        "Claude",
      ],
      license: "https://creativecommons.org/licenses/by/4.0/",
      isAccessibleForFree: true,
      dateModified: AS_OF,
      creator: { "@type": "Organization", name: "HeyClaude", url: absoluteUrl("/") },
      variableMeasured: [
        "Authentication-method distribution",
        "Network exposure (local vs hosted)",
        "Supply-chain verification coverage",
        "Safety-note coverage",
        "Privacy-note coverage",
        "Documentation coverage",
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
  component: McpSecurityReportPage,
});

function McpSecurityReportPage() {
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
        title="MCP Server Security & Privacy Report"
        description="How Model Context Protocol servers for Claude handle credentials, network exposure, and supply-chain trust — quantified across the HeyClaude registry. MCP servers run with real permissions and reach real data, so these signals matter before you install."
      />
      <p className="mt-2 text-xs text-ink-subtle">Data as of {asOfLabel} (UTC).</p>

      <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-border bg-border stagger-children sm:grid-cols-4">
        <DataStat
          icon={Boxes}
          label="MCP servers"
          value={TOTAL}
          hint="analyzed"
          to="/browse"
          search={mcpSecurityReportStatBrowseSearch("total")}
          onNavigate={() => trackStat("total")}
        />
        <DataStat
          icon={ShieldCheck}
          label="Safety notes"
          value={NOTES.safety}
          hint={`${pctOf(NOTES.safety, TOTAL)}% of total`}
          to="/browse"
          search={mcpSecurityReportStatBrowseSearch("safety-notes")}
          onNavigate={() => trackStat("safety-notes")}
        />
        <DataStat
          icon={Eye}
          label="Privacy notes"
          value={NOTES.privacy}
          hint={`${pctOf(NOTES.privacy, TOTAL)}% of total`}
          to="/browse"
          search={mcpSecurityReportStatBrowseSearch("privacy-notes")}
          onNavigate={() => trackStat("privacy-notes")}
        />
        <DataStat
          icon={PackageCheck}
          label="Verified package"
          value={SUPPLY.packageVerified}
          hint={`${pctOf(SUPPLY.packageVerified, TOTAL)}% of total`}
          to="/browse"
          search={mcpSecurityReportStatBrowseSearch("verified-package")}
          onNavigate={() => trackStat("verified-package")}
        />
      </div>

      <DataSection
        title="Authentication methods"
        help="The strongest credential each server declares it needs, inferred from its prerequisites and notes. Servers may support more than one; the strongest identity (OAuth › API key › token) is counted."
      >
        <DistTable
          rows={AUTH_DIST}
          onRowClick={(row, rowIndex) => trackDistRow("auth", row, rowIndex, AUTH_DIST.length)}
        />
      </DataSection>

      <DataSection
        title="Network exposure"
        help="Local (stdio) servers run as a process on your machine; hosted (HTTP/SSE) servers send your requests to a remote endpoint. Remote servers widen the trust boundary — review what they receive."
      >
        <DistTable
          rows={HOSTING_DIST}
          onRowClick={(row, rowIndex) =>
            trackDistRow("hosting", row, rowIndex, HOSTING_DIST.length)
          }
        />
      </DataSection>

      <DataSection
        title="Supply-chain verification"
        help="Servers whose package was verified by a maintainer, and those shipping a checksummed downloadable artifact. Both are signals that what you install matches what was reviewed."
      >
        <DistTable
          rows={SUPPLY_DIST}
          onRowClick={(row, rowIndex) =>
            trackDistRow("supply-chain", row, rowIndex, SUPPLY_DIST.length)
          }
        />
      </DataSection>

      <DataSection
        title="Documentation coverage"
        help="Share of MCP servers carrying the metadata you need for a safe rollout — declared prerequisites, reviewer-checked safety and privacy notes, and troubleshooting guidance."
      >
        <DistTable
          rows={DOCS_DIST}
          onRowClick={(row, rowIndex) => trackDistRow("docs", row, rowIndex, DOCS_DIST.length)}
        />
      </DataSection>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="h-display-2 text-ink text-balance">Safety &amp; privacy notes</h2>
          <p className="mt-2 text-sm text-ink-muted">
            Reviewer-checked notes on execution, permissions, and data handling — the metadata that
            sets HeyClaude apart. Counts are of all {TOTAL} servers; entries can carry both.
          </p>
          <div className="mt-4">
            <DistTable
              rows={NOTES_DIST}
              onRowClick={(row, rowIndex) =>
                trackDistRow("notes", row, rowIndex, NOTES_DIST.length)
              }
            />
          </div>
        </div>
        <div className="rounded-xl border border-border bg-surface p-6">
          <div className="flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-ink-muted" aria-hidden />
            <h2 className="font-display text-xl font-semibold text-ink">Before you install</h2>
          </div>
          <ul className="mt-3 space-y-2 text-sm text-ink-muted">
            <li>
              Scope credentials to the minimum the task needs; prefer OAuth or read-only keys.
            </li>
            <li>For hosted servers, confirm what data leaves your machine and where it lands.</li>
            <li>Prefer verified packages and checksummed artifacts over unpinned installs.</li>
            <li>
              Read the{" "}
              <Link
                to="/guides/$slug"
                params={{ slug: "threat-model-mcp-servers-before-installation" }}
                onClick={() => trackMcpSecurityReportEgress("threat-model-guide")}
                className="text-ink underline-offset-2 hover:underline"
              >
                MCP threat-model guide
              </Link>{" "}
              before a team rollout.
            </li>
          </ul>
        </div>
      </div>

      <section className="mt-12 rounded-xl border border-border bg-surface p-6">
        <h2 className="font-display text-xl font-semibold text-ink">Methodology &amp; citation</h2>
        <p className="mt-2 max-w-2xl text-sm text-ink-muted">
          Figures are computed at build time from the {TOTAL} MCP servers in the HeyClaude registry,
          snapshot dated {asOfLabel}. Authentication method is inferred from each server's declared
          prerequisites and reviewer notes (a heuristic, not a security audit); network exposure is
          derived from the declared transport. Safety and privacy notes are assigned during
          maintainer review.
        </p>
        <p className="mt-3 max-w-2xl text-sm text-ink-muted">
          Citing this report? Link to{" "}
          <a
            href={absoluteUrl(PATH)}
            onClick={() =>
              trackEvent(
                mcpSecurityReportCiteAnalyticsEvent(),
                mcpSecurityReportCiteAnalyticsData(),
              )
            }
            className="text-ink underline-offset-2 hover:underline"
          >
            heyclau.de/mcp-security-report
          </a>{" "}
          with the data-as-of date. See also the{" "}
          <Link
            to="/state-of-mcp-servers"
            onClick={() => trackMcpSecurityReportEgress("state-of-mcp-servers")}
            className="text-ink underline-offset-2 hover:underline"
          >
            State of MCP Servers
          </Link>{" "}
          report. Browse all{" "}
          <Link
            to="/$category"
            params={{ category: "mcp" }}
            onClick={() =>
              trackEvent(
                mcpSecurityReportCategoryBrowseAnalyticsEvent(),
                mcpSecurityReportCategoryBrowseAnalyticsData(TOTAL),
              )
            }
            className="text-ink underline-offset-2 hover:underline"
          >
            MCP servers
          </Link>
          .
        </p>
      </section>

      <div className="mt-12">
        <NewsletterInline
          variant="quiet"
          title="Track MCP security"
          description="A weekly digest of new servers, coverage shifts, and what landed in the registry."
          source="mcp-security-report"
        />
      </div>
    </PageContainer>
  );
}
