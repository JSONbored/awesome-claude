import { createFileRoute } from "@tanstack/react-router";
import { getApiRouteDefinition } from "@/lib/api/contracts";
import { apiError, enforceApiRateLimit, getApiRequestId } from "@/lib/api/router";
import { getEntry } from "@/data/search";
import { categoryAccent } from "@/lib/og-image";
import { ogEntryCardFields } from "@/lib/og-entry-card-lib";
import { renderOgPng } from "@/lib/og-render.server";

/**
 * Per-entry OG image — deterministic PNG card keyed by category + slug, rendered
 * with Satori (workers-og) so social scrapers that don't rasterize SVG og:images
 * still get a real raster image.
 */
export const Route = createFileRoute("/og/$category/$slug")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        // Same expensive Satori path as /api/og — enforce the same ceiling (#5452).
        const ogRoute = getApiRouteDefinition("og.render");
        if (await enforceApiRateLimit(ogRoute, request)) {
          return apiError("rate_limited", 429, { requestId: getApiRequestId(request) });
        }
        const entry = getEntry(params.category, params.slug);
        const { title, description, author, category } = ogEntryCardFields(
          entry,
          params.slug,
          params.category,
        );

        const image = await renderOgPng({
          // The category is the highlighted eyebrow; its accent color-codes the swash + rail.
          eyebrow: category,
          title,
          description,
          author,
          accent: categoryAccent(category),
        });

        // ImageResponse already sets Content-Type: image/png; add our cache policy.
        const headers = new Headers(image.headers);
        headers.set("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
        return new Response(image.body, { status: 200, headers });
      },
    },
  },
});
