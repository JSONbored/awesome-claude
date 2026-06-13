import { createFileRoute } from "@tanstack/react-router";
import { siteConfig } from "@/lib/site";
import { getIntegration } from "@/data/integrations";
import { applySecurityHeaders } from "@/lib/security-headers";

// MCP Server Card (SEP-1649) for agent discovery of the hosted HeyClaude MCP server.
// Version is sourced from the mcp-server integration metadata, which is kept in sync with
// packages/mcp/package.json (enforced by tests/atlas-production-data.test.ts).
const MCP_TOOLS = [
  "search_registry",
  "search_duplicate_entries",
  "list_category_entries",
  "get_entry_detail",
  "get_related_entries",
  "get_recent_updates",
  "compare_entries",
  "get_copyable_asset",
  "get_install_guidance",
  "get_client_setup",
  "get_compatibility",
  "get_platform_adapter",
  "get_registry_stats",
  "list_distribution_feeds",
  "plan_workflow_toolbox",
  "server_info",
  "get_submission_schema",
  "get_submission_policy",
  "get_submission_examples",
  "get_category_submission_guidance",
  "validate_submission_draft",
];

function serverCard() {
  const base = siteConfig.url;
  const version = getIntegration("mcp-server")?.version ?? "0.3.0";
  return {
    serverInfo: { name: "@heyclaude/mcp", title: "HeyClaude", version },
    description:
      "Search and inspect the HeyClaude directory of Claude Code MCP servers, agents, skills, hooks, commands, rules, collections, and tools.",
    transport: { type: "streamable-http", endpoint: `${base}/api/mcp` },
    capabilities: { tools: {} },
    tools: MCP_TOOLS.map((name) => ({ name })),
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
