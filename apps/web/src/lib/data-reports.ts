import { absoluteUrl } from "@/lib/seo";
import { pctOf, type DistRow } from "@/components/data-report";

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
  "/state-of-agent-skills",
  "/state-of-ai-agents",
] as const;

/** URL of a report's machine-readable export in the given format. */
export function reportExportUrl(exportSlug: string, format: "json" | "csv") {
  return absoluteUrl(`/api/reports/${exportSlug}.${format}`);
}

/**
 * `Dataset` JSON-LD for a report. `variableMeasured` lists every headline
 * metric and distribution, and `distribution` links the JSON + CSV exports, so
 * AI/search engines can see exactly what the report quantifies and fetch the
 * underlying data.
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
    distribution: [
      {
        "@type": "DataDownload",
        encodingFormat: "application/json",
        contentUrl: reportExportUrl(model.exportSlug, "json"),
      },
      {
        "@type": "DataDownload",
        encodingFormat: "text/csv",
        contentUrl: reportExportUrl(model.exportSlug, "csv"),
      },
    ],
  };
}

/** Stable JSON payload for a report's machine-readable export. */
export function reportToJson(model: ReportModel) {
  return {
    report: model.exportSlug,
    title: model.title,
    description: model.description,
    asOf: model.asOf,
    total: model.total,
    source: absoluteUrl(model.slug),
    license: "CC BY 4.0",
    stats: model.stats.map((s) => ({
      key: s.key,
      label: s.label,
      value: s.value,
    })),
    dimensions: model.dimensions.map((d) => ({
      key: d.key,
      title: d.title,
      rows: d.rows.map((r) => ({
        label: r.label,
        count: r.count,
        percent: r.pct,
      })),
    })),
  };
}

function csvCell(value: string): string {
  // Neutralize spreadsheet formula injection (CWE-1236). Row labels derive from
  // community-submitted registry tags, so a cell could begin with a formula
  // trigger (=, +, -, @, tab, CR); prefixing with a single quote makes Excel /
  // Google Sheets / LibreOffice treat it as text rather than executing it.
  const guarded = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return /[",\r\n]/.test(guarded) ? `"${guarded.replace(/"/g, '""')}"` : guarded;
}

/** Flat CSV of every dimension row (dimension,label,count,percent). */
export function reportToCsv(model: ReportModel): string {
  const lines = [["dimension", "label", "count", "percent"]];
  for (const dimension of model.dimensions) {
    for (const row of dimension.rows) {
      lines.push([dimension.key, row.label, String(row.count), String(row.pct)]);
    }
  }
  return lines.map((cols) => cols.map(csvCell).join(",")).join("\r\n") + "\r\n";
}

/**
 * Top-N tag distribution over a set of entries — a "what are these for" chart.
 * Tags in `exclude` (mechanism/category tags such as the category name) are
 * filtered out so genuine use cases surface. An entry can match several tags,
 * so percentages are share-of-entries-tagged and need not sum to 100.
 */
export function tagDistribution(
  entries: ReadonlyArray<{ tags?: string[] }>,
  options: { exclude?: ReadonlySet<string>; limit?: number } = {},
): DistRow[] {
  const { exclude, limit = 10 } = options;
  const total = entries.length;
  const counts = new Map<string, number>();
  for (const entry of entries) {
    for (const raw of entry.tags ?? []) {
      const tag = raw.trim().toLowerCase();
      if (!tag || exclude?.has(tag)) continue;
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([label, count]) => ({ label, count, pct: pctOf(count, total) }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
    .slice(0, limit);
}
