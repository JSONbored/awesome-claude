import { createFileRoute } from "@tanstack/react-router";
import { BEST_LISTS, ENTRIES } from "@/mocks/entries";
import { siteConfig } from "@/lib/site";
import { applySecurityHeaders } from "@/lib/security-headers";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function urlItem(pathname: string, priority: string, changefreq = "weekly") {
  return [
    "  <url>",
    `    <loc>${escapeXml(`${siteConfig.url}${pathname}`)}</loc>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    "  </url>",
  ].join("\n");
}

function renderSitemap() {
  const staticPaths = [
    "",
    "/browse",
    "/best",
    "/about",
    "/tools",
    "/tools/submit",
    "/validators",
    "/validators/mcp-config",
    "/validators/skill-package",
    "/jobs",
    "/jobs/post",
    "/submit",
    "/submissions",
    "/legal",
    "/advertise",
    "/api-docs",
    "/claim",
    "/contributors",
    "/ecosystem",
    "/platforms",
    "/quality",
    "/trending",
    "/brief",
    "/feeds",
    "/subscriptions",
    "/llms.txt",
    "/llms-full.txt",
    "/feed.xml",
    "/atom.xml",
  ];
  const categoryPaths = [...new Set(ENTRIES.map((entry) => entry.category))]
    .filter((category) => category !== "tools")
    .map((category) => `/${category}`);
  const bestPaths = BEST_LISTS.map((list) => `/best/${list.slug}`);
  const entryPaths = ENTRIES.map((entry) => `/entry/${entry.category}/${entry.slug}`);
  const legacyEntryPaths = ENTRIES.map((entry) => `/${entry.category}/${entry.slug}`);

  const rows = [
    ...staticPaths.map((pathname) => urlItem(pathname, pathname === "" ? "1" : "0.7")),
    ...categoryPaths.map((pathname) => urlItem(pathname, "0.75")),
    ...bestPaths.map((pathname) => urlItem(pathname, "0.75")),
    ...entryPaths.map((pathname) => urlItem(pathname, "0.8", "monthly")),
    ...legacyEntryPaths.map((pathname) => urlItem(pathname, "0.4", "monthly")),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${rows.join("\n")}\n</urlset>\n`;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () =>
        new Response(renderSitemap(), {
          headers: applySecurityHeaders(
            new Headers({
              "content-type": "application/xml; charset=utf-8",
              "cache-control": "public, max-age=3600, stale-while-revalidate=86400",
            }),
          ),
        }),
    },
  },
});
