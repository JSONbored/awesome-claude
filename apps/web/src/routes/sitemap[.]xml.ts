import { createFileRoute } from "@tanstack/react-router";
import { BEST_LISTS, ENTRIES } from "@/data/entries";
import { CONTRIBUTORS } from "@/data/contributors";
import { INTEGRATIONS } from "@/data/integrations";
import atlasRegistry from "@/generated/atlas-registry.json";
import { getJobs } from "@/lib/jobs";
import { siteConfig } from "@/lib/site";
import { applySecurityHeaders } from "@/lib/security-headers";
import { CATEGORIES, PLATFORM_LABEL } from "@/types/registry";
import { getIndexableTagGroups } from "@/lib/tags";
import { isSitemapIndexableEntry } from "@/lib/sitemap-policy";
import { COMPARISONS } from "@/data/comparisons";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function urlItem(pathname: string, priority: string, changefreq = "weekly", lastmodInput?: string) {
  const lastmod = String(lastmodInput || atlasRegistry.generatedAt || "").slice(0, 10);
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
    "/tags",
    "/for",
    "/best",
    "/about",
    "/tools",
    "/tools/submit",
    "/validators",
    "/jobs",
    "/jobs/post",
    "/submit",
    "/legal",
    "/advertise",
    "/api-docs",
    "/claim",
    "/contributors",
    "/ecosystem",
    "/platforms",
    "/quality",
    "/state-of-claude-tooling",
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
  ];
  const feedPaths = [
    ...CATEGORIES.map((category) => `/feeds/${category.id}.xml`),
    "/feeds/changelog-release.xml",
    "/feeds/changelog-policy.xml",
    "/feeds/changelog-security.xml",
  ];
  const bestPaths = BEST_LISTS.map((list) => `/best/${list.slug}`);
  // Latest content date per category, so hub lastmod reflects real updates, not every rebuild.
  const categoryLastmod = new Map<string, string>();
  for (const entry of ENTRIES) {
    const date = String(entry.reviewedAt ?? entry.dateAdded ?? "").slice(0, 10);
    if (!date) continue;
    const current = categoryLastmod.get(entry.category);
    if (!current || date > current) categoryLastmod.set(entry.category, date);
  }
  const contributorPaths = CONTRIBUTORS.map((contributor) => `/contributors/${contributor.slug}`);
  const integrationPaths = INTEGRATIONS.map((integration) => `/integrations/${integration.slug}`);
  const jobPaths = (await getJobs()).map((job) => `/jobs/${job.slug}`);
  // category × platform intersection hubs — only those with >=2 entries (the route noindexes
  // thinner ones), so the sitemap never advertises a thin page.
  // One pass over ENTRIES building a `${category}/${platform}` -> count map (was platforms ×
  // categories × ENTRIES.filter ≈ 83K iterations per request).
  const intersectionCounts = new Map<string, number>();
  for (const entry of ENTRIES) {
    for (const platform of entry.platforms ?? []) {
      const key = `${entry.category}/${platform}`;
      intersectionCounts.set(key, (intersectionCounts.get(key) ?? 0) + 1);
    }
  }
  const intersectionPaths: string[] = [];
  for (const platform of Object.keys(PLATFORM_LABEL)) {
    for (const category of CATEGORIES) {
      if ((intersectionCounts.get(`${category.id}/${platform}`) ?? 0) >= 2) {
        intersectionPaths.push(`/for/${platform}/${category.id}`);
      }
    }
  }

  const rows = [
    ...staticPaths.map((pathname) => urlItem(pathname, pathname === "" ? "1" : "0.7")),
    ...feedPaths.map((pathname) => urlItem(pathname, "0.4")),
    // `tools` has no /$category hub — its URL is the static commercial /tools page,
    // already emitted in staticPaths above. Exclude it here to avoid a duplicate.
    ...CATEGORIES.filter((category) => category.id !== "tools").map((category) =>
      urlItem(`/${category.id}`, "0.8", "weekly", categoryLastmod.get(category.id)),
    ),
    ...getIndexableTagGroups().map((group) => urlItem(`/tags/${group.slug}`, "0.5")),
    ...Object.keys(PLATFORM_LABEL).map((platform) => urlItem(`/for/${platform}`, "0.6")),
    ...intersectionPaths.map((pathname) => urlItem(pathname, "0.55")),
    ...COMPARISONS.map((comparison) => urlItem(`/compare/${comparison.slug}`, "0.6")),
    ...bestPaths.map((pathname) => urlItem(pathname, "0.75")),
    // Advertise only indexable entry pages. `tools` entries are commercial,
    // thin-by-design listings (see isSitemapIndexableEntry / AGENTS.md): still
    // crawlable via internal links, just not advertised in the sitemap.
    ...ENTRIES.filter(isSitemapIndexableEntry).map((entry) =>
      urlItem(
        `/entry/${entry.category}/${entry.slug}`,
        "0.8",
        "monthly",
        entry.reviewedAt ?? entry.dateAdded,
      ),
    ),
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
