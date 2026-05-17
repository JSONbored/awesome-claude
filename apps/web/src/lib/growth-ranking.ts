import type { CommunitySignalCounts } from "@/lib/community-signals";
import type { IntentEventCounts } from "@/lib/intent-events";

export function totalIntentCount(counts: IntentEventCounts | undefined) {
  if (!counts) return 0;
  return (
    counts.copy +
    counts.open +
    counts.install * 3 +
    counts.download * 2 +
    counts.vote
  );
}

export function communityDiscoveryScore(params: {
  communitySignals?: CommunitySignalCounts;
  intentCounts?: IntentEventCounts;
  votes?: number;
  firstPartyPackage?: boolean;
  productionVerified?: boolean;
}) {
  const signals = params.communitySignals;
  return (
    (params.votes ?? 0) * 4 +
    (signals?.used ?? 0) * 3 +
    (signals?.works ?? 0) * 5 -
    (signals?.broken ?? 0) * 5 +
    totalIntentCount(params.intentCounts) +
    (params.firstPartyPackage ? 2 : 0) +
    (params.productionVerified ? 2 : 0)
  );
}
