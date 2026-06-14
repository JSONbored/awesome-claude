import { createFileRoute } from "@tanstack/react-router";
import { getEntry } from "@/data/search";
import { categoryAccent, renderBadgeSvg } from "@/lib/og-image";

/**
 * Embeddable "Listed on HeyClaude" badge — a crawlable, shield-style SVG keyed by
 * category + slug. Maintainers drop the markdown snippet (shown on the entry page)
 * into their README, which links back to the entry page (a backlink driver).
 *
 * The right segment shows the entry's category. All entry-derived text is escaped
 * inside renderBadgeSvg() before it reaches the SVG markup. Unknown entries get a
 * neutral badge with a 404 status so the markup still renders but isn't cacheable
 * as a real listing.
 */
export const Route = createFileRoute("/badge/$category/{$slug}.svg")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const entry = getEntry(params.category, params.slug);

        const svg = entry
          ? renderBadgeSvg({ value: entry.category, accent: categoryAccent(entry.category) })
          : renderBadgeSvg({ value: "not found" });

        return new Response(svg, {
          status: entry ? 200 : 404,
          headers: {
            "content-type": "image/svg+xml; charset=utf-8",
            // Long-lived for real entries (immutable per slug); short for the neutral 404.
            "cache-control": entry
              ? "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800"
              : "public, max-age=300",
          },
        });
      },
    },
  },
});
