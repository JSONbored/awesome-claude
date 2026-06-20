import type { CommunitySignalCounts } from "@/lib/community-signals";
import type { IntentEventCounts } from "@/lib/intent-events";

export function totalIntentCount(counts: IntentEventCounts | undefined) {
  if (!counts) return 0;
  return counts.copy + counts.open + counts.install * 3 + counts.download * 2 + counts.vote;
}

export function communityDiscoveryScore(params: {
  communitySignals?: CommunitySignalCounts;
  intentCounts?: IntentEventCounts;
  votes?: number;
  firstPartyPackage?: boolean;
  productionVerified?: boolean;
}) {
  // Public engagement counters are unauthenticated and caller-controlled. Keep
  // them available for non-ranking display/telemetry, but do not let them
  // promote or suppress entries in machine-readable discovery surfaces.
  return (params.firstPartyPackage ? 2 : 0) + (params.productionVerified ? 2 : 0);
}
