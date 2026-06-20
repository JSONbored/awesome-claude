import { createApiFileRoute } from "@/lib/api/file-route";

import { platformFeedSlug } from "@heyclaude/registry/artifacts";

import { createApiHandler } from "@/lib/api/router";
import { getCategorySummaries, getRegistryManifest } from "@/lib/content.server";
import { cachedJsonResponse } from "@/lib/http-cache";
import { getPlatformPageDefinitions } from "@/lib/platform-pages";
import { siteConfig } from "@/lib/site";

const JOBS_API_PATH = "/api/jobs?limit=100";
const QUALITY_METHODOLOGY_PATH = "/quality#methodology";
const CATEGORY_FEED_PATH = "/data/feeds/categories/{category}.json";
const PLATFORM_FEED_PATH = "/data/feeds/platforms/{platform}.json";

function categoryFeedAliases(categories: Array<{ category: string }>) {
  return Object.fromEntries(
    categories.map(({ category }) => [category, `/data/feeds/categories/${category}.json`]),
  );
}

function platformFeedAliases() {
  return Object.fromEntries(
    getPlatformPageDefinitions().map(({ platform, slug }) => [
      slug,
      `/data/feeds/platforms/${platformFeedSlug(platform)}.json`,
    ]),
  );
}

export const GET = createApiHandler("registry.feed", async ({ request }) => {
  const [manifest, categories] = await Promise.all([getRegistryManifest(), getCategorySummaries()]);
  const categoryFeeds = categoryFeedAliases(categories);
  const platformFeeds = platformFeedAliases();

  return cachedJsonResponse(request, {
    schemaVersion: 1,
    kind: "registry-feed",
    generatedAt: manifest.generatedAt,
    site: {
      name: siteConfig.name,
      url: siteConfig.url,
      description: siteConfig.description,
    },
    qualityMethodology: QUALITY_METHODOLOGY_PATH,
    categoryFeeds,
    platformFeeds,
    jobs: JOBS_API_PATH,
    endpoints: {
      manifest: "/api/registry/manifest",
      categories: "/api/registry/categories",
      search: "/api/registry/search?q={query}&category={category}&platform={platform}&limit=20",
      trending: "/api/registry/trending?category={category}&platform={platform}&limit=12",
      diff: "/api/registry/diff?since={hash-or-date}&limit=100",
      integrity: "/api/registry/integrity?artifact={artifact}&hash={sha256}",
      entry: "/api/registry/entries/{category}/{slug}",
      entryLlms: "/api/registry/entries/{category}/{slug}/llms",
      directoryIndex: "/data/directory-index.json",
      searchIndex: "/data/search-index.json",
      jobs: JOBS_API_PATH,
      ecosystemFeed: "/data/ecosystem-feed.json",
      mcpRegistryFeed: "/data/mcp-registry-feed.json",
      pluginExportFeed: "/data/plugin-export-feed.json",
      changelogFeed: "/data/registry-changelog.json",
      registryTrust: "/data/registry-trust-report.json",
      qualityMethodology: QUALITY_METHODOLOGY_PATH,
      rssFeed: "/feed.xml",
      atomFeed: "/atom.xml",
      distributionFeedIndex: "/data/feeds/index.json",
      categoryFeed: CATEGORY_FEED_PATH,
      platformFeed: PLATFORM_FEED_PATH,
      contentQuality: "/data/content-quality-report.json",
      raycastFeed: "/data/raycast-index.json",
    },
    contracts: {
      registryEntries:
        "Search results, sharded feeds, and entry details expose factual trustSignals when source/checksum/compatibility data exists.",
      writes:
        "Registry publishing is not exposed through the public API; submissions are routed through PR-first private-gate review only.",
    },
    artifacts: manifest.artifacts,
    artifactContracts: manifest.artifactContracts,
    qualitySummary: manifest.qualitySummary,
    trustSummary: manifest.trustSummary,
    categories,
  });
});

export const Route = createApiFileRoute("/api/registry/feed")({
  server: {
    handlers: {
      GET: async ({ request, params }) => GET(request, { params }),
    },
  },
});
