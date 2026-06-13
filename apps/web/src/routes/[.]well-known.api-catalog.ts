import { createFileRoute } from "@tanstack/react-router";
import { siteConfig } from "@/lib/site";
import { applySecurityHeaders } from "@/lib/security-headers";

// RFC 9727 API Catalog: lets agents discover the registry API and the MCP endpoint.
function catalog() {
  const base = siteConfig.url;
  return {
    linkset: [
      {
        anchor: `${base}/api`,
        "service-desc": [{ href: `${base}/openapi.json`, type: "application/json" }],
        "service-doc": [{ href: `${base}/api-docs`, type: "text/html" }],
        status: [{ href: `${base}/api/public/feeds/health`, type: "application/json" }],
      },
      {
        anchor: `${base}/api/mcp`,
        "service-desc": [
          { href: `${base}/.well-known/mcp/server-card.json`, type: "application/json" },
        ],
        "service-doc": [{ href: `${base}/api-docs`, type: "text/html" }],
      },
    ],
  };
}

export const Route = createFileRoute("/.well-known/api-catalog")({
  server: {
    handlers: {
      GET: async ({ request }) =>
        new Response(`${JSON.stringify(catalog(), null, 2)}\n`, {
          headers: applySecurityHeaders(
            new Headers({
              "content-type": "application/linkset+json; charset=utf-8",
              "cache-control": "public, max-age=3600, stale-while-revalidate=86400",
            }),
            request,
          ),
        }),
    },
  },
});
