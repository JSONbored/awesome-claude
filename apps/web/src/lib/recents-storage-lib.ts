// Pure parsing/normalization of the persisted recents payload, split out of the
// recents provider so the shape guards can be unit-tested. The storage access
// itself stays in the provider, inside its try/catch.

import type { RecentsState } from "@/lib/recents-types-lib";

/** A fresh, empty recents state. */
export function emptyRecentsState(): RecentsState {
  return { entries: [], saved: [], follows: [], segments: [] };
}

/**
 * Parse a persisted recents payload, tolerating a missing value, malformed JSON,
 * and non-array fields. Always returns a fully-populated state.
 */
export function parseRecentsState(raw: string | null | undefined): RecentsState {
  if (!raw) return emptyRecentsState();
  try {
    const parsed = JSON.parse(raw) as Partial<RecentsState>;
    return {
      entries: Array.isArray(parsed.entries) ? parsed.entries : [],
      saved: Array.isArray(parsed.saved) ? parsed.saved : [],
      follows: Array.isArray(parsed.follows) ? parsed.follows : [],
      segments: Array.isArray(parsed.segments) ? parsed.segments : [],
    };
  } catch {
    return emptyRecentsState();
  }
}
