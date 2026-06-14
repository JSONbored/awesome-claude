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
