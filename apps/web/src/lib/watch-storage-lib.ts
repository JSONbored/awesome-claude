// Pure parsing/normalization of the persisted watch payload, split out of the
// watch provider so the shape guards can be unit-tested. The storage access
// itself stays in the provider, inside its try/catch.

import type { WatchTarget } from "@/lib/watch-types-lib";

/** The date used before anything has been marked read. */
export const WATCH_EPOCH = "1970-01-01";

export interface StoredWatchState {
  targets: WatchTarget[];
  lastSeenAt: string;
}

/** A fresh, empty watch state. */
export function emptyWatchState(): StoredWatchState {
  return { targets: [], lastSeenAt: WATCH_EPOCH };
}

/**
 * Parse a persisted watch payload, tolerating a missing value, malformed JSON,
 * a non-array `targets` and a non-string `lastSeenAt`.
 */
export function parseWatchState(raw: string | null | undefined): StoredWatchState {
  if (!raw) return emptyWatchState();
  try {
    const parsed = JSON.parse(raw) as Partial<StoredWatchState>;
    return {
      targets: Array.isArray(parsed.targets) ? parsed.targets : [],
      lastSeenAt: typeof parsed.lastSeenAt === "string" ? parsed.lastSeenAt : WATCH_EPOCH,
    };
  } catch {
    return emptyWatchState();
  }
}
