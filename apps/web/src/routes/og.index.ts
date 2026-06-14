import { createFileRoute } from "@tanstack/react-router";
import { renderOgSvg, safeAccent } from "@/lib/og-image";

/**
 * Generic OG image generator (query params) for hub/list pages that aren't a single entry.
 * Lives on the crawlable /og namespace (NOT /api/og, which robots disallows) so social
 * scrapers and Google can fetch the card.
 */
export const Route = createFileRoute("/og/")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const title = url.searchParams.get("title") ?? "HeyClaude";
        const description =
          url.searchParams.get("description") ?? url.searchParams.get("subtitle") ?? undefined;
        const eyebrow = url.searchParams.get("eyebrow") ?? "HeyClaude";
        // accent is user-controlled; clamp to a safe hex before it reaches the SVG attribute.
        const accent = safeAccent(url.searchParams.get("accent"));

        const svg = renderOgSvg({
          eyebrow,
          title,
          description: description ?? undefined,
          accent,
        });

        return new Response(svg, {
          status: 200,
          headers: {
            "Content-Type": "image/svg+xml; charset=utf-8",
            "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
          },
        });
      },
    },
  },
});
