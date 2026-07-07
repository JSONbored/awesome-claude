// Pure display helper for the source-citations panel, split out of
// source-citations.tsx so it can be unit-tested without React.

/**
 * Display host for a citation URL: the URL host with a leading `www.` stripped.
 * Returns the original string unchanged when it is not a parseable URL (so a
 * best-effort hint is still shown), or `undefined` when the input is empty.
 */
export function hostOf(url?: string): string | undefined {
  if (!url) return undefined;
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
}
