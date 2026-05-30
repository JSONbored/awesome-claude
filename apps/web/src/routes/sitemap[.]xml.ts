import { createFileRoute } from "@tanstack/react-router";
import { BEST_LISTS, ENTRIES } from "@/data/entries";
import { CONTRIBUTORS } from "@/data/contributors";
import { INTEGRATIONS } from "@/data/integrations";
import atlasRegistry from "@/generated/atlas-registry.json";
import { getJobs } from "@/lib/jobs";
import { siteConfig } from "@/lib/site";
import { applySecurityHeaders } from "@/lib/security-headers";
import { CATEGORIES } from "@/types/registry";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function urlItem(pathname: string, priority: string, changefreq = "weekly") {
  const lastmod = String(atlasRegistry.generatedAt || "").slice(0, 10);
  return [
    "  <url>",
    `    <loc>${escapeXml(`${siteConfig.url}${pathname}`)}</loc>`,
    lastmod ? `    <lastmod>${escapeXml(lastmod)}</lastmod>` : "",
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    "  </url>",
  ]
    .filter(Boolean)
    .join("\n");
}

async function renderSitemap() {
  const staticPaths = [
    "",
    "/browse",
    "/best",
    "/about",
    "/tools",
    "/tools/submit",
    "/validators",
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
    "/compare",
    "/changelog",
    "/integrations",
    "/brief",
    "/feeds",
    "/subscriptions",
    "/llms.txt",
    "/llms-full.txt",
    "/feed.xml",
    "/atom.xml",
    "/feeds/trending.xml",
    "/data/feeds/index.json",
  ];
  const feedPaths = [
    ...CATEGORIES.map((category) => `/feeds/${category.id}.xml`),
    "/feeds/changelog-release.xml",
    "/feeds/changelog-policy.xml",
    "/feeds/changelog-security.xml",
  ];
  const bestPaths = BEST_LISTS.map((list) => `/best/${list.slug}`);
  const entryPaths = ENTRIES.map((entry) => `/entry/${entry.category}/${entry.slug}`);
  const contributorPaths = CONTRIBUTORS.map((contributor) => `/contributors/${contributor.slug}`);
  const integrationPaths = INTEGRATIONS.map((integration) => `/integrations/${integration.slug}`);
  const jobPaths = (await getJobs()).map((job) => `/jobs/${job.slug}`);

  const rows = [
    ...staticPaths.map((pathname) => urlItem(pathname, pathname === "" ? "1" : "0.7")),
    ...feedPaths.map((pathname) => urlItem(pathname, "0.4")),
    ...bestPaths.map((pathname) => urlItem(pathname, "0.75")),
    ...entryPaths.map((pathname) => urlItem(pathname, "0.8", "monthly")),
    ...contributorPaths.map((pathname) => urlItem(pathname, "0.5", "monthly")),
    ...integrationPaths.map((pathname) => urlItem(pathname, "0.6", "monthly")),
    ...jobPaths.map((pathname) => urlItem(pathname, "0.6", "daily")),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${rows.join("\n")}\n</urlset>\n`;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () =>
        new Response(await renderSitemap(), {
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
