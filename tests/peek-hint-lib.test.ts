import { describe, expect, it } from "vitest";

import {
  PEEK_HINT_KEY,
  dismissPeekHint,
  peekHintDismissed,
} from "../apps/web/src/lib/peek-hint-lib";

function fakeStorage(initial: Record<string, string> = {}) {
  const map = new Map(Object.entries(initial));
  return {
    getItem: (k: string) => (map.has(k) ? (map.get(k) as string) : null),
    setItem: (k: string, v: string) => void map.set(k, v),
    _map: map,
  };
}

describe("peekHintDismissed", () => {
  it("is dismissed when there is no storage", () => {
    expect(peekHintDismissed(null)).toBe(true);
    expect(peekHintDismissed(undefined)).toBe(true);
  });

  it("reflects the stored flag", () => {
    expect(peekHintDismissed(fakeStorage({ [PEEK_HINT_KEY]: "1" }))).toBe(true);
    expect(peekHintDismissed(fakeStorage())).toBe(false);
    expect(peekHintDismissed(fakeStorage({ [PEEK_HINT_KEY]: "0" }))).toBe(
      false,
    );
  });

  it("treats a throwing storage as dismissed", () => {
    const throwing = {
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {},
    };
    expect(peekHintDismissed(throwing)).toBe(true);
  });
});

describe("dismissPeekHint", () => {
  it("persists the dismissed flag", () => {
    const storage = fakeStorage();
    dismissPeekHint(storage);
    expect(storage._map.get(PEEK_HINT_KEY)).toBe("1");
    expect(peekHintDismissed(storage)).toBe(true);
  });

  it("is a no-op on missing storage", () => {
    expect(() => dismissPeekHint(null)).not.toThrow();
  });

  it("swallows a throwing storage", () => {
    const throwing = {
      getItem: () => null,
      setItem: () => {
        throw new Error("blocked");
      },
    };
    expect(() => dismissPeekHint(throwing)).not.toThrow();
  });
});
