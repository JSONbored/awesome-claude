/**
 * Pure community signal normalization helpers.
 *
 * Validates target kinds, keys, client IDs, and builds fallback count maps for
 * community "used / works / broken" signals. Nothing here touches the network
 * or D1 — given the same inputs the output is deterministic.
 *
 * The public surface (`community-signals.ts` / `@/lib/community-signals`)
 * re-exports everything below and keeps async D1 query helpers in the wrapper.
 */

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

export function normalizeCommunityTargetKey(value: string | null | undefined): string | null {
  const normalized = (value || "").trim().toLowerCase();
  return /^(entry|tool):[a-z0-9][a-z0-9-]*(\/[a-z0-9][a-z0-9-]*)?$/.test(normalized)
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
    targetKind === "entry" && /^entry:[a-z0-9][a-z0-9-]*\/[a-z0-9][a-z0-9-]*$/.test(targetKey);
  const isToolTarget = targetKind === "tool" && /^tool:[a-z0-9][a-z0-9-]*$/.test(targetKey);

  return isEntryTarget || isToolTarget ? { targetKind, targetKey } : null;
}

export function normalizeCommunityClientId(value: string | null | undefined): string | null {
  const normalized = (value || "").trim();
  return /^[a-zA-Z0-9_-]{16,96}$/.test(normalized) ? normalized : null;
}

export function communitySignalTargetId(target: CommunitySignalTarget) {
  return target.targetKey;
}

export function entryCommunityTarget(category: string, slug: string) {
  return `entry:${category}/${slug}`;
}

export function getFallbackCommunitySignalCounts(targets: CommunitySignalTarget[]) {
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
  return message.includes("no such table: community_signals") || message.includes("SITE_DB");
}
