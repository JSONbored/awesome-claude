import { createFileRoute } from "@tanstack/react-router";
import { buildRss, origin, respondFeed, SITE_NAME, SITE_TAGLINE, siteWideItems } from "@/lib/feeds";

export const Route = createFileRoute("/feed.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const base = origin(request);
        const items = siteWideItems().map((i) => ({
          ...i,
          link: i.link.startsWith("http") ? i.link : `${base}${i.link}`,
        }));
        const lastBuilt = items.length ? items[0].pubDate : new Date(0).toISOString();
        const xml = buildRss({
          title: `${SITE_NAME} — registry changelog`,
          description: SITE_TAGLINE,
          link: base,
          selfLink: `${base}/feed.xml`,
          items,
          lastBuilt,
        });
        return respondFeed(request, xml, lastBuilt);
      },
    },
  },
});
