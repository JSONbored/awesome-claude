/**
 * Pure number/date formatting helpers used across the web app.
 *
 * Implementation module for `@/lib/format`, which re-exports the public API.
 * Kept dependency-free so it is trivially unit-testable in isolation.
 */

/** Compact number formatter: 1234 → 1.2k, 14300 → 14.3k, 2_000_000 → 2M. */
export function formatCompact(n: number | undefined | null): string {
  if (n == null || Number.isNaN(n)) return "—";
  if (n < 1_000) return String(n);
  if (n < 1_000_000) return withUnit(n / 1_000, "k", "M");
  if (n < 1_000_000_000) return withUnit(n / 1_000_000, "M", "B");
  // Billions: always one decimal (matches the original behavior — 123.5B, not 124B), and there's no
  // higher unit to promote into, so the boundary-promotion in withUnit doesn't apply here.
  return `${(n / 1_000_000_000).toFixed(1).replace(/\.0$/, "")}B`;
}

/** Format a k/M value: integer at ≥100 (so "120k", not "120.0k"), else one decimal. If rounding
 *  overflows the unit to "1000" (e.g. 999_999/1_000 → 999.999 → "1000"), promote to the next unit
 *  ("1M"/"1B") instead of the nonsensical "1000k"/"1000M". */
function withUnit(v: number, suffix: string, promoted: string): string {
  const text = v >= 100 ? v.toFixed(0) : v.toFixed(1).replace(/\.0$/, "");
  return text === "1000" ? `1${promoted}` : `${text}${suffix}`;
}

/** Format an ISO date relative to now: "3d ago", "2h ago", "just now". */
export function timeAgo(iso: string | undefined | null): string {
  if (!iso) return "—";
  const d = new Date(iso).getTime();
  if (Number.isNaN(d)) return "—";
  const diff = Date.now() - d;
  if (diff < 0) return "—";
  const min = Math.round(diff / 60_000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const h = Math.round(min / 60);
  if (h < 24) return `${h}h ago`;
  const day = Math.round(h / 24);
  if (day < 30) return `${day}d ago`;
  const mo = Math.round(day / 30);
  if (mo < 12) return `${mo}mo ago`;
  return `${Math.round(mo / 12)}y ago`;
}
