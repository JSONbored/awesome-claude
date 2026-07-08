// Pure navigation helpers for the umami tracker, split out of umami-tracker.tsx
// so the URL/referrer derivation can be unit-tested without a browser. The
// caller supplies the location/referrer values.

/** Path + query string of a location (no scheme/host). */
export function currentUrlPath(location: { pathname: string; search: string }): string {
  return `${location.pathname}${location.search}`;
}

/**
 * The referrer to report, or "" when there is none, it is same-origin, or it is
 * malformed. Only external referrers are attributed; `origin` is the current
 * page origin to compare against.
 */
export function externalReferrer(referrer: string, origin: string): string {
  if (!referrer) return "";
  try {
    return new URL(referrer).origin === origin ? "" : referrer;
  } catch {
    return "";
  }
}
