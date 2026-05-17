import "server-only";

import { cache } from "react";

import { getDirectoryEntries } from "@/lib/content";
import {
  entryCommunityTarget,
  safeCommunitySignalCounts,
} from "@/lib/community-signals";
import { communityDiscoveryScore } from "@/lib/growth-ranking";
import { safeIntentEventCounts } from "@/lib/intent-events";
import { safeVoteCounts } from "@/lib/votes";

type GrowthEntry = Awaited<ReturnType<typeof getDirectoryEntries>>[number];

function entryKey(entry: GrowthEntry) {
  return `${entry.category}:${entry.slug}`;
}

function signalTarget(entry: GrowthEntry) {
  return entryCommunityTarget(entry.category, entry.slug);
}

export const getGrowthSurfaces = cache(async () => {
  const entries = await getDirectoryEntries();
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
  const newest = [...entries]
    .filter((entry) => entry.dateAdded)
    .sort((left, right) =>
      String(right.dateAdded).localeCompare(String(left.dateAdded)),
    )
    .slice(0, 12);
  const recentlyUpdated = [...entries]
    .filter((entry) => entry.repoUpdatedAt)
    .sort((left, right) =>
      String(right.repoUpdatedAt).localeCompare(String(left.repoUpdatedAt)),
    )
    .slice(0, 12);
  const popularBySourceSignals = [...entries]
    .filter(
      (entry) => typeof entry.githubStars === "number" && entry.githubStars > 0,
    )
    .sort((left, right) => (right.githubStars ?? 0) - (left.githubStars ?? 0))
    .slice(0, 12);
  const practicalPicks = [...entries]
    .filter(
      (entry) =>
        Boolean(
          entry.installCommand || entry.downloadUrl || entry.configSnippet,
        ) && Boolean(entry.dateAdded),
    )
    .sort((left, right) => {
      const rightScore =
        (right.githubStars ?? 0) +
        (right.downloadTrust === "first-party" ? 25 : 0) +
        (right.verificationStatus === "production" ? 20 : 0);
      const leftScore =
        (left.githubStars ?? 0) +
        (left.downloadTrust === "first-party" ? 25 : 0) +
        (left.verificationStatus === "production" ? 20 : 0);
      if (rightScore !== leftScore) return rightScore - leftScore;
      return String(right.dateAdded).localeCompare(String(left.dateAdded));
    })
    .slice(0, 12);
  const communityTrending = [...entries]
    .map((entry) => ({
      entry,
      score: communityDiscoveryScore({
        communitySignals: communityState.counts[signalTarget(entry)],
        intentCounts: intentState.counts[entryKey(entry)],
        votes: voteState.counts[entryKey(entry)] ?? 0,
        firstPartyPackage: entry.downloadTrust === "first-party",
        productionVerified: entry.verificationStatus === "production",
      }),
    }))
    .filter((item) => item.score > 0)
    .sort(
      (left, right) =>
        right.score - left.score ||
        String(right.entry.dateAdded).localeCompare(
          String(left.entry.dateAdded),
        ),
    )
    .slice(0, 12)
    .map((item) => item.entry);

  return {
    newest,
    recentlyUpdated,
    popularBySourceSignals,
    practicalPicks,
    communityTrending,
    communitySignals: communityState.counts,
    communitySignalsAvailable: communityState.available,
    voteCounts: voteState.counts,
    votesAvailable: voteState.available,
    intentCounts: intentState.counts,
    intentEventsAvailable: intentState.available,
  };
});
