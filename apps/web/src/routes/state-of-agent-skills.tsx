import { createFileRoute, Link } from "@tanstack/react-router";
import type { ElementType } from "react";
import { Sparkles, BadgeCheck, Boxes, ShieldCheck, CalendarClock } from "lucide-react";

import { ENTRIES, REGISTRY_GENERATED_AT } from "@/data/entries";
import { buildSkillsReport } from "@/lib/skills-stats";
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

const AS_OF = String(REGISTRY_GENERATED_AT).slice(0, 10);
const MODEL = buildSkillsReport(ENTRIES, AS_OF);
const PATH = MODEL.slug;
const PAGE_TITLE = `${MODEL.title} — HeyClaude`;

const STAT_ICON: Record<string, ElementType> = {
  total: Sparkles,
  validated: BadgeCheck,
  packs: Boxes,
  packaged: ShieldCheck,
};

const OG_IMAGE = ogImageUrl({
  eyebrow: "Data report",
  title: MODEL.title,
  description: `${MODEL.total} agent skills by use case, type & verification`,
});

export const Route = createFileRoute("/state-of-agent-skills")({
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
  component: StateOfAgentSkillsPage,
});

function StateOfAgentSkillsPage() {
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
        description="A snapshot of the agent skills ecosystem, derived directly from the HeyClaude registry. Skills package reusable abilities for Claude and other AI coding agents — this report covers what they do, whether they bundle capabilities, how mature and verified they are, and how they ship."
      />
      <p className="mt-2 text-xs text-ink-subtle">Data as of {asOfLabel} (UTC).</p>

      <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-border bg-border stagger-children sm:grid-cols-4">
        {MODEL.stats.map((stat) => (
          <DataStat
            key={stat.key}
            icon={STAT_ICON[stat.key] ?? Sparkles}
            label={stat.label}
            value={stat.value}
            hint={statHint(stat)}
          />
        ))}
      </div>

      {MODEL.dimensions.map((dimension) => (
        <DataSection key={dimension.key} title={dimension.title} help={dimension.help}>
          <DistTable rows={dimension.rows} />
        </DataSection>
      ))}

      <ReportDownloads exportSlug={MODEL.exportSlug} />

      <section className="mt-12 rounded-xl border border-border bg-surface p-6">
        <div className="flex items-center gap-2">
          <CalendarClock className="h-5 w-5 text-ink-muted" aria-hidden />
          <h2 className="font-display text-xl font-semibold text-ink">
            Methodology &amp; citation
          </h2>
        </div>
        <p className="mt-2 max-w-2xl text-sm text-ink-muted">
          Figures are computed at build time from the {MODEL.total} agent skills in the HeyClaude
          registry, snapshot dated {asOfLabel}. Use cases come from registry tags (mechanism tags
          such as “skills” are excluded); type, maturity, and verification status are
          author-declared and confirmed during registry review; package verification reflects a
          maintainer-checked, checksum-pinned artifact.
        </p>
        <p className="mt-3 max-w-2xl text-sm text-ink-muted">
          Citing this report? Link to{" "}
          <a href={absoluteUrl(PATH)} className="text-ink underline-offset-2 hover:underline">
            heyclau.de/state-of-agent-skills
          </a>{" "}
          with the data-as-of date. See also the{" "}
          <Link
            to="/state-of-claude-code-hooks"
            className="text-ink underline-offset-2 hover:underline"
          >
            State of Claude Code Hooks
          </Link>{" "}
          and the broader{" "}
          <Link
            to="/state-of-claude-tooling"
            className="text-ink underline-offset-2 hover:underline"
          >
            State of Claude Tooling
          </Link>
          . Browse all{" "}
          <Link
            to="/$category"
            params={{ category: "skills" }}
            className="text-ink underline-offset-2 hover:underline"
          >
            skills
          </Link>
          .
        </p>
      </section>

      <div className="mt-12">
        <NewsletterInline
          variant="quiet"
          title="Track the Claude Code ecosystem"
          description="A weekly digest of new skills, hooks, and MCP servers as they land in the registry."
          source="state-of-agent-skills"
        />
      </div>
    </PageContainer>
  );
}
