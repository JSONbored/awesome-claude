// Client-side, cookieless umami custom-event helper. SSR-safe and best-effort:
// if the tracker hasn't loaded yet (or is blocked) the call is a silent no-op.
//
// We only emit events that map to a real product action worth measuring —
// conversions and high-signal engagement. Pageviews are recorded automatically
// by the tracker, so we never re-emit those, and event data never carries PII
// (no emails, no raw form fields, queries truncated). This keeps the umami
// dashboard accurate and quiet rather than noisy.

type UmamiTracker = {
  track?: (event: string, data?: Record<string, unknown>) => void;
};

/** Emit a named umami event. No-ops on the server or before the tracker loads. */
export function trackEvent(name: string, data?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  const umami = (window as unknown as { umami?: UmamiTracker }).umami;
  umami?.track?.(name, data);
}

/** An entry's stable `category/slug` key, for grouping events by resource. */
export function entryEventKey(category: string, slug: string): string {
  return `${category}/${slug}`;
}

/** Hostname of an outbound URL, for grouping source clicks (no full URL / PII). */
export function outboundHost(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "unknown";
  }
}

/**
 * Truncate a free-text search query to a safe length before it lands in an
 * analytics event. Collapses internal whitespace and strips leading/trailing
 * space. The default cap of 80 characters is long enough to capture meaningful
 * query patterns while preventing accidental PII leakage from very long pastes.
 *
 * @param q - Raw query string from the search input.
 * @param max - Maximum character length (default 80).
 */
export function truncateQuery(q: string, max = 80): string {
  const normalized = q.replace(/\s+/g, " ").trim();
  return normalized.length > max ? normalized.slice(0, max) : normalized;
}

/**
 * Build a stable, composite analytics key for a search event so identical
 * query/filter combinations can be grouped in the umami dashboard without
 * sending raw URL parameters that may contain PII.
 *
 * The key is `"<query>|<sorted-filter-tags>"`. Filters are sorted so that
 * `{categories:["skills","mcp"]}` and `{categories:["mcp","skills"]}` produce
 * the same key.
 *
 * @example searchEventKey("playwright browser", { categories: ["mcp"] })
 * // "playwright browser|categories:mcp"
 */
export function searchEventKey(
  query: string,
  filters: Record<string, string | string[] | boolean | undefined | null> = {},
): string {
  const q = truncateQuery(query);
  const parts: string[] = [];
  for (const [key, value] of Object.entries(filters)) {
    if (value == null || value === false || (Array.isArray(value) && value.length === 0)) continue;
    const vals = Array.isArray(value)
      ? [...value].sort().join(",")
      : String(value);
    parts.push(`${key}:${vals}`);
  }
  parts.sort();
  return parts.length > 0 ? `${q}|${parts.join("|")}` : q;
}
