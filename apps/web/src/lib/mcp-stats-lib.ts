/**
 * Pure MCP registry statistics helpers.
 *
 * Classifies MCP transport, hosting, auth requirements, and supply-chain
 * coverage from structured entry fields. Nothing here touches the network —
 * given the same entry metadata the output is deterministic.
 *
 * The public surface (`mcp-stats.ts` / `@/lib/mcp-stats`) re-exports everything
 * below so existing imports stay unchanged.
 */

import type { Entry } from "@/types/registry";

export interface StatRow {
  label: string;
  count: number;
}

/** The MCP transport an entry's declared config/install uses. */
export type McpTransport = "HTTP" | "SSE" | "stdio (local)" | "Unspecified";

/** Join the structured config + install fields we classify transport from. */
function configHaystack(entry: Entry): string {
  return [entry.configSnippet, entry.copySnippet, entry.installCommand]
    .filter(Boolean)
    .join("\n")
    .toLowerCase();
}

/**
 * Classify an MCP server's transport from its declared config/install snippet.
 * Precedence: an explicit SSE marker, then HTTP (explicit type/transport, a remote
 * `url`, or `--transport http`), then a local `command` (stdio), else Unspecified.
 */
export function classifyTransport(entry: Entry): McpTransport {
  const hay = configHaystack(entry);
  if (!hay) return "Unspecified";
  if (/"(?:type|transport)":\s*"sse"|--transport[= ]sse|\bsse\b.*endpoint/.test(hay)) {
    return "SSE";
  }
  if (
    /"(?:type|transport)":\s*"(?:http|streamable-?http)"|--transport[= ]http|"url":\s*"https?:\/\//.test(
      hay,
    )
  ) {
    return "HTTP";
  }
  if (/"command":\s*"/.test(hay)) return "stdio (local)";
  return "Unspecified";
}

/** Whether a transport runs the server locally (stdio) or reaches a hosted endpoint. */
export function hostingOf(
  transport: McpTransport,
): "Local (stdio)" | "Remote (hosted)" | "Unspecified" {
  if (transport === "stdio (local)") return "Local (stdio)";
  if (transport === "HTTP" || transport === "SSE") return "Remote (hosted)";
  return "Unspecified";
}

/** The credential type an MCP server declares it needs. */
export type McpAuth = "OAuth" | "API key" | "Token / PAT" | "None / unspecified";

/** Join the fields where auth requirements are declared (prerequisites + notes + desc). */
function authHaystack(entry: Entry): string {
  return [...(entry.prerequisites ?? []), entry.safetyNotes, entry.privacyNotes, entry.description]
    .filter(Boolean)
    .join("\n")
    .toLowerCase();
}

/**
 * Classify the credential an MCP server requires, inferred from its declared
 * prerequisites and reviewer notes. Precedence (strongest identity first): OAuth,
 * then API key, then a personal-access-token / bearer token, else none declared.
 */
export function classifyAuth(entry: Entry): McpAuth {
  const hay = authHaystack(entry);
  if (/\boauth\d?/.test(hay)) return "OAuth";
  if (/\bapi[\s_-]?keys?\b/.test(hay)) return "API key";
  if (/personal access token|\bpat\b|\bbearer\b|access token/.test(hay)) return "Token / PAT";
  return "None / unspecified";
}

function distribution<T extends string>(
  entries: ReadonlyArray<Entry>,
  classify: (entry: Entry) => T,
  order: ReadonlyArray<T>,
): { rows: StatRow[]; total: number } {
  const counts = new Map<T, number>();
  for (const entry of entries) {
    const key = classify(entry);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  const rows = order
    .map((label) => ({ label, count: counts.get(label) ?? 0 }))
    .filter((row) => row.count > 0);
  return { rows, total: entries.length };
}

const TRANSPORT_ORDER: McpTransport[] = ["stdio (local)", "HTTP", "SSE", "Unspecified"];
const HOSTING_ORDER = ["Local (stdio)", "Remote (hosted)", "Unspecified"] as const;
const AUTH_ORDER: McpAuth[] = ["OAuth", "API key", "Token / PAT", "None / unspecified"];

/** Distribution of MCP transports across the given entries. */
export function transportDistribution(entries: ReadonlyArray<Entry>) {
  return distribution(entries, classifyTransport, TRANSPORT_ORDER);
}

/** Local-vs-remote distribution, derived from transport. */
export function hostingDistribution(entries: ReadonlyArray<Entry>) {
  return distribution(entries, (e) => hostingOf(classifyTransport(e)), HOSTING_ORDER);
}

/** Distribution of declared auth methods across the given entries. */
export function authDistribution(entries: ReadonlyArray<Entry>) {
  return distribution(entries, classifyAuth, AUTH_ORDER);
}

/**
 * Supply-chain verification coverage: how many entries ship a maintainer-verified
 * package and/or a checksummed downloadable artifact.
 */
export function supplyChainCoverage(entries: ReadonlyArray<Entry>): {
  total: number;
  packageVerified: number;
  checksummedDownload: number;
} {
  let packageVerified = 0;
  let checksummedDownload = 0;
  for (const entry of entries) {
    if (entry.packageVerified) packageVerified += 1;
    if (entry.downloadUrl && entry.downloadSha256) checksummedDownload += 1;
  }
  return { total: entries.length, packageVerified, checksummedDownload };
}
