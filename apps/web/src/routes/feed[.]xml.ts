import { createFileRoute } from "@tanstack/react-router";
import { buildRss, origin, respondFeed, SITE_NAME, SITE_TAGLINE, siteWideItems } from "@/lib/feeds";
import { absolutizeFeedLinks, feedLastBuilt } from "@/lib/feed-items-lib";

export const Route = createFileRoute("/feed.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const base = origin(request);
        const items = absolutizeFeedLinks(siteWideItems(), base);
        const lastBuilt = feedLastBuilt(items);
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
