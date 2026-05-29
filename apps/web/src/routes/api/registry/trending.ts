import { createApiFileRoute } from "@/lib/api/file-route";

import { ENTRIES } from "@/data/entries";
import { registryTrendingQuerySchema } from "@/lib/api/contracts";
import { createApiHandler, type InferApiQuery } from "@/lib/api/router";
import { entryCommunityTarget, safeCommunitySignalCounts } from "@/lib/community-signals";
import { communityDiscoveryScore, totalIntentCount } from "@/lib/growth-ranking";
import { cachedJsonResponse } from "@/lib/http-cache";
import { safeIntentEventCounts } from "@/lib/intent-events";
import { safeVoteCounts } from "@/lib/votes";

type Entry = (typeof ENTRIES)[number];
type LegacyGeneratedFields = {
  canonicalUrl?: unknown;
  downloadTrust?: unknown;
  trustSignals?: { sourceStatus?: unknown };
};

const entryKey = (entry: Entry) => `${entry.category}:${entry.slug}`;
const communityTarget = (entry: Entry) => entryCommunityTarget(entry.category, entry.slug);
const normalizePlatform = (value: string) => value.trim().toLowerCase();
const platformAliases = (value: string) => {
  const platform = normalizePlatform(value);
  if (!platform) return [];
  if (platform === "claude") return ["claude", "claude-code", "claude-desktop"];
  if (platform === "vs code") return ["vscode"];
  return [platform];
};
const entryPlatforms = (entry: Entry) => {
  const values = new Set<string>();
  for (const platform of entry.platforms ?? []) values.add(normalizePlatform(platform));
  for (const item of entry.platformCompatibility ?? [])
    values.add(normalizePlatform(item.platform));
  return [...values];
};
const matchesPlatform = (entry: Entry, value: string) => {
  const platforms = platformAliases(value);
  if (!platforms.length) return true;
  const supported = entryPlatforms(entry);
  return platforms.some((platform) => supported.includes(platform));
};

const reasonCodes = (input: ReturnType<typeof trendInput>) =>
  [
    input.votes ? "upvotes" : "",
    input.communitySignals?.used ? "community_used" : "",
    input.communitySignals?.works ? "community_works" : "",
    totalIntentCount(input.intentCounts) ? "recent_intent" : "",
    input.firstPartyPackage ? "first_party_package" : "",
    input.productionVerified ? "production_verified" : "",
  ].filter(Boolean);

function entryCanonicalUrl(entry: Entry) {
  const embedded = (entry as LegacyGeneratedFields).canonicalUrl;
  return typeof embedded === "string" && embedded.trim()
    ? embedded
    : `https://heyclau.de/entry/${entry.category}/${entry.slug}`;
}

function entrySourceStatus(entry: Entry) {
  const embedded = (entry as LegacyGeneratedFields).trustSignals?.sourceStatus;
  if (typeof embedded === "string" && embedded.trim()) return embedded;
  return entry.source === "unverified" ? "missing" : "available";
}

function isFirstPartyPackage(entry: Entry) {
  const legacyTrust = (entry as LegacyGeneratedFields).downloadTrust;
  return legacyTrust === "first-party" || Boolean(entry.downloadUrl && entry.packageVerified);
}

function trendInput(entry: Entry, states: Awaited<ReturnType<typeof readStates>>) {
  return {
    communitySignals: states.community.counts[communityTarget(entry)],
    intentCounts: states.intent.counts[entryKey(entry)],
    votes: states.votes.counts[entryKey(entry)] ?? 0,
    firstPartyPackage: isFirstPartyPackage(entry),
    productionVerified: entry.verificationStatus === "production",
  };
}

async function readStates(entries: Entry[]) {
  const keys = entries.map(entryKey);
  const [votes, community, intent] = await Promise.all([
    safeVoteCounts(keys),
    safeCommunitySignalCounts(
      entries.map((entry) => ({ targetKind: "entry" as const, targetKey: communityTarget(entry) })),
    ),
    safeIntentEventCounts(keys),
  ]);
  return { votes, community, intent };
}

export const GET = createApiHandler("registry.trending", async ({ request, query: parsed }) => {
  const { category, platform, limit } = parsed as InferApiQuery<typeof registryTrendingQuerySchema>;
  const entries = ENTRIES;
  const scopedEntries = entries.filter(
    (entry) => (!category || entry.category === category) && matchesPlatform(entry, platform),
  );
  const states = await readStates(scopedEntries);
  const ranked = scopedEntries
    .map((entry) => {
      const input = trendInput(entry, states);
      return { entry, score: communityDiscoveryScore(input), reasons: reasonCodes(input) };
    })
    .filter((item) => item.score > 0)
    .sort(
      (left, right) =>
        right.score - left.score ||
        String(right.entry.dateAdded).localeCompare(String(left.entry.dateAdded)) ||
        String(left.entry.title).localeCompare(String(right.entry.title)),
    )
    .slice(0, limit)
    .map(({ entry, score, reasons }) => ({
      category: entry.category,
      slug: entry.slug,
      title: entry.title,
      description: entry.description,
      canonicalUrl: entryCanonicalUrl(entry),
      platforms: entryPlatforms(entry),
      tags: entry.tags ?? [],
      dateAdded: entry.dateAdded,
      score,
      reasons,
      trustSignals: { sourceStatus: entrySourceStatus(entry) },
    }));

  return cachedJsonResponse(
    request,
    {
      schemaVersion: 1,
      kind: "registry-trending",
      category: category || "all",
      platform: platform || "all",
      limit,
      count: ranked.length,
      signalsAvailable: {
        votes: states.votes.available,
        community: states.community.available,
        intent: states.intent.available,
      },
      entries: ranked,
    },
    { headers: { "cache-control": "public, max-age=60, stale-while-revalidate=300" } },
  );
});

export const Route = createApiFileRoute("/api/registry/trending")({
  server: {
    handlers: {
      GET: async ({ request, params }) => GET(request, { params }),
    },
  },
});
