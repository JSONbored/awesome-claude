import { createFileRoute } from "@tanstack/react-router";
import { OG_TEXT_LIMITS, clampOgText, safeAccent } from "@/lib/og-image";
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
        const url = new URL(request.url);
        const title = clampOgText(
          url.searchParams.get("title") ?? "HeyClaude",
          OG_TEXT_LIMITS.title,
        );
        // Default the description to the site tagline so a bare /og card (e.g. the homepage og:image)
        // says what HeyClaude IS, not just its name. A caller that passes its own description/subtitle
        // (hub/list pages) overrides it.
        const rawDescription =
          url.searchParams.get("description") ?? url.searchParams.get("subtitle") ?? siteConfig.description;
        const description = clampOgText(rawDescription, OG_TEXT_LIMITS.description);
        const eyebrow = clampOgText(
          url.searchParams.get("eyebrow") ?? "HeyClaude",
          OG_TEXT_LIMITS.eyebrow,
        );
        // accent is user-controlled; clamp to a safe hex before it reaches the card markup.
        const accent = safeAccent(url.searchParams.get("accent"));

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
