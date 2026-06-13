/**
 * Generators for /llms.txt and /llms-full.txt.
 *
 * - llms.txt: short, link-only manifest of the registry, grouped by category.
 * - llms-full.txt: full descriptions + install/config snippets, ready to drop
 *   into a model's context window.
 *
 * Both are deterministic for a given registry snapshot so ETags are stable.
 */
import { ENTRIES } from "@/data/entries";
import { CATEGORIES } from "@/types/registry";
import { etagFor } from "@/lib/feeds";
import { applySecurityHeaders } from "@/lib/security-headers";

export function buildLlmsTxt(origin: string): string {
  const lines: string[] = [];
  lines.push("# HeyClaude registry");
  lines.push("");
  lines.push("> Curated directory for Claude Code, MCP servers, agents, skills, hooks, and rules.");
  lines.push("");
  lines.push(`Site: ${origin}`);
  lines.push(`Feeds: ${origin}/feeds`);
  lines.push("");

  for (const c of CATEGORIES) {
    const entries = ENTRIES.filter((e) => e.category === c.id);
    if (entries.length === 0) continue;
    lines.push(`## ${c.label}`);
    lines.push("");
    for (const e of entries) {
      lines.push(
        `- [${e.title}](${origin}/entry/${e.category}/${e.slug}): ${e.cardDescription ?? e.description}`,
      );
    }
    lines.push("");
  }

  // Optional section (llmstxt.org): supplementary machine-readable surfaces agents can pull.
  lines.push("## Optional");
  lines.push("");
  lines.push(
    `- [Full corpus](${origin}/llms-full.txt): every entry with descriptions, metadata, and install/config snippets`,
  );
  lines.push(`- [OpenAPI spec](${origin}/openapi.json): machine-readable REST API`);
  lines.push(`- [API feed](${origin}/api/registry/feed): endpoint map and distribution feeds`);
  lines.push(
    `- [Directory index](${origin}/data/directory-index.json): flat per-entry JSON with tags and keywords`,
  );
  lines.push(
    `- [MCP server card](${origin}/.well-known/mcp/server-card.json): MCP tools and resources`,
  );
  lines.push(`- [Agent skills index](${origin}/.well-known/agent-skills/index.json)`);
  lines.push("");
  return lines.join("\n");
}

export function buildLlmsFullTxt(origin: string): string {
  const out: string[] = [];
  out.push("# HeyClaude registry — full export");
  out.push("");
  out.push(`Generated for context windows. Source: ${origin}`);
  out.push("");

  for (const c of CATEGORIES) {
    const entries = ENTRIES.filter((e) => e.category === c.id);
    if (entries.length === 0) continue;
    out.push(`# ${c.label}`);
    out.push("");
    for (const e of entries) {
      out.push(`## ${e.title}`);
      out.push("");
      out.push(`- URL: ${origin}/entry/${e.category}/${e.slug}`);
      out.push(`- Category: ${e.category}`);
      out.push(`- Author: ${e.author}`);
      out.push(`- Trust: ${e.trust} · Source: ${e.source}`);
      if (e.sourceUrl) out.push(`- Source: ${e.sourceUrl}`);
      if (e.docsUrl) out.push(`- Docs: ${e.docsUrl}`);
      if (e.platforms?.length) out.push(`- Platforms: ${e.platforms.join(", ")}`);
      out.push("");
      out.push(e.description);
      out.push("");
      if (e.safetyNotes) {
        out.push(`Safety: ${e.safetyNotes}`);
        out.push("");
      }
      if (e.prerequisites?.length) {
        out.push(`Prerequisites: ${e.prerequisites.join("; ")}`);
        out.push("");
      }
      if (e.installCommand) {
        out.push("Install:");
        out.push("```");
        out.push(e.installCommand);
        out.push("```");
        out.push("");
      }
      if (e.configSnippet) {
        out.push("Config:");
        out.push("```");
        out.push(e.configSnippet);
        out.push("```");
        out.push("");
      }
      if (e.fullCopy) {
        out.push("Full copy:");
        out.push("```");
        out.push(e.fullCopy);
        out.push("```");
        out.push("");
      }
      out.push("---");
      out.push("");
    }
  }
  return out.join("\n");
}

const TEXT_CACHE = "public, max-age=300, stale-while-revalidate=3600";

export async function respondText(request: Request, body: string): Promise<Response> {
  const etag = await etagFor(body);
  const ifNoneMatch = request.headers.get("if-none-match");
  const headers = applySecurityHeaders(
    new Headers({
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": TEXT_CACHE,
      ETag: etag,
    }),
  );
  if (ifNoneMatch && ifNoneMatch === etag) {
    return new Response(null, { status: 304, headers });
  }
  return new Response(body, { headers });
}

export function originOf(request: Request): string {
  const u = new URL(request.url);
  return `${u.protocol}//${u.host}`;
}
