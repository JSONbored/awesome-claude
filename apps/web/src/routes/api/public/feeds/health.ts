/**
 * GET /api/public/feeds/health
 *
 * Reports build time, item counts, ETag, and freshness for every feed.
 * Body is deterministic for a given registry snapshot.
 */
import { createApiFileRoute } from "@/lib/api/file-route";
import { apiJson, createApiHandler } from "@/lib/api/router";
import { allFeedHealth, origin } from "@/lib/feeds";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
} as const;

const GET = createApiHandler("publicFeeds.health", async ({ request }) => {
  const feeds = await allFeedHealth(origin(request));
  const generatedAt = new Date().toISOString();
  return apiJson(
    { generatedAt, count: feeds.length, feeds },
    {
      headers: {
        "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
        ...CORS,
      },
    },
  );
});

export const Route = createApiFileRoute("/api/public/feeds/health")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: CORS }),
      GET: async ({ request, params }) => GET(request, { params }),
    },
  },
});
