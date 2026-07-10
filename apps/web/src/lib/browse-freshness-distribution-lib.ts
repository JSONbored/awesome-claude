/**
 * Pure browse freshness-distribution helpers.
 *
 * Summarizes how recently the current browse result set was added so users can
 * gauge staleness at a glance: entries are bucketed by age (from `dateAdded`)
 * into fresh / recent / aging / stale, with per-bucket share, a median age, and
 * the oldest entries flagged for re-verification. Time is injected (`nowIso`) so
 * the function stays fully deterministic and unit-testable.
 */

import type { Entry } from "@/types/registry";

export type FreshnessBucketId = "fresh" | "recent" | "aging" | "stale";

export type FreshnessTone = "good" | "watch" | "risk";

export type FreshnessBucket = {
  id: FreshnessBucketId;
  label: string;
  rangeLabel: string;
  count: number;
  percent: number;
  tone: FreshnessTone;
};

export type FreshnessStaleFlag = {
  entryRef: string;
  title: string;
  ageDays: number;
  verified: boolean;
};

export type BrowseFreshnessDistributionState = {
  showPanel: boolean;
  heading: string;
  summary: string;
  scannedCount: number;
  freshCount: number;
  staleCount: number;
  medianAgeDays: number;
  buckets: FreshnessBucket[];
  staleEntries: FreshnessStaleFlag[];
};

const DAY_MS = 24 * 60 * 60 * 1000;

const BUCKET_META: Record<
  FreshnessBucketId,
  { label: string; rangeLabel: string; tone: FreshnessTone }
> = {
  fresh: { label: "Fresh", rangeLabel: "≤ 30 days", tone: "good" },
  recent: { label: "Recent", rangeLabel: "31–90 days", tone: "good" },
  aging: { label: "Aging", rangeLabel: "91–180 days", tone: "watch" },
  stale: { label: "Stale", rangeLabel: "> 180 days", tone: "risk" },
};

const BUCKET_ORDER: FreshnessBucketId[] = ["fresh", "recent", "aging", "stale"];

/** Whole days between `dateAdded` and `nowIso`; 0 for future or unparseable dates. */
export function entryAgeDays(dateAdded: string, nowIso: string): number {
  const added = Date.parse(dateAdded);
  const now = Date.parse(nowIso);
  if (Number.isNaN(added) || Number.isNaN(now)) {
    return 0;
  }
  const diff = Math.floor((now - added) / DAY_MS);
  return diff < 0 ? 0 : diff;
}

/** Map an age in days to a freshness bucket. */
export function freshnessBucketId(ageDays: number): FreshnessBucketId {
  if (ageDays <= 30) return "fresh";
  if (ageDays <= 90) return "recent";
  if (ageDays <= 180) return "aging";
  return "stale";
}

function medianOf(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return Math.round((sorted[mid - 1]! + sorted[mid]!) / 2);
  }
  return sorted[mid]!;
}

function entryRef(entry: Entry): string {
  return `${entry.category}/${entry.slug}`;
}

function summarize(
  scannedCount: number,
  freshCount: number,
  staleAgingCount: number,
  medianAgeDays: number,
): { heading: string; summary: string } {
  if (scannedCount === 0) {
    return {
      heading: "Add filters to inspect freshness",
      summary: "Freshness distribution appears once browse results are available.",
    };
  }
  const staleShare = Math.round((staleAgingCount / scannedCount) * 100);
  if (staleAgingCount === 0) {
    return {
      heading: "Current results are broadly fresh",
      summary: `Median age ${medianAgeDays} days; all ${scannedCount} scanned entries are within 90 days.`,
    };
  }
  if (staleShare >= 40) {
    return {
      heading: `${staleShare}% of this view is aging or stale`,
      summary: `Median age ${medianAgeDays} days; ${freshCount} fresh of ${scannedCount} scanned. Re-verify the oldest entries.`,
    };
  }
  return {
    heading: "Mostly fresh with a few aging entries",
    summary: `Median age ${medianAgeDays} days; ${freshCount} fresh, ${staleAgingCount} aging or stale of ${scannedCount} scanned.`,
  };
}

/**
 * Build the freshness-distribution state for the current browse results.
 * `nowIso` is the reference "now" (ISO string); `scannedCount` caps how many of
 * the top results are summarized.
 */
export function browseFreshnessDistributionState(
  entries: Entry[],
  nowIso: string,
  scannedCount = 12,
): BrowseFreshnessDistributionState {
  const scoped = entries.slice(0, scannedCount).map((entry) => {
    const ageDays = entryAgeDays(entry.dateAdded, nowIso);
    return { entry, ageDays, bucket: freshnessBucketId(ageDays) };
  });

  const counts: Record<FreshnessBucketId, number> = {
    fresh: 0,
    recent: 0,
    aging: 0,
    stale: 0,
  };
  for (const item of scoped) {
    counts[item.bucket] += 1;
  }

  const buckets: FreshnessBucket[] = BUCKET_ORDER.map((id) => {
    const count = counts[id];
    const percent = scoped.length === 0 ? 0 : Math.round((count / scoped.length) * 100);
    return {
      id,
      label: BUCKET_META[id].label,
      rangeLabel: BUCKET_META[id].rangeLabel,
      count,
      percent,
      tone: BUCKET_META[id].tone,
    };
  });

  const freshCount = counts.fresh + counts.recent;
  const staleCount = counts.stale;
  const staleAgingCount = counts.aging + counts.stale;
  const medianAgeDays = medianOf(scoped.map((item) => item.ageDays));

  const staleEntries: FreshnessStaleFlag[] = scoped
    .filter((item) => item.bucket === "aging" || item.bucket === "stale")
    .sort((a, b) => b.ageDays - a.ageDays)
    .slice(0, 5)
    .map((item) => ({
      entryRef: entryRef(item.entry),
      title: item.entry.title,
      ageDays: item.ageDays,
      verified: Boolean(item.entry.verifiedAt),
    }));

  const summary = summarize(scoped.length, freshCount, staleAgingCount, medianAgeDays);

  return {
    showPanel: scoped.length >= 2,
    heading: summary.heading,
    summary: summary.summary,
    scannedCount: scoped.length,
    freshCount,
    staleCount,
    medianAgeDays,
    buckets,
    staleEntries,
  };
}
