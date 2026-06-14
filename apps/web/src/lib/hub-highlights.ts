import type { Entry, SourceStatus } from "@/types/registry";
import { TRUST_LABEL, SOURCE_LABEL } from "@/types/registry";
import { timeAgo } from "@/lib/format";

// Data-derived "highlights" for programmatic hub/tag/intersection pages.
//
// Everything here is computed from real registry fields (trust, source, dateAdded,
// safetyNotes, privacyNotes, reviewed, repoStats). Nothing is fabricated: a pick is
// only surfaced when an entry genuinely satisfies the criterion, and each pick carries
// a one-line reason pulled from the entry's own metadata. Pages that share the same
// underlying entries will produce the same facts, but each page renders them under its
// own labels/prose so no two indexable pages emit identical copy.

export type HighlightKind =
  | "trusted"
  | "newest"
  | "documented"
  | "sourced"
  | "popular"
  | "reviewed";

export interface Highlight {
  kind: HighlightKind;
  /** Short human label for the pick, e.g. "Most-trusted pick". */
  label: string;
  /** One-line reason derived from the entry's own fields. */
  reason: string;
  entry: Entry;
}

const SOURCE_RANK: Record<SourceStatus, number> = {
  "first-party": 3,
  "source-backed": 2,
  external: 1,
  unverified: 0,
};

function parseDate(iso: string | undefined): number {
  if (!iso) return 0;
  const t = Date.parse(iso);
  return Number.isNaN(t) ? 0 : t;
}

// Pick the single best entry for a criterion. `score` ranks candidates; only entries
// that pass `eligible` are considered, so we never claim a pick that isn't real.
function pickBest(
  entries: Entry[],
  eligible: (e: Entry) => boolean,
  score: (e: Entry) => number,
): Entry | undefined {
  let best: Entry | undefined;
  let bestScore = -Infinity;
  for (const e of entries) {
    if (!eligible(e)) continue;
    const s = score(e);
    if (s > bestScore) {
      bestScore = s;
      best = e;
    }
  }
  return best;
}

/**
 * Compute up to `limit` distinct, non-overlapping highlight picks for a set of entries.
 * Each pick is a different entry so the strip surfaces breadth, not the same resource
 * four times. Returns [] when there aren't enough entries to be meaningful.
 */
export function hubHighlights(entries: Entry[], limit = 4): Highlight[] {
  if (entries.length < 2) return [];

  const used = new Set<string>();
  const key = (e: Entry) => `${e.category}/${e.slug}`;
  const out: Highlight[] = [];
  const free = (e: Entry | undefined): e is Entry => Boolean(e) && !used.has(key(e!));

  const claim = (
    kind: HighlightKind,
    label: string,
    entry: Entry | undefined,
    reason: (e: Entry) => string,
  ) => {
    if (!entry || used.has(key(entry)) || out.length >= limit) return;
    used.add(key(entry));
    out.push({ kind, label, entry, reason: reason(entry) });
  };

  // Most-trusted pick: highest trust tier, tie-broken by source quality then recency.
  claim(
    "trusted",
    "Most-trusted pick",
    pickBest(
      entries,
      (e) => free(e) && e.trust === "trusted",
      (e) => SOURCE_RANK[e.source] * 1e6 + parseDate(e.dateAdded) / 1e6,
    ),
    (e) =>
      e.source === "unverified"
        ? `${TRUST_LABEL[e.trust]} trust tier in this set.`
        : `${TRUST_LABEL[e.trust]} trust, ${SOURCE_LABEL[e.source].toLowerCase()} source.`,
  );

  // Newest addition: most recent dateAdded.
  claim(
    "newest",
    "Newest addition",
    pickBest(
      entries,
      (e) => free(e) && parseDate(e.dateAdded) > 0,
      (e) => parseDate(e.dateAdded),
    ),
    (e) => `Added to the directory ${timeAgo(e.dateAdded)}.`,
  );

  // Best-documented: carries both safety and privacy notes (and ideally reviewed).
  claim(
    "documented",
    "Safety + privacy documented",
    pickBest(
      entries,
      (e) => free(e) && Boolean(e.safetyNotes) && Boolean(e.privacyNotes),
      (e) => (e.reviewed ? 1 : 0) * 1e6 + parseDate(e.dateAdded) / 1e6,
    ),
    (e) =>
      e.reviewed
        ? "Has safety and privacy notes, maintainer-reviewed."
        : "Has both safety and privacy notes on file.",
  );

  // Best-sourced: strongest provenance not already claimed above.
  claim(
    "sourced",
    "Strongest provenance",
    pickBest(
      entries,
      (e) => free(e) && (e.source === "first-party" || e.source === "source-backed"),
      (e) => SOURCE_RANK[e.source] * 1e6 + parseDate(e.dateAdded) / 1e6,
    ),
    (e) => `${SOURCE_LABEL[e.source]} provenance — links to a verifiable origin.`,
  );

  // Most-starred source repo (provenance signal, not listing popularity).
  claim(
    "popular",
    "Most-starred source repo",
    pickBest(
      entries,
      (e) => free(e) && (e.repoStats?.stars ?? 0) > 0,
      (e) => e.repoStats?.stars ?? 0,
    ),
    (e) => `${(e.repoStats?.stars ?? 0).toLocaleString()} stars on its source repository.`,
  );

  // Maintainer-reviewed fallback so the strip stays useful even for sparse metadata.
  claim(
    "reviewed",
    "Maintainer-reviewed",
    pickBest(
      entries,
      (e) => free(e) && Boolean(e.reviewed),
      (e) => SOURCE_RANK[e.source] * 1e6 + parseDate(e.dateAdded) / 1e6,
    ),
    () => "Metadata eyeballed by a maintainer before listing.",
  );

  return out;
}

export interface HubStat {
  key: string;
  label: string;
  count: number;
  pct: number;
}

/**
 * Count breakdowns for a set of entries — each derived from real fields. Only returns
 * the signals that actually apply (count > 0), so a thin or low-signal set won't render
 * a wall of zeros.
 */
export function hubStats(entries: Entry[]): HubStat[] {
  const total = entries.length;
  if (total === 0) return [];
  const pct = (n: number) => Math.round((n / total) * 100);

  const trusted = entries.filter((e) => e.trust === "trusted").length;
  const sourced = entries.filter((e) => e.source !== "unverified").length;
  const safety = entries.filter((e) => Boolean(e.safetyNotes)).length;
  const privacy = entries.filter((e) => Boolean(e.privacyNotes)).length;
  const reviewed = entries.filter((e) => Boolean(e.reviewed)).length;

  return [
    { key: "trusted", label: "Trusted tier", count: trusted, pct: pct(trusted) },
    { key: "sourced", label: "Source-backed", count: sourced, pct: pct(sourced) },
    { key: "safety", label: "Safety notes", count: safety, pct: pct(safety) },
    { key: "privacy", label: "Privacy notes", count: privacy, pct: pct(privacy) },
    { key: "reviewed", label: "Reviewed", count: reviewed, pct: pct(reviewed) },
  ].filter((s) => s.count > 0);
}

/** Trusted-tier share of a set, derived from real trust fields — used to vary intro copy. */
export function trustPosture(entries: Entry[]): { trusted: number; pct: number } {
  const total = entries.length;
  const trusted = entries.filter((e) => e.trust === "trusted").length;
  return { trusted, pct: total ? Math.round((trusted / total) * 100) : 0 };
}
