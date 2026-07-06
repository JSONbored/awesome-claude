/**
 * Pure generators for /llms.txt and /llms-full.txt web surfaces.
 *
 * Callers supply registry snapshot data so this module stays free of
 * static data imports and is easy to test with fixtures.
 */

export interface LlmsCategory {
  id: string;
  label: string;
}

export interface LlmsEntry {
  category: string;
  slug: string;
  title: string;
  description: string;
  cardDescription?: string;
  author?: string;
  trust?: string;
  source?: string;
  sourceUrl?: string;
  docsUrl?: string;
  platforms?: string[];
  safetyNotes?: string;
  prerequisites?: string[];
  installCommand?: string;
  configSnippet?: string;
  fullCopy?: string;
}

export interface LlmsTxtContext {
  categories: LlmsCategory[];
  entries: LlmsEntry[];
}

export interface LlmsFullTxtContext extends LlmsTxtContext {
  registryEntries: Record<string, unknown>[];
  buildCitationFacts?: (entry: Record<string, unknown>, options: { siteUrl: string }) => string;
}

export function buildLlmsTxt(origin: string, context: LlmsTxtContext): string {
  const lines: string[] = [];
  lines.push("# HeyClaude registry");
  lines.push("");
  lines.push("> Curated directory for Claude Code, MCP servers, agents, skills, hooks, and rules.");
  lines.push("");
  lines.push(`Site: ${origin}`);
  lines.push(`Feeds: ${origin}/feeds`);
  lines.push("");

  for (const c of context.categories) {
    const entries = context.entries.filter((e) => e.category === c.id);
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

  lines.push("## Optional");
  lines.push("");
  lines.push(
    `- [Full corpus](${origin}/llms-full.txt): every entry with descriptions, metadata, and install/config snippets`,
  );
  lines.push(
    `- [Trust methodology](${origin}/quality#methodology): source backing, safety/privacy notes, and package verification definitions`,
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

export function buildLlmsFullTxt(origin: string, context: LlmsFullTxtContext): string {
  const rawEntriesByKey = new Map(
    context.registryEntries.map(
      (entry) => [`${String(entry.category)}/${String(entry.slug)}`, entry] as const,
    ),
  );
  const buildCitationFacts = context.buildCitationFacts ?? (() => "");
  const out: string[] = [];
  out.push("# HeyClaude registry — full export");
  out.push("");
  out.push(`Generated for context windows. Source: ${origin}`);
  out.push("");

  for (const c of context.categories) {
    const entries = context.entries.filter((e) => e.category === c.id);
    if (entries.length === 0) continue;
    out.push(`# ${c.label}`);
    out.push("");
    for (const e of entries) {
      out.push(`## ${e.title}`);
      out.push("");
      out.push(`- URL: ${origin}/entry/${e.category}/${e.slug}`);
      out.push(`- Category: ${e.category}`);
      out.push(`- Author: ${e.author ?? ""}`);
      out.push(`- Trust: ${e.trust ?? ""} · Source: ${e.source ?? ""}`);
      if (e.sourceUrl) out.push(`- Source: ${e.sourceUrl}`);
      if (e.docsUrl) out.push(`- Docs: ${e.docsUrl}`);
      if (e.platforms?.length) out.push(`- Platforms: ${e.platforms.join(", ")}`);
      out.push("");
      out.push(e.description);
      out.push("");
      const citationEntry = rawEntriesByKey.get(`${e.category}/${e.slug}`);
      const facts = citationEntry ? buildCitationFacts(citationEntry, { siteUrl: origin }) : "";
      if (facts) {
        out.push("Citation facts:");
        out.push(facts);
        out.push("");
      }
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

export function originOf(request: Request): string {
  const u = new URL(request.url);
  return `${u.protocol}//${u.host}`;
}
