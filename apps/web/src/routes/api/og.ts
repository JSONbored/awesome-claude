import { createApiFileRoute } from "@/lib/api/file-route";
import { ogQuerySchema } from "@/lib/api/contracts";
import { createApiHandler, type InferApiQuery } from "@/lib/api/router";
import { resolveApiOgCardOptions } from "@/lib/og-api-query-lib";
import { renderOgPng } from "@/lib/og-render.server";

/**
 * Documented `/api/og` social-preview endpoint.
 *
 * Wired to the same PNG renderer as the crawlable `/og` route so the published
 * OpenAPI query params (title, description, label, kind, badge) actually change
 * the image. Scrapers that need a crawlable URL should still use `/og` (robots
 * disallows `/api/*`).
 */
export const GET = createApiHandler("og.render", async ({ query }) => {
  const parsed = query as InferApiQuery<typeof ogQuerySchema>;
  const image = await renderOgPng(resolveApiOgCardOptions(parsed));

  // ImageResponse already sets Content-Type: image/png; keep the documented
  // cache policy that the stub used (per-query images remain cacheable).
  const headers = new Headers(image.headers);
  headers.set("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400");
  return new Response(image.body, { status: 200, headers });
});

export const Route = createApiFileRoute("/api/og")({
  server: {
    handlers: {
      GET: async ({ request, params }) => GET(request, { params }),
    },
  },
});
