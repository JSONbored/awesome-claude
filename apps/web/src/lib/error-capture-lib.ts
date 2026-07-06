/**
 * Pure freshness helper for the out-of-band error capture buffer.
 *
 * The stateful buffer, global `error`/`unhandledrejection` listeners, and the
 * `consumeLastCapturedError` reader live in `error-capture.ts`
 * (`@/lib/error-capture`), which re-exports these helpers. Nothing here touches
 * global state — the freshness check is a deterministic function of timestamps.
 */

export const CAPTURE_TTL_MS = 5_000;

/** True if a value captured at `at` is still within `ttlMs` of `now`. */
export function isCaptureFresh(at: number, now: number, ttlMs: number = CAPTURE_TTL_MS): boolean {
  return now - at <= ttlMs;
}
