/**
 * Guards error text before it reaches the UI.
 *
 * Route loaders that call server functions get their failures as `Error`s whose
 * `message` is the raw *response body*: TanStack Start's server-fn client does
 * `new Error(await response.text())` for any non-OK, non-JSON response. In
 * production that body is routinely a full HTML document — a Cloudflare WAF
 * block page on a blocked request, or the `text/html` 500 shell that
 * `start.ts`/`server.ts` return for an uncaught server error. Rendering
 * `error.message` verbatim then dumps an entire markup document into the page
 * as unstyled text (see /jobs/$slug).
 *
 * Error components must run messages through `safeErrorMessage` so only short,
 * human-readable strings are shown and anything else degrades to a fallback.
 */

/** Longer than this is a payload, not a message meant for a human. */
const MAX_MESSAGE_LENGTH = 200;

export const GENERIC_ERROR_MESSAGE =
  "Something went wrong loading this page. Please try again in a moment.";

/**
 * Markup sniff: `<` immediately followed by a tag-ish character. Prose that
 * legitimately uses a less-than sign ("limit must be < 100") keeps its space
 * and is preserved.
 */
function looksLikeMarkup(value: string): boolean {
  return /<[a-z!/?]/i.test(value);
}

/**
 * Reduce an arbitrary error message to something safe to render, or fall back.
 */
export function safeErrorMessage(
  message: string | null | undefined,
  fallback: string = GENERIC_ERROR_MESSAGE,
): string {
  if (typeof message !== "string") return fallback;

  // Collapse whitespace so a multi-line body is measured by its real content.
  const normalized = message.replace(/\s+/g, " ").trim();

  if (!normalized) return fallback;
  if (normalized.length > MAX_MESSAGE_LENGTH) return fallback;
  if (looksLikeMarkup(normalized)) return fallback;

  return normalized;
}
