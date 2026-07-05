/**
 * Community signals surface.
 *
 * Pure normalization helpers live in `community-signals-lib.ts`. This module
 * re-exports that surface and keeps async D1 query helpers here so existing
 * `@/lib/community-signals` imports stay unchanged.
 */
export type {
  CommunitySignalCounts,
  CommunitySignalTarget,
  CommunitySignalType,
  CommunityTargetKind,
} from "@/lib/community-signals-lib";
export {
  COMMUNITY_SIGNAL_TYPES,
  COMMUNITY_TARGET_KINDS,
  ZERO_COMMUNITY_SIGNAL_COUNTS,
  communitySignalTargetId,
  entryCommunityTarget,
  getFallbackCommunitySignalCounts,
  isExpectedUnavailableCommunitySignalError,
  normalizeCommunityClientId,
  normalizeCommunitySignalTarget,
  normalizeCommunitySignalType,
  normalizeCommunityTargetKey,
  normalizeCommunityTargetKind,
} from "@/lib/community-signals-lib";

import { getSiteDb, type D1DatabaseLike } from "@/lib/db";
import { chunk, targetPairConditions } from "@/lib/d1-batch";
import {
  COMMUNITY_SIGNAL_TYPES,
  ZERO_COMMUNITY_SIGNAL_COUNTS,
  type CommunitySignalTarget,
  type CommunitySignalType,
  type CommunityTargetKind,
  communitySignalTargetId,
  getFallbackCommunitySignalCounts,
  isExpectedUnavailableCommunitySignalError,
} from "@/lib/community-signals-lib";

type SignalRow = {
  target_kind: CommunityTargetKind;
  target_key: string;
  signal_type: CommunitySignalType;
  count: number;
};

export async function queryCommunitySignalCounts(
  db: D1DatabaseLike,
  targets: CommunitySignalTarget[],
) {
  const uniqueTargets = [
    ...new Map(targets.map((target) => [communitySignalTargetId(target), target])).values(),
  ];
  const counts = getFallbackCommunitySignalCounts(uniqueTargets);
  if (!uniqueTargets.length) return counts;

  for (const batch of chunk(uniqueTargets)) {
    const where = targetPairConditions(batch.length, "target_kind", "target_key");
    const values = batch.flatMap((target) => [target.targetKind, target.targetKey]);
    const { results } = await db
      .prepare(
        `SELECT target_kind, target_key, signal_type, COUNT(*) AS count
         FROM community_signals
         WHERE ${where}
         GROUP BY target_kind, target_key, signal_type`,
      )
      .bind(...values)
      .all<SignalRow>();

    for (const row of results || []) {
      if (!COMMUNITY_SIGNAL_TYPES.includes(row.signal_type)) continue;
      const key = row.target_key;
      counts[key] = counts[key] || { ...ZERO_COMMUNITY_SIGNAL_COUNTS };
      counts[key][row.signal_type] = Number(row.count) || 0;
    }
  }

  return counts;
}

export async function safeCommunitySignalCounts(targets: CommunitySignalTarget[]) {
  try {
    const db = getSiteDb();
    if (!db) {
      return {
        available: false,
        counts: getFallbackCommunitySignalCounts(targets),
      };
    }
    return {
      available: true,
      counts: await queryCommunitySignalCounts(db, targets),
    };
  } catch (error) {
    if (!isExpectedUnavailableCommunitySignalError(error)) {
      console.warn("[community-signals] failed to read counts", error);
    }
    return {
      available: false,
      counts: getFallbackCommunitySignalCounts(targets),
    };
  }
}
