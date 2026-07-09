import { createApiFileRoute } from "@/lib/api/file-route";

import { ENTRIES } from "@/data/entries";
import { registryTrendingQuerySchema } from "@/lib/api/contracts";
import { createApiHandler, type InferApiQuery } from "@/lib/api/router";
import { entryCommunityTarget, safeCommunitySignalCounts } from "@/lib/community-signals";
import { communityDiscoveryScore } from "@/lib/growth-ranking";
import { cachedJsonResponse } from "@/lib/http-cache";
import { safeIntentEventCounts } from "@/lib/intent-events";
import {
  entryCanonicalUrl,
  entrySourceStatus,
  isFirstPartyPackage,
} from "@/lib/registry-trending-entry-lib";
import { entryPlatforms, matchesPlatform } from "@/lib/registry-trending-platform-lib";
import { safeVoteCounts } from "@/lib/votes";

type Entry = (typeof ENTRIES)[number];

const entryKey = (entry: Entry) => `${entry.category}:${entry.slug}`;
const communityTarget = (entry: Entry) => entryCommunityTarget(entry.category, entry.slug);

const reasonCodes = (input: ReturnType<typeof trendInput>) =>
  [
    input.firstPartyPackage ? "first_party_package" : "",
    input.productionVerified ? "production_verified" : "",
  ].filter(Boolean);

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
