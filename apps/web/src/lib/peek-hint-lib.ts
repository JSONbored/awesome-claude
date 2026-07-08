// Pure persistence helpers for the peek-hint coach mark, split out of
// peek-hint.tsx so the dismissed-state logic can be unit-tested with a fake
// storage instead of the real `window.localStorage`.

export const PEEK_HINT_KEY = "hc.hint.peek.v1";

type StorageLike = Pick<Storage, "getItem" | "setItem">;

/**
 * Whether the peek hint has already been dismissed. Missing storage, or storage
 * that throws (e.g. blocked in private mode), is treated as dismissed so the
 * one-time hint stays hidden rather than reappearing.
 */
export function peekHintDismissed(storage: StorageLike | null | undefined): boolean {
  if (!storage) return true;
  try {
    return storage.getItem(PEEK_HINT_KEY) === "1";
  } catch {
    return true;
  }
}

/** Record that the peek hint was dismissed. No-op on missing/throwing storage. */
export function dismissPeekHint(storage: StorageLike | null | undefined): void {
  if (!storage) return;
  try {
    storage.setItem(PEEK_HINT_KEY, "1");
  } catch {
    /* noop */
  }
}
