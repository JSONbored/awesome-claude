/**
 * Pure jobs-board helpers.
 *
 * Presentation and ranking math for the jobs surface — company monograms and
 * tints, relative "posted" labels, tier sorting, and the deterministic daily
 * spotlight rotation. Nothing here touches the network or the clock beyond an
 * injectable `now`, so given the same inputs the output is deterministic.
 *
 * The public surface (`jobs-utils.ts` / `@/lib/jobs-utils`) re-exports
 * everything below so existing imports stay unchanged.
 */

import type { JobListing } from "@/types/registry";

export function monogram(company: string): string {
  return company
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

// Deterministic soft tint per company (hash → hue)
export function companyTint(company: string): { bg: string; fg: string } {
  let h = 0;
  for (let i = 0; i < company.length; i++) h = (h * 31 + company.charCodeAt(i)) | 0;
  const hue = Math.abs(h) % 360;
  return {
    bg: `oklch(0.94 0.04 ${hue})`,
    fg: `oklch(0.32 0.08 ${hue})`,
  };
}

const DAY = 86_400_000;
export function daysSince(iso: string, now = Date.now()): number {
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return Infinity;
  return Math.floor((now - t) / DAY);
}

export function relativePosted(iso: string, now = Date.now()): string {
  const d = daysSince(iso, now);
  if (!Number.isFinite(d)) return "—";
  if (d <= 0) return "today";
  if (d === 1) return "1d ago";
  if (d < 7) return `${d}d ago`;
  if (d < 30) return `${Math.floor(d / 7)}w ago`;
  if (d < 365) return `${Math.floor(d / 30)}mo ago`;
  return `${Math.floor(d / 365)}y ago`;
}

export function isFresh(iso: string, now = Date.now()): boolean {
  return daysSince(iso, now) <= 7;
}

/** Thousands multiplier for a trailing `k`/`K` compensation shorthand (e.g. `$210k`). */
const COMPENSATION_K_MULTIPLIER = 1000;
/** Millions multiplier for a trailing `m`/`M` or `million` compensation shorthand. */
const COMPENSATION_M_MULTIPLIER = 1_000_000;

/**
 * Real-dollar sort value for a free-text compensation string, so mixed-format
 * listings compare on one scale: `"$210k"` and `"$210,000"` both yield `210000`,
 * while `"$1.2M"` yields `1200000`.
 *
 * Ranges sort by their leading figure only (e.g. `"$100k-$150k"` → `100000`) —
 * a deliberate pre-existing limitation of the salary sort, preserved here.
 *
 * Missing / empty compensation sorts last (`-1`); an unparseable string stays at `0`.
 */
export function compensationSortValue(compensation?: string | null): number {
  if (!compensation) return -1;
  const match = compensation.match(/\$?(?:(\d[\d,]*(?:\.\d+)?)\s*(million|m)\b|(\d[\d,]*)(k)?)/i);
  if (!match) return 0;

  const base = Number.parseFloat((match[1] ?? match[3]).replace(/,/g, ""));
  const suffix = (match[2] ?? match[4])?.toLowerCase();
  if (suffix === "k") return base * COMPENSATION_K_MULTIPLIER;
  if (suffix === "m" || suffix === "million") {
    return base * COMPENSATION_M_MULTIPLIER;
  }
  return base;
}

export function sortJobs(jobs: JobListing[]): JobListing[] {
  const order: Record<JobListing["tier"], number> = {
    sponsored: 0,
    featured: 1,
    standard: 2,
    free: 3,
  };
  return [...jobs].sort((a, b) => {
    if (order[a.tier] !== order[b.tier]) return order[a.tier] - order[b.tier];
    return b.postedAt.localeCompare(a.postedAt);
  });
}

// Score for "in the spotlight" rotation. Rewards verified employer,
// disclosed compensation, remote-friendly, and freshness.
function spotlightScore(job: JobListing, now = Date.now()): number {
  let s = 0;
  if (job.lastVerifiedAt) s += 3;
  if (job.compensation) s += 2;
  if (job.isRemote) s += 1;
  if (isFresh(job.postedAt, now)) s += 2;
  if (job.tier === "sponsored") s += 1;
  return s;
}

// Deterministic per-day rotation through a high-signal pool.
// Same day → same pick; next day → next role. No randomness, no flicker.
export function pickDailySpotlight(
  jobs: JobListing[],
  now = Date.now(),
): { current: JobListing | null; next: JobListing | null } {
  const pool = jobs
    .filter((j) => spotlightScore(j, now) >= 4)
    .sort((a, b) => {
      const diff = spotlightScore(b, now) - spotlightScore(a, now);
      if (diff !== 0) return diff;
      return a.slug.localeCompare(b.slug);
    });
  if (pool.length === 0) return { current: null, next: null };
  const dayIndex = Math.floor(now / DAY);
  const i = ((dayIndex % pool.length) + pool.length) % pool.length;
  const current = pool[i] ?? null;
  // With a single-job pool, `(i + 1) % 1 === i` would alias `next` to `current`
  // (the jobs page would show the same job as both spotlighted and "up next").
  // There is nothing else to rotate to, so there is no "up next" job.
  const next = pool.length > 1 ? (pool[(i + 1) % pool.length] ?? null) : null;
  return { current, next };
}
