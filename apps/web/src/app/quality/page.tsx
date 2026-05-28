import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { getContentQualityReport, getRegistryTrustReport } from "@/lib/content";
import {
  buildCategoryHref,
  buildEntryHref,
  buildQualityDashboardSummary,
  type CategoryTrustRow,
} from "@/lib/quality-dashboard";
import { buildPageMetadata } from "@/lib/seo";
import { withDuration } from "@/lib/server-page-logging";
import { categoryLabels, siteConfig } from "@/lib/site";
import {
  buildBreadcrumbJsonLd,
  buildCollectionPageJsonLd,
} from "@heyclaude/registry/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "HeyClaude registry quality",
  description:
    "Review HeyClaude registry quality, provenance, package validation, SEO coverage, source signals, and maintenance readiness across content.",
  path: "/quality",
  keywords: [
    "heyclaude quality",
    "claude registry quality",
    "ai citation quality",
  ],
});

export default async function QualityPage() {
  return withDuration("quality.page", async ({ getDurationMs, logger }) => {
    const [report, trustReport] = await Promise.all([
      getContentQualityReport(),
      getRegistryTrustReport(),
    ]);
    const categories = Object.entries(report.categoryBreakdown).sort(
      ([left], [right]) =>
        (categoryLabels[left] ?? left).localeCompare(
          categoryLabels[right] ?? right,
        ),
    );
    const improvementQueue = [...report.entries]
      .filter((entry) => entry.warnings.length)
      .sort((left, right) => left.scores.total - right.scores.total)
      .slice(0, 12);
    const trustEntries = Array.isArray(trustReport.entries)
      ? trustReport.entries
      : [];
    const trustImprovementQueue = trustEntries
      .filter((entry) => (entry.recommendations?.length ?? 0) > 0)
      .slice(0, 12);
    const dashboardSummary = buildQualityDashboardSummary(trustReport);
    const trustRowsByCategory = new Map<string, CategoryTrustRow>(
      dashboardSummary.categoryTrustRows.map((row) => [row.category, row]),
    );
    const jsonLd = [
      buildBreadcrumbJsonLd([
        { name: "Home", url: siteConfig.url },
        { name: "Quality", url: `${siteConfig.url}/quality` },
      ]),
      buildCollectionPageJsonLd({
        siteUrl: siteConfig.url,
        path: "/quality",
        name: "HeyClaude registry quality",
        description:
          "Content quality, provenance, SEO, and maintenance signals for the HeyClaude registry.",
        breadcrumbId: `${siteConfig.url}/quality#breadcrumb`,
      }),
    ];

    logger.info("summary", {
      categoryCount: categories.length,
      contentEntryCount: report.count,
      durationMs: getDurationMs(),
      improvementQueueLength: improvementQueue.length,
      trustEntryCount: trustEntries.length,
      trustImprovementQueueLength: trustImprovementQueue.length,
      weakestCategoryCount: dashboardSummary.weakestCategories.length,
    });

    return (
      <div className="container-shell space-y-8 py-12">
        <JsonLd data={jsonLd} />
        <div className="space-y-4 border-b border-border/80 pb-8">
          <Breadcrumbs
            items={[{ label: "Home", href: "/" }, { label: "Quality" }]}
          />
          <span className="eyebrow">Registry quality</span>
          <h1 className="section-title">
            Quality, provenance, and SEO signals.
          </h1>
          <p className="max-w-3xl text-sm leading-8 text-muted-foreground">
            This dashboard is generated from the same registry contract that
            powers search, Raycast, LLM exports, and API consumers.
          </p>
        </div>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Average score", report.summary.averageScore],
            ["Entries", report.count],
            ["First-party editorial", report.summary.firstPartyEditorialCount],
            ["Missing SEO", report.summary.missingSeoCount],
          ].map(([label, value]) => (
            <div key={label} className="surface-panel p-5">
              <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                {label}
              </p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
                {value}
              </p>
            </div>
          ))}
        </section>

        <section className="surface-panel p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                Registry trust coverage
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground">
                Brand metadata, source links, checksums, adapters, provenance,
                and verification freshness generated from the same public
                registry artifacts.
              </p>
            </div>
            <Link
              href="/data/registry-trust-report.json"
              className="text-sm font-medium text-primary underline underline-offset-4"
            >
              Raw trust report
            </Link>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              [
                "Brand coverage",
                `${trustReport.summary.brandedCount}/${trustReport.count}`,
                `${trustReport.summary.brandedPercent}%`,
              ],
              [
                "Source-backed",
                `${trustReport.summary.sourceAvailableCount}/${trustReport.count}`,
                `${trustReport.summary.sourceAvailablePercent}%`,
              ],
              [
                "Checksums",
                trustReport.summary.checksumPresentCount,
                `${trustReport.summary.checksumPresentPercent}%`,
              ],
              [
                "Safety notes",
                `${trustReport.summary.safetyNotesCount}/${trustReport.count}`,
                `${trustReport.summary.safetyNotesPercent}%`,
              ],
              [
                "Privacy notes",
                `${trustReport.summary.privacyNotesCount}/${trustReport.count}`,
                `${trustReport.summary.privacyNotesPercent}%`,
              ],
              [
                "First-party packages",
                trustReport.summary.firstPartyPackageCount,
                `${trustReport.summary.firstPartyPackagePercent}%`,
              ],
              [
                "Claimed/reviewed",
                trustReport.summary.claimedOrReviewedCount,
                `${trustReport.summary.claimedOrReviewedPercent}%`,
              ],
              [
                "Needs attention",
                trustReport.summary.entriesNeedingAttention,
                `${trustReport.summary.recommendedFixCount} fixes`,
              ],
            ].map(([label, value, note]) => (
              <div
                key={label}
                className="rounded-xl border border-border bg-background p-4"
              >
                <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  {label}
                </p>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                  {value}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{note}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="surface-panel p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                Safety and privacy coverage on risk-bearing categories
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground">
                MCP servers, hooks, skills, statuslines, and slash commands run
                untrusted behavior or touch local files. Safety and privacy
                notes are the fastest contributor-actionable win.
              </p>
            </div>
            <Link
              href="/AGENTS.md"
              className="text-sm font-medium text-primary underline underline-offset-4"
            >
              Safety field guide
            </Link>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-border bg-background p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                Risk-bearing entries
              </p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                {dashboardSummary.riskBearingTotals.totalEntries}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                across {dashboardSummary.riskBearingCategories.join(", ")}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-background p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                Safety notes covered
              </p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                {dashboardSummary.riskBearingTotals.safetyCoveragePercent}%
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {dashboardSummary.riskBearingTotals.totalMissingSafetyNotes}{" "}
                entries still missing
              </p>
            </div>
            <div className="rounded-xl border border-border bg-background p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                Privacy notes covered
              </p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                {dashboardSummary.riskBearingTotals.privacyCoveragePercent}%
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {dashboardSummary.riskBearingTotals.totalMissingPrivacyNotes}{" "}
                entries still missing
              </p>
            </div>
            <div className="rounded-xl border border-border bg-background p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                Source-backed
              </p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                {dashboardSummary.provenanceCoverage.sourcePercent}%
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {dashboardSummary.provenanceCoverage.missingSourceCount} entries
                still missing source
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {categories.map(([category, data]) => {
            const trustRow = trustRowsByCategory.get(category);
            return (
              <Link
                key={category}
                href={buildCategoryHref(category)}
                className="surface-panel p-5 transition hover:border-primary/50"
              >
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-lg font-semibold tracking-tight text-foreground">
                    {categoryLabels[category] ?? category}
                  </h2>
                  <span className="rounded-full border border-border bg-card px-2.5 py-1 text-xs text-muted-foreground">
                    {data.count} entries
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                      Average
                    </p>
                    <p className="mt-1 text-foreground">
                      {data.averageScore}/100
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                      Warnings
                    </p>
                    <p className="mt-1 text-foreground">{data.warningCount}</p>
                  </div>
                </div>
                {trustRow ? (
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                        Source
                      </p>
                      <p className="mt-1 text-foreground">
                        {trustRow.sourcePercent}%
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                        Safety
                      </p>
                      <p className="mt-1 text-foreground">
                        {trustRow.safetyNotesPercent}%
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                        Privacy
                      </p>
                      <p className="mt-1 text-foreground">
                        {trustRow.privacyNotesPercent}%
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                        Reviewed
                      </p>
                      <p className="mt-1 text-foreground">
                        {trustRow.claimedOrReviewedPercent}%
                      </p>
                    </div>
                  </div>
                ) : null}
              </Link>
            );
          })}
        </section>

        {dashboardSummary.weakestCategories.length > 0 ? (
          <section className="surface-panel p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                  Categories that need the most help
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground">
                  Lowest combined coverage across source, brand, safety,
                  privacy, and provenance — these are the best spots to
                  contribute next.
                </p>
              </div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {dashboardSummary.weakestCategories.map((row) => (
                <Link
                  key={row.category}
                  href={buildCategoryHref(row.category)}
                  className="rounded-xl border border-border bg-background p-4 transition hover:border-primary/50"
                >
                  <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                    {categoryLabels[row.category] ?? row.category}
                  </p>
                  <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                    {row.trustCoverageScore}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    combined coverage points · {row.recommendedFixes}{" "}
                    recommended fixes
                  </p>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        {dashboardSummary.missingSafetyNotes.length > 0 ||
        dashboardSummary.missingPrivacyNotes.length > 0 ? (
          <section className="grid gap-4 md:grid-cols-2">
            <div className="surface-panel p-5">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                  Likely needs safety notes
                </h2>
                <span className="rounded-full border border-border bg-card px-2.5 py-1 text-xs text-muted-foreground">
                  {dashboardSummary.riskBearingTotals.totalMissingSafetyNotes}{" "}
                  total
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Risk-bearing entries currently published without{" "}
                <code className="rounded bg-muted px-1 py-0.5">
                  safetyNotes
                </code>
                .
              </p>
              <div className="mt-4 space-y-2">
                {dashboardSummary.missingSafetyNotes.map((gap) => (
                  <Link
                    key={`safety-${gap.key}`}
                    href={buildEntryHref(gap.category, gap.slug)}
                    className="flex items-center justify-between gap-4 rounded-xl border border-border bg-background px-4 py-3 text-sm transition hover:border-primary/50"
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-medium text-foreground">
                        {gap.title}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {categoryLabels[gap.category] ?? gap.category}
                      </span>
                    </span>
                    <span className="shrink-0 text-muted-foreground">
                      {gap.missingPrivacyNotes ? "safety + privacy" : "safety"}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
            <div className="surface-panel p-5">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                  Likely needs privacy notes
                </h2>
                <span className="rounded-full border border-border bg-card px-2.5 py-1 text-xs text-muted-foreground">
                  {dashboardSummary.riskBearingTotals.totalMissingPrivacyNotes}{" "}
                  total
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Risk-bearing entries currently published without{" "}
                <code className="rounded bg-muted px-1 py-0.5">
                  privacyNotes
                </code>
                .
              </p>
              <div className="mt-4 space-y-2">
                {dashboardSummary.missingPrivacyNotes.map((gap) => (
                  <Link
                    key={`privacy-${gap.key}`}
                    href={buildEntryHref(gap.category, gap.slug)}
                    className="flex items-center justify-between gap-4 rounded-xl border border-border bg-background px-4 py-3 text-sm transition hover:border-primary/50"
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-medium text-foreground">
                        {gap.title}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {categoryLabels[gap.category] ?? gap.category}
                      </span>
                    </span>
                    <span className="shrink-0 text-muted-foreground">
                      {gap.missingSafetyNotes ? "safety + privacy" : "privacy"}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="surface-panel p-5">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Maintainer improvement queue
            </h2>
            <Link
              href="/data/content-quality-report.json"
              className="text-sm font-medium text-primary underline underline-offset-4"
            >
              Raw report
            </Link>
          </div>
          <div className="mt-4 space-y-2">
            {improvementQueue.map((entry) => (
              <Link
                key={entry.key}
                href={buildEntryHref(entry.category, entry.slug)}
                className="flex items-center justify-between gap-4 rounded-xl border border-border bg-background px-4 py-3 text-sm transition hover:border-primary/50"
              >
                <span className="min-w-0">
                  <span className="block truncate font-medium text-foreground">
                    {entry.title}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {categoryLabels[entry.category] ?? entry.category} -{" "}
                    {entry.warnings.length} warning
                    {entry.warnings.length === 1 ? "" : "s"}
                  </span>
                </span>
                <span className="shrink-0 text-muted-foreground">
                  {entry.scores.total}/100
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="surface-panel p-5">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Trust improvement queue
            </h2>
            <Link
              href="/browse?utility=brand-metadata"
              className="text-sm font-medium text-primary underline underline-offset-4"
            >
              Browse branded entries
            </Link>
          </div>
          <div className="mt-4 space-y-2">
            {trustImprovementQueue.map((entry) => {
              const recommendationCount = entry.recommendations?.length ?? 0;
              const firstRecommendation =
                entry.recommendations?.[0] ?? "Review trust metadata.";
              return (
                <Link
                  key={entry.key}
                  href={buildEntryHref(entry.category, entry.slug)}
                  className="flex items-center justify-between gap-4 rounded-xl border border-border bg-background px-4 py-3 text-sm transition hover:border-primary/50"
                >
                  <span className="min-w-0">
                    <span className="block truncate font-medium text-foreground">
                      {entry.title}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {categoryLabels[entry.category] ?? entry.category} -{" "}
                      {firstRecommendation}
                    </span>
                  </span>
                  <span className="shrink-0 text-muted-foreground">
                    {recommendationCount}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="surface-panel p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                Where to contribute next
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground">
                Every metric on this page is deterministic and traceable to the
                public registry artifacts. Pick a category, send a focused PR.
              </p>
            </div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="https://github.com/JSONbored/awesome-claude/blob/main/CONTRIBUTING.md"
              className="rounded-xl border border-border bg-background p-4 transition hover:border-primary/50"
            >
              <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                Submission guide
              </p>
              <p className="mt-2 text-sm font-medium text-foreground">
                CONTRIBUTING.md
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                What counts as quality evidence and how to attribute sources.
              </p>
            </Link>
            <Link
              href="https://github.com/JSONbored/awesome-claude/blob/main/AGENTS.md"
              className="rounded-xl border border-border bg-background p-4 transition hover:border-primary/50"
            >
              <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                Safety and privacy policy
              </p>
              <p className="mt-2 text-sm font-medium text-foreground">
                AGENTS.md
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Field definitions for safetyNotes, privacyNotes, and disclosure.
              </p>
            </Link>
            <Link
              href="https://github.com/JSONbored/awesome-claude/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22+label%3Adata"
              className="rounded-xl border border-border bg-background p-4 transition hover:border-primary/50"
            >
              <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                Help wanted · data
              </p>
              <p className="mt-2 text-sm font-medium text-foreground">
                Open data-quality issues
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Issues labeled &quot;help wanted&quot; that touch registry data.
              </p>
            </Link>
            <Link
              href="/data/registry-trust-report.json"
              className="rounded-xl border border-border bg-background p-4 transition hover:border-primary/50"
            >
              <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                Raw artifacts
              </p>
              <p className="mt-2 text-sm font-medium text-foreground">
                registry-trust-report.json
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                The same JSON powering this dashboard, the API, Raycast, and
                MCP.
              </p>
            </Link>
          </div>
        </section>
      </div>
    );
  });
}
