import { createFileRoute } from "@tanstack/react-router";
import {
  buildAtom,
  origin,
  respondFeed,
  SITE_NAME,
  SITE_TAGLINE,
  siteWideItems,
} from "@/lib/feeds";
import { absolutizeFeedLinks, feedLastBuilt } from "@/lib/feed-items-lib";

export const Route = createFileRoute("/atom.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const base = origin(request);
        const items = absolutizeFeedLinks(siteWideItems(), base);
        const lastBuilt = feedLastBuilt(items);
        const xml = buildAtom({
          title: `${SITE_NAME} — registry changelog`,
          description: SITE_TAGLINE,
          link: base,
          selfLink: `${base}/atom.xml`,
          items,
          lastBuilt,
        });
        return respondFeed(request, xml, lastBuilt, "application/atom+xml; charset=utf-8");
      },
    },
  },
});
