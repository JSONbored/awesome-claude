import { absoluteUrl } from "@/lib/seo";
import type { DistRow } from "@/components/data-report";

/**
 * Shared model + helpers for HeyClaude's original registry data reports.
 *
 * A report is a deterministic function of the registry: a set of headline
 * metrics plus labelled distributions ("dimensions"). The same `ReportModel`
 * drives the visible page, its `Dataset` JSON-LD, and its JSON/CSV export, so
 * the three can never disagree and every published number is reproducible from
 * the registry. New reports only need a builder that returns a `ReportModel`.
 */

/** A headline metric tile (count + caption). Icons are attached in the route. */
export interface ReportStat {
  key: string;
  label: string;
  value: number;
  hint: string;
}

/** One measured dimension of a report — a labelled distribution. */
export interface ReportDimension {
  key: string;
  title: string;
  help: string;
  rows: DistRow[];
}

/** A fully-computed registry data report. */
export interface ReportModel {
  /** Route path, e.g. `/state-of-claude-code-hooks`. */
  slug: string;
  /** Stable export id used for `/api/reports/<exportSlug>.{json,csv}`. */
  exportSlug: string;
  title: string;
  description: string;
  keywords: string[];
  /** ISO date (YYYY-MM-DD) the underlying registry snapshot was generated. */
  asOf: string;
  total: number;
  stats: ReportStat[];
  dimensions: ReportDimension[];
}

/**
 * Canonical list of published data-report paths. Single source of truth so the
 * sitemap indexes every report the moment it ships (previously each report had
 * to be hand-added, and most were missing).
 */
export const REPORT_PATHS = [
  "/state-of-claude-tooling",
  "/state-of-mcp-servers",
  "/mcp-security-report",
  "/state-of-claude-code-hooks",
] as const;

/**
 * `Dataset` JSON-LD for a report. `variableMeasured` lists every headline
 * metric and distribution so AI/search engines can see exactly what the report
 * quantifies. (Machine-readable JSON/CSV `DataDownload` links land with the
 * export endpoint in a follow-up.)
 */
export function buildReportDataset(model: ReportModel): Record<string, unknown> {
  const measured = [
    ...model.stats.map((s) => s.label),
    ...model.dimensions.map((d) => d.title),
  ].filter((label, index, list) => list.indexOf(label) === index);
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: model.title,
    description: model.description,
    url: absoluteUrl(model.slug),
    keywords: model.keywords,
    license: "https://creativecommons.org/licenses/by/4.0/",
    isAccessibleForFree: true,
    dateModified: model.asOf,
    creator: {
      "@type": "Organization",
      name: "HeyClaude",
      url: absoluteUrl("/"),
    },
    variableMeasured: measured,
  };
}
