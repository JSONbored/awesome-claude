import { pctOf } from "@/lib/pct-of-lib";
import { installMethodDistribution, notesCoverage } from "@/lib/ecosystem-stats";
import type { ReportModel } from "@/lib/data-reports";
import {
  CATEGORIES,
  HARNESSES,
  PLATFORM_LABEL,
  SOURCE_LABEL,
  TRUST_LABEL,
  type Entry,
  type Platform,
  type SourceStatus,
  type TrustLevel,
} from "@/types/registry";

const TRUST_ORDER: TrustLevel[] = ["trusted", "review", "limited", "blocked"];
const SOURCE_ORDER: SourceStatus[] = ["first-party", "source-backed", "external", "unverified"];

export function buildClaudeToolingReport(entries: ReadonlyArray<Entry>, asOf: string): ReportModel {
  const total = entries.length;
  const install = installMethodDistribution(entries);
  const notes = notesCoverage(entries);

  const categoryRows = CATEGORIES.map((category) => {
    const count = entries.filter((entry) => entry.category === category.id).length;
    return { label: category.label, count, pct: pctOf(count, total) };
  }).filter((row) => row.count > 0);

  const trustRows = TRUST_ORDER.map((trust) => {
    const count = entries.filter((entry) => entry.trust === trust).length;
    return { label: TRUST_LABEL[trust], count, pct: pctOf(count, total) };
  }).filter((row) => row.count > 0);

  const sourceRows = SOURCE_ORDER.map((source) => {
    const count = entries.filter((entry) => entry.source === source).length;
    return { label: SOURCE_LABEL[source], count, pct: pctOf(count, total) };
  }).filter((row) => row.count > 0);

  const platformRows = HARNESSES.map((harness) => {
    const count = entries.filter((entry) =>
      entry.platforms.includes(harness.id as Platform),
    ).length;
    return { label: PLATFORM_LABEL[harness.id], count, pct: pctOf(count, total) };
  }).filter((row) => row.count > 0);

  return {
    slug: "/state-of-claude-tooling",
    exportSlug: "claude-tooling",
    title: "State of Claude Tooling",
    description:
      "A data report on the Claude and AI agent tooling ecosystem: category coverage, trust and source provenance, platform compatibility, install methods, and safety/privacy note coverage from the HeyClaude registry.",
    keywords: ["Claude tooling", "AI agent tooling", "MCP", "registry", "trust signals"],
    asOf,
    total,
    stats: [
      { key: "total", label: "Total resources", value: total, hint: "registry" },
      { key: "categories", label: "Categories tracked", value: CATEGORIES.length, hint: "types" },
    ],
    dimensions: [
      {
        key: "categories",
        title: "Resources by category",
        help: "Catalog split by tracked category.",
        rows: categoryRows,
      },
      {
        key: "trust",
        title: "Trust-level distribution",
        help: "Reviewed trust labels across the catalog.",
        rows: trustRows,
      },
      {
        key: "source",
        title: "Source provenance distribution",
        help: "Where listing identity is verified from.",
        rows: sourceRows,
      },
      {
        key: "platforms",
        title: "Platform coverage",
        help: "Declared compatibility across harnesses.",
        rows: platformRows,
      },
      {
        key: "install-methods",
        title: "Install methods",
        help: "Install command distribution for package-installable entries.",
        rows: install.rows.map((row) => ({
          label: row.label,
          count: row.count,
          pct: pctOf(row.count, install.total),
        })),
      },
      {
        key: "notes-coverage",
        title: "Safety & privacy coverage",
        help: "How many entries include reviewer-checked safety and privacy notes.",
        rows: [
          { label: "Safety notes", count: notes.safety, pct: pctOf(notes.safety, total) },
          { label: "Privacy notes", count: notes.privacy, pct: pctOf(notes.privacy, total) },
          { label: "Both", count: notes.both, pct: pctOf(notes.both, total) },
        ].filter((row) => row.count > 0),
      },
    ].filter((dimension) => dimension.rows.length > 0),
  };
}
