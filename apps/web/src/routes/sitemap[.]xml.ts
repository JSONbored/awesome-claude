import { createFileRoute } from "@tanstack/react-router";
import { BEST_LISTS, ENTRIES, REGISTRY_ENTRIES } from "@/data/entries";
import { CONTRIBUTORS } from "@/data/contributors";
import { INTEGRATIONS } from "@/data/integrations";
import atlasRegistry from "@/generated/atlas-registry.json";
import { getJobs } from "@/lib/jobs";
import { siteConfig } from "@/lib/site";
import { applySecurityHeaders } from "@/lib/security-headers";
import { CATEGORIES, PLATFORM_LABEL } from "@/types/registry";
import { getIndexableTagGroups } from "@/lib/tags";
import { isSitemapIndexableEntry, sitemapEntryLastModified } from "@/lib/sitemap-policy";
import { COMPARISONS } from "@/data/comparisons";
import { REPORT_PATHS } from "@/lib/data-reports";
import { sitemapUrlItem } from "@/lib/sitemap-url-item-lib";

function urlItem(pathname: string, priority: string, changefreq = "weekly", lastmodInput?: string) {
  return sitemapUrlItem({
    siteUrl: siteConfig.url,
    pathname,
    priority,
    changefreq,
    lastmod: lastmodInput || atlasRegistry.generatedAt,
  });
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
    ...REPORT_PATHS,
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
  // Total entries per platform, reusing the same pass — the platform hub route
  // (for.$platform.tsx) noindexes hubs with fewer than 2 entries, so the sitemap
  // must not advertise them, mirroring how getIndexableTagGroups() filters tags.
  const platformCounts = new Map<string, number>();
  for (const entry of ENTRIES) {
    for (const platform of entry.platforms ?? []) {
      const key = `${entry.category}/${platform}`;
      intersectionCounts.set(key, (intersectionCounts.get(key) ?? 0) + 1);
      platformCounts.set(platform, (platformCounts.get(platform) ?? 0) + 1);
    }
  }
  // Entry `lastmod` comes from sitemapEntryLastModified, whose
  // contentUpdatedAt/repoUpdatedAt signals only exist on the raw registry
  // snapshot — buildEntry() drops them from the client `Entry` shape — so look
  // the raw sibling up by `category/slug` (the same keying data/entries.ts
  // uses for ENTRY_BY_REF).
  const rawEntryByRef = new Map(
    REGISTRY_ENTRIES.map((entry) => [`${entry.category}/${entry.slug}`, entry] as const),
  );
  const intersectionPaths: string[] = [];
  for (const platform of Object.keys(PLATFORM_LABEL)) {
    for (const category of CATEGORIES) {
      if ((intersectionCounts.get(`${category.id}/${platform}`) ?? 0) >= 2) {
        intersectionPaths.push(`/for/${platform}/${category.id}`);
      }
    }
  }

  // Published Weekly Brief archive issues (fail-open: empty in dev/preview or
  // before the first brief is approved).
  const { listPublishedBriefs } = await import("@/lib/brief-issues.server");
  const briefPaths = (await listPublishedBriefs(100)).map((issue) =>
    urlItem(`/brief/${issue.number}`, "0.5", "monthly", issue.period_through),
  );

  const rows = [
    ...staticPaths.map((pathname) => urlItem(pathname, pathname === "" ? "1" : "0.7")),
    ...feedPaths.map((pathname) => urlItem(pathname, "0.4")),
    ...briefPaths,
    // `tools` has no /$category hub — its URL is the static commercial /tools page,
    // already emitted in staticPaths above. Exclude it here to avoid a duplicate.
    ...CATEGORIES.filter((category) => category.id !== "tools").map((category) =>
      urlItem(`/${category.id}`, "0.8", "weekly", categoryLastmod.get(category.id)),
    ),
    ...getIndexableTagGroups().map((group) => urlItem(`/tags/${group.slug}`, "0.5")),
    // Platform hubs with >=2 entries only — thinner ones are noindexed by the route.
    ...Object.keys(PLATFORM_LABEL)
      .filter((platform) => (platformCounts.get(platform) ?? 0) >= 2)
      .map((platform) => urlItem(`/for/${platform}`, "0.6")),
    ...intersectionPaths.map((pathname) => urlItem(pathname, "0.55")),
    ...COMPARISONS.map((comparison) => urlItem(`/compare/${comparison.slug}`, "0.6")),
    ...bestPaths.map((pathname) => urlItem(pathname, "0.75")),
    // Advertise every indexable entry page (all categories, including `tools`).
    // Entries opt out per-entry with `robotsIndex:false` (see isSitemapIndexableEntry).
    // `lastmod` uses the content-update-aware sitemapEntryLastModified helper
    // (contentUpdatedAt || repoUpdatedAt || verifiedAt || dateAdded) on the raw
    // registry entry instead of the weaker inline reviewedAt-based fallback.
    ...ENTRIES.filter(isSitemapIndexableEntry).map((entry) =>
      urlItem(
        `/entry/${entry.category}/${entry.slug}`,
        "0.8",
        "monthly",
        sitemapEntryLastModified(
          rawEntryByRef.get(`${entry.category}/${entry.slug}`) ?? entry,
        )?.toISOString(),
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
