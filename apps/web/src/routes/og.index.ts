import { createFileRoute } from "@tanstack/react-router";
import { getApiRouteDefinition } from "@/lib/api/contracts";
import { apiError, enforceApiRateLimit, getApiRequestId } from "@/lib/api/router";
import { resolveOgQueryFields } from "@/lib/og-query-fields-lib";
import { renderOgPng } from "@/lib/og-render.server";
import { siteConfig } from "@/lib/site";

/**
 * Generic OG image generator (query params) for hub/list pages that aren't a single entry.
 * Lives on the crawlable /og namespace (NOT /api/og, which robots disallows) so social
 * scrapers and Google can fetch the card. Returns PNG so scrapers that don't rasterize
 * SVG og:images still render the card.
 */
export const Route = createFileRoute("/og/")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        // Same expensive Satori path as /api/og — enforce the same ceiling (#5452).
        const ogRoute = getApiRouteDefinition("og.render");
        if (await enforceApiRateLimit(ogRoute, request)) {
          return apiError("rate_limited", 429, { requestId: getApiRequestId(request) });
        }
        const url = new URL(request.url);
        // Defaults live in resolveOgQueryFields: title/eyebrow -> "HeyClaude",
        // description -> subtitle -> the site tagline, all clamped; accent is
        // user-controlled and clamped to a safe hex before it reaches the card.
        const { title, description, eyebrow, accent } = resolveOgQueryFields(
          url.searchParams,
          siteConfig.description,
        );

        const image = await renderOgPng({
          eyebrow,
          title,
          description: description || undefined,
          accent,
        });

        // ImageResponse already sets Content-Type: image/png; add our cache policy.
        const headers = new Headers(image.headers);
        headers.set("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
        return new Response(image.body, { status: 200, headers });
      },
    },
  },
});
