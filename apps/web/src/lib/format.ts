/** Compact number formatter: 1234 → 1.2k, 14300 → 14.3k, 2_000_000 → 2M. */
export function formatCompact(n: number | undefined | null): string {
  if (n == null || Number.isNaN(n)) return "—";
  if (n < 1_000) return String(n);
  // Units largest-first. `toFixed` can round a near-boundary value up to "1000"
  // (e.g. 999_999 / 1_000 → 999.999 → "1000"), which rendered the nonsensical
  // "1000k"/"1000M". Promote that to the next unit ("1M"/"1B") instead.
  const units: ReadonlyArray<readonly [number, string, string]> = [
    [1_000_000_000, "B", "B"],
    [1_000_000, "M", "B"],
    [1_000, "k", "M"],
  ];
  for (const [base, suffix, promoted] of units) {
    if (n < base) continue;
    const v = n / base;
    const text = v >= 100 ? v.toFixed(0) : v.toFixed(1).replace(/\.0$/, "");
    return text === "1000" && suffix !== "B" ? `1${promoted}` : `${text}${suffix}`;
  }
  return String(n);
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
