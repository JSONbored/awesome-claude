// Pure helpers for the umami collector proxy's upstream-origin allowlisting,
// split out of the route so the CSV parsing and origin validation can be
// unit-tested without the handler (the env/default origins are injected).

/** Parse a comma-separated allowlist, falling back to the defaults when empty. */
export function parseAllowedUpstreamOrigins(
  configured: string | undefined,
  defaults: readonly string[],
): string[] {
  return configured
    ? configured
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean)
    : [...defaults];
}

/** Return the upstream's origin when it is allow-listed, else "" (incl. bad URL). */
export function validateUpstreamOrigin(upstream: string, allowedOrigins: string[]): string {
  try {
    const origin = new URL(upstream).origin;
    return allowedOrigins.includes(origin) ? origin : "";
  } catch {
    return "";
  }
}
