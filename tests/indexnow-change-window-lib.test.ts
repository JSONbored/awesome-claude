import { describe, expect, it } from "vitest";

import {
  INDEXNOW_CHANGE_WINDOW_MS,
  INDEXNOW_DAILY_CADENCE_MS,
  isWithinIndexNowChangeWindow,
} from "../apps/web/src/lib/indexnow-change-window-lib";

describe("indexnow-change-window-lib", () => {
  it("keeps the window between one and two daily cadences", () => {
    expect(INDEXNOW_CHANGE_WINDOW_MS).toBeGreaterThan(
      INDEXNOW_DAILY_CADENCE_MS,
    );
    expect(INDEXNOW_CHANGE_WINDOW_MS).toBeLessThan(
      2 * INDEXNOW_DAILY_CADENCE_MS,
    );
  });

  it("does not double-submit a T+ε change across consecutive daily runs", () => {
    const t0 = Date.parse("2026-06-01T05:00:00.000Z");
    const stamp = t0 + 60_000; // updated shortly after the previous run
    const runPlus24h = t0 + INDEXNOW_DAILY_CADENCE_MS;
    const runPlus48h = t0 + 2 * INDEXNOW_DAILY_CADENCE_MS;

    // Before: a 48h window marks the URL eligible on both daily runs.
    expect(
      isWithinIndexNowChangeWindow(stamp, runPlus24h, 48 * 60 * 60 * 1000),
    ).toBe(true);
    expect(
      isWithinIndexNowChangeWindow(stamp, runPlus48h, 48 * 60 * 60 * 1000),
    ).toBe(true);

    // After: the 26h window submits once on the next daily run, not again.
    expect(isWithinIndexNowChangeWindow(stamp, runPlus24h)).toBe(true);
    expect(isWithinIndexNowChangeWindow(stamp, runPlus48h)).toBe(false);
  });

  it("rejects future stamps and non-finite values", () => {
    const now = Date.parse("2026-06-02T05:00:00.000Z");
    expect(isWithinIndexNowChangeWindow(now + 1, now)).toBe(false);
    expect(isWithinIndexNowChangeWindow(Number.NaN, now)).toBe(false);
  });

  it("includes the cutoff boundary and excludes ages just beyond the window", () => {
    const now = Date.parse("2026-06-02T05:00:00.000Z");
    expect(
      isWithinIndexNowChangeWindow(now - INDEXNOW_CHANGE_WINDOW_MS, now),
    ).toBe(true);
    expect(
      isWithinIndexNowChangeWindow(now - INDEXNOW_CHANGE_WINDOW_MS - 1, now),
    ).toBe(false);
  });
});
