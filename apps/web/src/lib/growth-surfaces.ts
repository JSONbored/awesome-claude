import { cache } from "react";

import { ENTRIES } from "@/data/entries";
import { safeCommunitySignalCounts } from "@/lib/community-signals";
import { buildDiscoverySurfaceLists } from "@/lib/growth-surface-rules";
import { buildCommunityTrendingEntries } from "@/lib/growth-community-trending-lib";
import { growthEntryKey, growthSignalTarget } from "@/lib/growth-surfaces-lib";
import { safeIntentEventCounts } from "@/lib/intent-events";
import { safeVoteCounts } from "@/lib/votes";

export const getGrowthSurfaces = cache(async () => {
  const entries = ENTRIES;
  const entryKeys = entries.map(growthEntryKey);
  const communityTargets = entries.map((entry) => ({
    targetKind: "entry" as const,
    targetKey: growthSignalTarget(entry),
  }));
  const [voteState, communityState, intentState] = await Promise.all([
    safeVoteCounts(entryKeys),
    safeCommunitySignalCounts(communityTargets),
    safeIntentEventCounts(entryKeys),
  ]);
  const surfaces = buildDiscoverySurfaceLists(entries);
  const communityTrending = buildCommunityTrendingEntries(entries, {
    communityCounts: communityState.counts,
    intentCounts: intentState.counts,
    voteCounts: voteState.counts,
  });

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
