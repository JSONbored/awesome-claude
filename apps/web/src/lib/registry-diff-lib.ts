// Pure query-parameter helpers for the registry diff API route, split out so the
// since-date parsing and hash-shape guard can be unit-tested without the handler.

/** Parse a `since` value to epoch ms, or null when absent/unparseable. */
export function parseSinceDate(value: string | null): number | null {
  if (!value) return null;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
}

/** True when the value looks like a 32–128 char hex signature/hash. */
export function looksLikeHash(value: string | null): boolean {
  return Boolean(value && /^[a-f0-9]{32,128}$/i.test(value));
}
