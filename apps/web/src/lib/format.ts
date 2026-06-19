/** Compact number formatter: 1234 → 1.2k, 14300 → 14.3k, 2_000_000 → 2M. */
export function formatCompact(n: number | undefined | null): string {
  if (n == null || Number.isNaN(n)) return "—";
  if (n < 1_000) return String(n);
  if (n < 1_000_000) {
    const v = n / 1_000;
    return `${v >= 100 ? v.toFixed(0) : v.toFixed(1).replace(/\.0$/, "")}k`;
  }
  if (n < 1_000_000_000) {
    const v = n / 1_000_000;
    return `${v >= 100 ? v.toFixed(0) : v.toFixed(1).replace(/\.0$/, "")}M`;
  }
  return `${(n / 1_000_000_000).toFixed(1).replace(/\.0$/, "")}B`;
}

/** Format an ISO date relative to now: "3d ago", "2h ago", "just now". */
export function timeAgo(iso: string | undefined | null): string {
  if (!iso) return "—";
  const d = new Date(iso).getTime();
  if (Number.isNaN(d)) return "—";
  const diff = Date.now() - d;
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

/**
 * Format a ratio as a percentage string, rounded to the nearest integer.
 * `numerator / denominator * 100` — returns "—" when denominator is 0 or
 * either argument is nullish/NaN. Clamps to [0, 100] so floating-point noise
 * never produces "101%" or "-1%".
 *
 * @example formatPercent(1, 3) // "33%"
 * @example formatPercent(0, 0) // "—"
 */
export function formatPercent(
  numerator: number | undefined | null,
  denominator: number | undefined | null,
): string {
  if (numerator == null || denominator == null) return "—";
  if (Number.isNaN(numerator) || Number.isNaN(denominator)) return "—";
  if (denominator === 0) return "—";
  const pct = Math.round(Math.max(0, Math.min(100, (numerator / denominator) * 100)));
  return `${pct}%`;
}

/**
 * Format a byte count as a human-readable string: 512 → "512 B",
 * 2048 → "2.0 KB", 1_572_864 → "1.5 MB". Uses binary prefixes (1024).
 * Returns "—" for nullish or NaN inputs.
 *
 * @example formatBytes(0) // "0 B"
 * @example formatBytes(1536) // "1.5 KB"
 */
export function formatBytes(n: number | undefined | null): string {
  if (n == null || Number.isNaN(n)) return "—";
  if (n < 1_024) return `${n} B`;
  if (n < 1_048_576) return `${(n / 1_024).toFixed(1).replace(/\.0$/, "")} KB`;
  if (n < 1_073_741_824) return `${(n / 1_048_576).toFixed(1).replace(/\.0$/, "")} MB`;
  return `${(n / 1_073_741_824).toFixed(1).replace(/\.0$/, "")} GB`;
}

/**
 * Format an ISO date string (or any Date-parseable string) as a compact
 * calendar date: "Jun 19, 2026". Returns "—" for invalid or missing input.
 * Uses the invariant `en-US` locale so the output is stable for tests and
 * server-rendered markup (no locale negotiation).
 *
 * @example formatDate("2026-06-19") // "Jun 19, 2026"
 */
export function formatDate(iso: string | undefined | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
