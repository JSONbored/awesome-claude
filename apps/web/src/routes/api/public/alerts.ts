/**
 * GET /api/public/alerts
 *
 * Reads the in-edge-cache list of registry events written by the GitHub
 * webhook handler. Returns an empty list when the cache is cold or webhook
 * configuration is missing; the client should render that as no live alerts.
 */
import { createApiFileRoute } from "@/lib/api/file-route";
import { apiJson, createApiHandler } from "@/lib/api/router";

const CACHE_KEY = "https://heyclau.de/internal/alerts-cache";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
} as const;

const GET = createApiHandler("publicAlerts.read", async () => {
  const c = (globalThis as { caches?: CacheStorage }).caches;
  let events: unknown[] = [];
  if (c && "default" in (c as unknown as Record<string, unknown>)) {
    try {
      const hit = await (c as unknown as { default: Cache }).default.match(new Request(CACHE_KEY));
      if (hit) events = (await hit.json()) as unknown[];
    } catch {
      /* cold cache */
    }
  }
  return apiJson(
    { events },
    {
      headers: {
        "Cache-Control": "public, max-age=30",
        ...CORS,
      },
    },
  );
});

export const Route = createApiFileRoute("/api/public/alerts")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: CORS }),
      GET: async ({ request, params }) => GET(request, { params }),
    },
  },
});
