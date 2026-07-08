import { describe, expect, it } from "vitest";

import { hasLiveSignals } from "../apps/web/src/lib/trending-live-signals-lib";

describe("hasLiveSignals", () => {
  it("is false with no signals or all-off signals", () => {
    expect(hasLiveSignals(undefined)).toBe(false);
    expect(hasLiveSignals({})).toBe(false);
    expect(
      hasLiveSignals({ votes: false, community: false, intent: false }),
    ).toBe(false);
  });

  it("is true when any single signal is available", () => {
    expect(hasLiveSignals({ votes: true })).toBe(true);
    expect(hasLiveSignals({ community: true })).toBe(true);
    expect(hasLiveSignals({ intent: true })).toBe(true);
  });
});
