// Pure share-URL resolution, split out of share-menu.tsx so it can be
// unit-tested without a browser `window`.

/**
 * Resolve a possibly-relative share URL to an absolute one. A URL that already
 * starts with `http(s)://` is returned unchanged; otherwise `origin` is
 * prepended. Pure — the caller supplies `origin` (e.g. `window.location.origin`,
 * or `""` on the server, where a relative URL is returned unchanged).
 */
export function absoluteShareUrl(url: string, origin: string): string {
  if (/^https?:\/\//.test(url)) return url;
  return `${origin}${url}`;
}
