import type { DirectoryEntry, ToolListing } from "@heyclaude/registry";

import { getDirectoryEntries } from "@/lib/content.server";
import { getTools } from "@/lib/tools";

import {
  seoClusterDefinitions,
  type SeoCluster,
  type SeoClusterDefinition,
  type SeoClusterItem,
} from "@/data/seo-cluster-definitions";

function scoreItem(item: DirectoryEntry | ToolListing, definition: SeoClusterDefinition) {
  const itemTags = new Set((item.tags || []).map((tag) => tag.toLowerCase()));
  const itemKeywords = new Set((item.keywords || []).map((keyword) => keyword.toLowerCase()));
  const tagScore = (definition.tags || []).filter((tag) => itemTags.has(tag.toLowerCase())).length;
  const keywordScore = (definition.keywords || []).filter((keyword) =>
    itemKeywords.has(keyword.toLowerCase()),
  ).length;
  const searchableText = [item.title, item.description, item.cardDescription, item.category]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  const textScore = [...(definition.tags || []), ...(definition.keywords || [])].filter((term) =>
    searchableText.includes(term.toLowerCase()),
  ).length;
  const pickScore = item.disclosure === "heyclaude_pick" ? 2 : 0;
  return tagScore * 3 + keywordScore * 2 + textScore + pickScore;
}

function toClusterItem(item: DirectoryEntry | ToolListing): SeoClusterItem {
  const isTool = item.category === "tools";
  return {
    title: item.title,
    description: item.cardDescription || item.description,
    category: item.category,
    slug: item.slug,
    url: isTool ? `/tools/${item.slug}` : `/entry/${item.category}/${item.slug}`,
    tags: item.tags || [],
    disclosure: item.disclosure,
  };
}

function matchesClusterRequirements(
  item: DirectoryEntry | ToolListing,
  definition: SeoClusterDefinition,
) {
  // Tool listings are editorial/product records, so source and install-trust
  // cluster gates only apply to file-backed directory entries.
  if (
    definition.requireSource &&
    item.category !== "tools" &&
    item.trustSignals?.sourceStatus !== "available"
  ) {
    return false;
  }

  if (definition.requireInstallTrust && item.category !== "tools") {
    const hasInstallSurface = Boolean(
      item.installCommand ||
      item.downloadUrl ||
      item.configSnippet ||
      ("hasConfigSnippet" in item && item.hasConfigSnippet),
    );
    const hasTrustedInstall = item.downloadTrust === "first-party" || item.packageVerified === true;
    if (!hasInstallSurface || !hasTrustedInstall) return false;
  }

  return true;
}

export function getSeoClusterDefinitions() {
  return seoClusterDefinitions;
}

export async function getSeoCluster(slug: string): Promise<SeoCluster | null> {
  const definition = seoClusterDefinitions.find((cluster) => cluster.slug === slug) ?? null;
  if (!definition) return null;

  const [entries, tools] = await Promise.all([getDirectoryEntries(), getTools()]);
  const pool = [...entries.filter((entry) => entry.category !== "tools"), ...tools].filter(
    (item) =>
      definition.categories.includes(item.category) && matchesClusterRequirements(item, definition),
  );

  const items = pool
    .map((item) => ({ item, score: scoreItem(item, definition) }))
    .filter(({ score }) => score > 0 || definition.categories.length === 1)
    .sort((left, right) => {
      if (left.score !== right.score) return right.score - left.score;
      return left.item.title.localeCompare(right.item.title);
    })
    .slice(0, definition.itemLimit)
    .map(({ item }) => toClusterItem(item));

  return {
    ...definition,
    items,
  };
}
