import { createFileRoute } from "@tanstack/react-router";
import { siteConfig } from "@/lib/site";
import { applySecurityHeaders } from "@/lib/security-headers";

// MCP registry discovery pointer (/.well-known/mcp.json): lets agents and registries
// resolve the hosted HeyClaude MCP server and its canonical MCP Registry name
// (io.github.JSONbored/heyclaude, published from repo-root server.json). The full
// tool/resource card lives at /.well-known/mcp/server-card.json.

function mcpDiscovery() {
  const base = siteConfig.url;
  return {
    schema_version: 1,
    servers: [
      {
        _meta: {
          "io.github.JSONbored/registry-name": "io.github.JSONbored/heyclaude",
        },
        card: "/.well-known/mcp/server-card.json",
        name: "heyclaude",
        transport: "streamable-http",
        url: `${base}/api/mcp`,
      },
    ],
  };
}

export const Route = createFileRoute("/.well-known/mcp.json")({
  server: {
    handlers: {
      GET: async ({ request }) =>
        new Response(`${JSON.stringify(mcpDiscovery(), null, 2)}\n`, {
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
