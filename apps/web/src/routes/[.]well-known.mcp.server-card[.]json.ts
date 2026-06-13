import { createFileRoute } from "@tanstack/react-router";
import { TOOL_DEFINITIONS } from "@heyclaude/mcp/registry";
import { siteConfig } from "@/lib/site";
import { getIntegration } from "@/data/integrations";
import { applySecurityHeaders } from "@/lib/security-headers";

// MCP Server Card (SEP-1649) for agent discovery of the hosted HeyClaude MCP server.
// Tools come from @heyclaude/mcp/registry (TOOL_DEFINITIONS) and the version from the mcp-server
// integration metadata (synced to packages/mcp) — neither can drift from the real server.

function serverCard() {
  const base = siteConfig.url;
  const version = getIntegration("mcp-server")?.version ?? "0.3.0";
  return {
    serverInfo: { name: "@heyclaude/mcp", title: "HeyClaude", version },
    description:
      "Search and inspect the HeyClaude directory of Claude Code MCP servers, agents, skills, hooks, commands, rules, collections, and tools.",
    transport: { type: "streamable-http", endpoint: `${base}/api/mcp` },
    capabilities: { tools: {} },
    tools: TOOL_DEFINITIONS.map((tool) => ({ name: tool.name, description: tool.description })),
    documentation: `${base}/api-docs`,
    homepage: base,
  };
}

export const Route = createFileRoute("/.well-known/mcp/server-card.json")({
  server: {
    handlers: {
      GET: async ({ request }) =>
        new Response(`${JSON.stringify(serverCard(), null, 2)}\n`, {
          headers: applySecurityHeaders(
            new Headers({
              "content-type": "application/json; charset=utf-8",
              "cache-control": "public, max-age=3600, stale-while-revalidate=86400",
            }),
            request,
          ),
        }),
    },
  },
});
