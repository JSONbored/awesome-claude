// Pure helpers behind the Gittensor impact card: number formatting, XML escaping
// for SVG text, and the weekly bucketing of merged PRs. Split out of
// scripts/gittensor-impact-card.mjs so they can be unit-tested without network
// access or SVG rendering. Deterministic: bucketWeekly takes `now` as an input.

/** Number of weekly buckets the card's sparklines cover. */
export const WEEKS = 12;

/** Compact number formatting for the card's stat values (1.2M / 34k / 900). */
export function compact(n) {
  // Use the millions branch once the value would round to 1000k: n >= 999_500
  // rounds to "1.0M". Without this, 999_500..999_999 rendered "1000k" because
  // (n / 1000).toFixed(0) carried past the thousands magnitude.
  if (n >= 999_500) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(0) + "k";
  return String(n);
}

/**
 * Escape XML special chars. api.gittensor.io values (and the repo name) end up
 * as SVG <text> content, so escape rather than trust they're clean.
 */
export function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

/**
 * Bucket merged PRs into the WEEKS weeks ending at `now`.
 *
 * Returns per-bucket PR counts, lines-changed totals, and the *cumulative*
 * distinct-contributor count (a contributor seen in an earlier week still
 * counts in later weeks). PRs outside the window, or with an unparseable
 * mergedAt, are ignored.
 */
export function bucketWeekly(prs, now) {
  const weekMs = 7 * 24 * 60 * 60 * 1000;
  const bucketStart = new Date(now.getTime() - WEEKS * weekMs);
  const prBuckets = Array(WEEKS).fill(0);
  const locBuckets = Array(WEEKS).fill(0);
  const seenByBucket = Array.from({ length: WEEKS }, () => new Set());
  const contributorBuckets = Array(WEEKS).fill(0);

  for (const pr of prs) {
    const t = new Date(pr.mergedAt);
    if (Number.isNaN(t.getTime()) || t < bucketStart || t > now) continue;
    const idx = Math.min(WEEKS - 1, Math.floor((t - bucketStart) / weekMs));
    prBuckets[idx] += 1;
    locBuckets[idx] += (pr.additions || 0) + (pr.deletions || 0);
    seenByBucket[idx].add(pr.author);
  }

  const seenSoFar = new Set();
  for (let i = 0; i < WEEKS; i++) {
    for (const a of seenByBucket[i]) seenSoFar.add(a);
    contributorBuckets[i] = seenSoFar.size;
  }
  return { prBuckets, locBuckets, contributorBuckets };
}
