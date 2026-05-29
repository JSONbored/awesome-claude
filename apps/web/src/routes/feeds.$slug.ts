import { createFileRoute, notFound } from "@tanstack/react-router";
import {
  applySavedSearch,
  buildRss,
  categoryItems,
  changelogStreamItems,
  FEED_CATEGORIES,
  origin,
  respondFeed,
  SITE_NAME,
  trendingItems,
  type SavedSearchQuery,
} from "@/lib/feeds";
import type { Category } from "@/types/registry";

const CHANGELOG_STREAMS = ["release", "policy", "security"] as const;
type ChangelogStream = (typeof CHANGELOG_STREAMS)[number];

export const Route = createFileRoute("/feeds/$slug")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const slug = params.slug.replace(/\.xml$/, "");
        if (slug === params.slug) throw notFound();

        const base = origin(request);
        const url = new URL(request.url);

        let items;
        let title;
        let description;

        if ((FEED_CATEGORIES as readonly string[]).includes(slug)) {
          items = categoryItems(slug as Category);
          title = `${SITE_NAME} — ${slug}`;
          description = `Newest ${slug} entries on ${SITE_NAME}.`;
        } else if (slug.startsWith("changelog-")) {
          const stream = slug.replace("changelog-", "") as ChangelogStream;
          if (!CHANGELOG_STREAMS.includes(stream)) throw notFound();
          items = changelogStreamItems(stream);
          title = `${SITE_NAME} — ${stream} notes`;
          description = `${stream} notes on ${SITE_NAME}.`;
        } else if (slug === "saved") {
          const q: SavedSearchQuery = {
            q: url.searchParams.get("q") ?? undefined,
            category: url.searchParams.get("category") ?? undefined,
            trust: url.searchParams.get("trust") ?? undefined,
            source: url.searchParams.get("source") ?? undefined,
            platform: url.searchParams.get("platform") ?? undefined,
          };
          const label = url.searchParams.get("label") ?? "Saved search";
          items = applySavedSearch(q);
          title = `${SITE_NAME} — ${label}`;
          description = `Live results for the saved search "${label}".`;
        } else if (slug === "trending") {
          items = await trendingItems();
          title = `${SITE_NAME} — trending`;
          description = "Registry entries with current public community, vote, and intent signals.";
        } else {
          throw notFound();
        }

        const linked = items.map((i) => ({
          ...i,
          link: i.link.startsWith("http") ? i.link : `${base}${i.link}`,
        }));
        const lastBuilt = linked.length ? linked[0].pubDate : new Date(0).toISOString();
        const xml = buildRss({
          title,
          description,
          link: base,
          selfLink: `${base}${url.pathname}${url.search}`,
          items: linked,
          lastBuilt,
        });
        return respondFeed(request, xml, lastBuilt);
      },
    },
  },
});
