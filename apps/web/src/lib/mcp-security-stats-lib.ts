import { pctOf } from "@/lib/pct-of-lib";
import { notesCoverage } from "@/lib/ecosystem-stats";
import { authDistribution, hostingDistribution, supplyChainCoverage } from "@/lib/mcp-stats";
import type { ReportModel } from "@/lib/data-reports";
import type { Entry } from "@/types/registry";

/**
 * Build the "MCP Server Security & Privacy" report model from the registry.
 * Deterministic: identical input always yields identical output.
 */
export function buildMcpSecurityReport(entries: ReadonlyArray<Entry>, asOf: string): ReportModel {
  const mcp = entries.filter((entry) => entry.category === "mcp");
  const total = mcp.length;
  const notes = notesCoverage(mcp);
  const auth = authDistribution(mcp);
  const hosting = hostingDistribution(mcp);
  const supply = supplyChainCoverage(mcp);
  const withPrereqs = mcp.filter((entry) => (entry.prerequisites?.length ?? 0) > 0).length;
  const withTroubleshooting = mcp.filter((entry) => entry.hasTroubleshooting).length;

  return {
    slug: "/mcp-security-report",
    exportSlug: "mcp-security",
    title: "MCP Server Security & Privacy Report",
    description:
      "A data report on the security and privacy posture of Model Context Protocol (MCP) servers for Claude: authentication methods, network exposure, supply-chain verification, and safety/privacy-note coverage across the HeyClaude registry.",
    keywords: [
      "MCP security",
      "MCP server authentication",
      "Model Context Protocol",
      "OAuth API key",
      "supply chain",
      "Claude",
    ],
    asOf,
    total,
    stats: [
      { key: "total", label: "MCP servers", value: total, hint: "analyzed" },
      {
        key: "safety-notes",
        label: "Safety notes",
        value: notes.safety,
        hint: `${pctOf(notes.safety, total)}% of total`,
      },
      {
        key: "privacy-notes",
        label: "Privacy notes",
        value: notes.privacy,
        hint: `${pctOf(notes.privacy, total)}% of total`,
      },
      {
        key: "verified-package",
        label: "Verified package",
        value: supply.packageVerified,
        hint: `${pctOf(supply.packageVerified, total)}% of total`,
      },
    ],
    dimensions: [
      {
        key: "auth",
        title: "Authentication methods",
        help: "The strongest credential each server declares it needs, inferred from its prerequisites and notes.",
        rows: auth.rows.map((row) => ({
          label: row.label,
          count: row.count,
          pct: pctOf(row.count, auth.total),
        })),
      },
      {
        key: "hosting",
        title: "Network exposure",
        help: "Local (stdio) vs hosted (HTTP/SSE) exposure derived from declared transport.",
        rows: hosting.rows.map((row) => ({
          label: row.label,
          count: row.count,
          pct: pctOf(row.count, hosting.total),
        })),
      },
      {
        key: "supply-chain",
        title: "Supply-chain verification",
        help: "Maintainer-verified packages and checksummed downloadable artifacts.",
        rows: [
          {
            label: "Verified package",
            count: supply.packageVerified,
            pct: pctOf(supply.packageVerified, total),
          },
          {
            label: "Checksummed download",
            count: supply.checksummedDownload,
            pct: pctOf(supply.checksummedDownload, total),
          },
        ].filter((row) => row.count > 0),
      },
      {
        key: "docs",
        title: "Documentation coverage",
        help: "Prerequisites, safety/privacy notes, and troubleshooting metadata for safe rollout.",
        rows: [
          {
            label: "Prerequisites listed",
            count: withPrereqs,
            pct: pctOf(withPrereqs, total),
          },
          {
            label: "Safety notes",
            count: notes.safety,
            pct: pctOf(notes.safety, total),
          },
          {
            label: "Privacy notes",
            count: notes.privacy,
            pct: pctOf(notes.privacy, total),
          },
          {
            label: "Troubleshooting",
            count: withTroubleshooting,
            pct: pctOf(withTroubleshooting, total),
          },
        ].filter((row) => row.count > 0),
      },
      {
        key: "notes",
        title: "Safety & privacy notes",
        help: "Reviewer-checked notes on execution, permissions, and data handling.",
        rows: [
          {
            label: "Safety notes",
            count: notes.safety,
            pct: pctOf(notes.safety, total),
          },
          {
            label: "Privacy notes",
            count: notes.privacy,
            pct: pctOf(notes.privacy, total),
          },
          {
            label: "Both",
            count: notes.both,
            pct: pctOf(notes.both, total),
          },
        ].filter((row) => row.count > 0),
      },
    ].filter((dimension) => dimension.rows.length > 0),
  };
}
