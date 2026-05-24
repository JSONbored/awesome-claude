import { getSiteDb, type D1DatabaseLike } from "@/lib/db";

export const COMMUNITY_SIGNAL_TYPES = ["used", "works", "broken"] as const;
export const COMMUNITY_TARGET_KINDS = ["entry", "tool"] as const;
export const ZERO_COMMUNITY_SIGNAL_COUNTS = {
  used: 0,
  works: 0,
  broken: 0,
};

export type CommunitySignalType = (typeof COMMUNITY_SIGNAL_TYPES)[number];
export type CommunityTargetKind = (typeof COMMUNITY_TARGET_KINDS)[number];
export type CommunitySignalCounts = Record<CommunitySignalType, number>;
export type CommunitySignalTarget = {
  targetKind: CommunityTargetKind;
  targetKey: string;
};

type SignalRow = {
  target_kind: CommunityTargetKind;
  target_key: string;
  signal_type: CommunitySignalType;
  count: number;
};

const D1_SAFE_TARGET_BATCH_SIZE = 25;

export function normalizeCommunityTargetKind(
  value: string | null | undefined,
): CommunityTargetKind | null {
  return value && (COMMUNITY_TARGET_KINDS as readonly string[]).includes(value)
    ? (value as CommunityTargetKind)
    : null;
}

export function normalizeCommunitySignalType(
  value: string | null | undefined,
): CommunitySignalType | null {
  return value && (COMMUNITY_SIGNAL_TYPES as readonly string[]).includes(value)
    ? (value as CommunitySignalType)
    : null;
}

export function normalizeCommunityTargetKey(
  value: string | null | undefined,
): string | null {
  const normalized = (value || "").trim().toLowerCase();
  return /^(entry|tool):[a-z0-9][a-z0-9-]*(\/[a-z0-9][a-z0-9-]*)?$/.test(
    normalized,
  )
    ? normalized
    : null;
}

export function normalizeCommunitySignalTarget(
  targetKindValue: string | null | undefined,
  targetKeyValue: string | null | undefined,
): CommunitySignalTarget | null {
  const targetKind = normalizeCommunityTargetKind(targetKindValue);
  const targetKey = normalizeCommunityTargetKey(targetKeyValue);
  if (!targetKind || !targetKey) return null;

  const isEntryTarget =
    targetKind === "entry" &&
    /^entry:[a-z0-9][a-z0-9-]*\/[a-z0-9][a-z0-9-]*$/.test(targetKey);
  const isToolTarget =
    targetKind === "tool" && /^tool:[a-z0-9][a-z0-9-]*$/.test(targetKey);

  return isEntryTarget || isToolTarget ? { targetKind, targetKey } : null;
}

export function normalizeCommunityClientId(
  value: string | null | undefined,
): string | null {
  const normalized = (value || "").trim();
  return /^[a-zA-Z0-9_-]{16,96}$/.test(normalized) ? normalized : null;
}

export function communitySignalTargetId(target: CommunitySignalTarget) {
  return target.targetKey;
}

export function entryCommunityTarget(category: string, slug: string) {
  return `entry:${category}/${slug}`;
}

export function getFallbackCommunitySignalCounts(
  targets: CommunitySignalTarget[],
) {
  const counts: Record<string, CommunitySignalCounts> = {};
  for (const target of targets) {
    counts[communitySignalTargetId(target)] = {
      ...ZERO_COMMUNITY_SIGNAL_COUNTS,
    };
  }
  return counts;
}

export function isExpectedUnavailableCommunitySignalError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error ?? "");
  return (
    message.includes("no such table: community_signals") ||
    message.includes("SITE_DB")
  );
}

export async function queryCommunitySignalCounts(
  db: D1DatabaseLike,
  targets: CommunitySignalTarget[],
) {
  const uniqueTargets = [
    ...new Map(
      targets.map((target) => [communitySignalTargetId(target), target]),
    ).values(),
  ];
  const counts = getFallbackCommunitySignalCounts(uniqueTargets);
  if (!uniqueTargets.length) return counts;

  for (
    let index = 0;
    index < uniqueTargets.length;
    index += D1_SAFE_TARGET_BATCH_SIZE
  ) {
    const batch = uniqueTargets.slice(index, index + D1_SAFE_TARGET_BATCH_SIZE);
    const where = batch.map(() => "(target_kind = ? AND target_key = ?)");
    const values = batch.flatMap((target) => [
      target.targetKind,
      target.targetKey,
    ]);
    const { results } = await db
      .prepare(
        `SELECT target_kind, target_key, signal_type, COUNT(*) AS count
         FROM community_signals
         WHERE ${where.join(" OR ")}
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

export async function safeCommunitySignalCounts(
  targets: CommunitySignalTarget[],
) {
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
