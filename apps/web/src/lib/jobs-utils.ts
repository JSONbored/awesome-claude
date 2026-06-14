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
  const j = (i + 1) % pool.length;
  return { current: pool[i] ?? null, next: pool[j] ?? null };
}
