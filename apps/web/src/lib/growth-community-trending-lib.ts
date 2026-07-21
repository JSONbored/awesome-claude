import type { CommunitySignalCounts } from "@/lib/community-signals";
import { communityDiscoveryScore } from "@/lib/growth-ranking-lib";
import { growthEntryKey, growthSignalTarget } from "@/lib/growth-surfaces-lib";
import type { IntentEventCounts } from "@/lib/intent-events";

type CommunityTrendingEntry = {
  category: string;
  slug: string;
  dateAdded?: string | null;
  downloadUrl?: string | null;
  packageVerified?: boolean;
  verificationStatus?: string;
};

export function buildCommunityTrendingEntries<T extends CommunityTrendingEntry>(
  entries: T[],
  state: {
    communityCounts: Record<string, CommunitySignalCounts | undefined>;
    intentCounts: Record<string, IntentEventCounts | undefined>;
    voteCounts: Record<string, number | undefined>;
  },
  limit = 12,
): T[] {
  return [...entries]
    .map((entry) => ({
      entry,
      score: communityDiscoveryScore({
        communitySignals: state.communityCounts[growthSignalTarget(entry)],
        intentCounts: state.intentCounts[growthEntryKey(entry)],
        votes: state.voteCounts[growthEntryKey(entry)] ?? 0,
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
    .slice(0, limit)
    .map((item) => item.entry);
}
