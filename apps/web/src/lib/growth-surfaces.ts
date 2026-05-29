import { cache } from "react";

import { ENTRIES } from "@/data/entries";
import { entryCommunityTarget, safeCommunitySignalCounts } from "@/lib/community-signals";
import { buildDiscoverySurfaceLists } from "@/lib/growth-surface-rules";
import { communityDiscoveryScore } from "@/lib/growth-ranking";
import { safeIntentEventCounts } from "@/lib/intent-events";
import { safeVoteCounts } from "@/lib/votes";

type GrowthEntry = (typeof ENTRIES)[number];

function entryKey(entry: GrowthEntry) {
  return `${entry.category}:${entry.slug}`;
}

function signalTarget(entry: GrowthEntry) {
  return entryCommunityTarget(entry.category, entry.slug);
}

export const getGrowthSurfaces = cache(async () => {
  const entries = ENTRIES;
  const entryKeys = entries.map(entryKey);
  const communityTargets = entries.map((entry) => ({
    targetKind: "entry" as const,
    targetKey: signalTarget(entry),
  }));
  const [voteState, communityState, intentState] = await Promise.all([
    safeVoteCounts(entryKeys),
    safeCommunitySignalCounts(communityTargets),
    safeIntentEventCounts(entryKeys),
  ]);
  const surfaces = buildDiscoverySurfaceLists(entries);
  const communityTrending = [...entries]
    .map((entry) => ({
      entry,
      score: communityDiscoveryScore({
        communitySignals: communityState.counts[signalTarget(entry)],
        intentCounts: intentState.counts[entryKey(entry)],
        votes: voteState.counts[entryKey(entry)] ?? 0,
        firstPartyPackage: Boolean(entry.downloadUrl && entry.packageVerified),
        productionVerified: entry.verificationStatus === "production",
      }),
    }))
    .filter((item) => item.score > 0)
    .sort(
      (left, right) =>
        right.score - left.score ||
        String(right.entry.dateAdded).localeCompare(String(left.entry.dateAdded)),
    )
    .slice(0, 12)
    .map((item) => item.entry);

  return {
    ...surfaces,
    communityTrending,
    communitySignals: communityState.counts,
    communitySignalsAvailable: communityState.available,
    voteCounts: voteState.counts,
    votesAvailable: voteState.available,
    intentCounts: intentState.counts,
    intentEventsAvailable: intentState.available,
  };
});
