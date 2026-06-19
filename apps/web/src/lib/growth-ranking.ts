import type { CommunitySignalCounts } from "@/lib/community-signals";
import type { IntentEventCounts } from "@/lib/intent-events";

/**
 * Shape of the entry fields consumed by `metadataCompletenessScore`.
 * Defined as a structural interface so both `Entry` (registry) and
 * `DirectoryEntry` (server) satisfy it without an explicit cast.
 */
export interface MetadataEntry {
  safetyNotes?: string | null;
  privacyNotes?: string | null;
  prerequisites?: string[] | null;
  platforms?: string[] | null;
  tags?: string[] | null;
  sourceUrl?: string | null;
  repoUrl?: string | null;
  docsUrl?: string | null;
  cardDescription?: string | null;
  author?: string | null;
  reviewed?: boolean | null;
  claimed?: boolean | null;
}

/**
 * Score an entry's metadata completeness on a 0–100 scale. Higher is better.
 * The weights reflect how much each field improves search quality and trust
 * signals for visitors, matching the editorial priorities in the quality
 * dashboard:
 *
 *  - Safety / privacy notes  (+20 each) — highest signal for risk-bearing tools
 *  - Source / repo URL        (+15)      — provenance linkage
 *  - Platforms                (+10)      — findability by platform filter
 *  - Tags                     (+10)      — findability by tag/keyword search
 *  - Card description         (+10)      — browse-card UX
 *  - Docs URL                 (+5)       — discoverability bonus
 *  - Author                   (+5)       — attribution completeness
 *  - Prerequisites            (+5)       — setup-time transparency
 *  - Reviewed / claimed       (+2.5 ea)  — editorial quality signal
 *
 * The maximum is 100 (all fields present). The score never goes below 0 or
 * above 100 regardless of field values.
 */
export function metadataCompletenessScore(entry: MetadataEntry): number {
  let score = 0;
  if (entry.safetyNotes) score += 20;
  if (entry.privacyNotes) score += 20;
  if (entry.sourceUrl || entry.repoUrl) score += 15;
  if (entry.platforms?.length) score += 10;
  if (entry.tags?.length) score += 10;
  if (entry.cardDescription) score += 10;
  if (entry.docsUrl) score += 5;
  if (entry.author) score += 5;
  if (entry.prerequisites?.length) score += 5;
  if (entry.reviewed) score += 2.5;
  if (entry.claimed) score += 2.5;
  return Math.min(100, Math.max(0, score));
}

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
