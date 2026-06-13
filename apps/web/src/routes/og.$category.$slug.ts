import { createFileRoute } from "@tanstack/react-router";
import { getEntry } from "@/data/search";
import { renderOgSvg, categoryAccent } from "@/lib/og-image";

/**
 * Lightweight OG image — deterministic SVG keyed by category + slug.
 * Rendered to PNG by social cards via Cloudflare's image resizing; usable
 * as an inline preview otherwise.
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

        const svg = renderOgSvg({
          eyebrow: `${category} · HeyClaude`,
          title,
          description,
          author,
          accent: categoryAccent(category),
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
