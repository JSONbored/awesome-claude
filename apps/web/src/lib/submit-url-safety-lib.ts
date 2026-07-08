// Pure same-origin URL guards for the submit flow, split out of the route so the
// origin allowlisting can be unit-tested. Both never throw and collapse unsafe
// or cross-origin input to "".

import { siteConfig } from "@/lib/site";

/** The origin of a URL, or "" when it cannot be parsed. */
export function originFor(value: string): string {
  try {
    return new URL(value).origin;
  } catch {
    return "";
  }
}

/**
 * Return `value` only when it resolves (against `baseUrl`) to an http(s) URL
 * whose origin is in `allowedOrigins`; a same-origin, root-relative input is
 * returned as a path. Anything else (missing, cross-origin, non-http, or
 * unparseable) becomes "".
 */
export function safeUrlForOrigins(
  value: string | undefined,
  allowedOrigins: Set<string>,
  baseUrl = siteConfig.url,
): string {
  if (!value) return "";
  try {
    const url = new URL(value, baseUrl);
    if (
      (url.protocol !== "https:" && url.protocol !== "http:") ||
      !allowedOrigins.has(url.origin)
    ) {
      return "";
    }
    if (value.startsWith("/") && url.origin === originFor(baseUrl)) {
      return `${url.pathname}${url.search}${url.hash}`;
    }
    return url.toString();
  } catch {
    return "";
  }
}
