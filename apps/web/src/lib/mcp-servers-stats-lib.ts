import { pctOf } from "@/lib/pct-of-lib";
import { installMethodDistribution } from "@/lib/ecosystem-stats";
import {
  classifyTransport,
  hostingDistribution,
  hostingOf,
  transportDistribution,
} from "@/lib/mcp-stats";
import type { ReportModel } from "@/lib/data-reports";
import {
  SOURCE_LABEL,
  TRUST_LABEL,
  type Entry,
  type SourceStatus,
  type TrustLevel,
} from "@/types/registry";

const TRUST_ORDER: TrustLevel[] = ["trusted", "review", "limited", "blocked"];
const SOURCE_ORDER: SourceStatus[] = ["first-party", "source-backed", "external", "unverified"];

export function buildMcpServersReport(entries: ReadonlyArray<Entry>, asOf: string): ReportModel {
  const mcp = entries.filter((entry) => entry.category === "mcp");
  const total = mcp.length;
  const transport = transportDistribution(mcp);
  const hosting = hostingDistribution(mcp);
  const install = installMethodDistribution(mcp);

  const remote = mcp.filter(
    (entry) => hostingOf(classifyTransport(entry)) === "Remote (hosted)",
  ).length;
  const local = mcp.filter(
    (entry) => hostingOf(classifyTransport(entry)) === "Local (stdio)",
  ).length;
  const sourceBacked = mcp.filter(
    (entry) => entry.source === "source-backed" || entry.source === "first-party",
  ).length;

  const trustRows = TRUST_ORDER.map((trust) => {
    const count = mcp.filter((entry) => entry.trust === trust).length;
    return { label: TRUST_LABEL[trust], count, pct: pctOf(count, total) };
  }).filter((row) => row.count > 0);

  const sourceRows = SOURCE_ORDER.map((source) => {
    const count = mcp.filter((entry) => entry.source === source).length;
    return { label: SOURCE_LABEL[source], count, pct: pctOf(count, total) };
  }).filter((row) => row.count > 0);

  return {
    slug: "/state-of-mcp-servers",
    exportSlug: "mcp-servers",
    title: "State of MCP Servers 2026",
    description:
      "A data report on MCP servers for Claude: transport mix, local vs hosted split, trust and source provenance, and install methods from the HeyClaude registry.",
    keywords: ["MCP servers", "Model Context Protocol", "Claude", "transport", "registry"],
    asOf,
    total,
    stats: [
      { key: "total", label: "MCP servers", value: total, hint: "registry" },
      { key: "remote", label: "Hosted (remote)", value: remote, hint: `${pctOf(remote, total)}%` },
      { key: "local", label: "Local (stdio)", value: local, hint: `${pctOf(local, total)}%` },
      {
        key: "source-backed",
        label: "Source-backed",
        value: sourceBacked,
        hint: `${pctOf(sourceBacked, total)}%`,
      },
    ],
    dimensions: [
      {
        key: "transport",
        title: "Transport distribution",
        help: "How MCP servers connect to Claude.",
        rows: transport.rows.map((row) => ({
          label: row.label,
          count: row.count,
          pct: pctOf(row.count, transport.total),
        })),
      },
      {
        key: "hosting",
        title: "Local vs hosted",
        help: "Whether a server runs locally (stdio) or remotely (HTTP/SSE).",
        rows: hosting.rows.map((row) => ({
          label: row.label,
          count: row.count,
          pct: pctOf(row.count, hosting.total),
        })),
      },
      {
        key: "trust",
        title: "Trust-level distribution",
        help: "Registry trust labels for MCP servers.",
        rows: trustRows,
      },
      {
        key: "source",
        title: "Source provenance distribution",
        help: "How listing identity is verified.",
        rows: sourceRows,
      },
      {
        key: "install-methods",
        title: "Install methods",
        help: "Install command distribution for MCP servers with install commands.",
        rows: install.rows.map((row) => ({
          label: row.label,
          count: row.count,
          pct: pctOf(row.count, install.total),
        })),
      },
    ].filter((dimension) => dimension.rows.length > 0),
  };
}
