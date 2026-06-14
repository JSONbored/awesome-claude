import { createFileRoute } from "@tanstack/react-router";
import { getEntry } from "@/data/search";
import { categoryAccent } from "@/lib/og-image";
import { renderOgPng } from "@/lib/og-render.server";

/**
 * Per-entry OG image — deterministic PNG card keyed by category + slug, rendered
 * with Satori (workers-og) so social scrapers that don't rasterize SVG og:images
 * still get a real raster image.
 */
export const Route = createFileRoute("/og/$category/$slug")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const entry = getEntry(params.category, params.slug);
        const title = entry?.title ?? params.slug;
        const description =
          entry?.cardDescription ?? entry?.description ?? "Curated in the HeyClaude registry.";
        const author = entry?.author ?? "HeyClaude";
        const category = entry?.category ?? params.category;

        const image = renderOgPng({
          eyebrow: `${category} · HeyClaude`,
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
