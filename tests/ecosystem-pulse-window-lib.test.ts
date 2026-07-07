import { describe, expect, it } from "vitest";

import { filterRecentPulseEntries } from "../apps/web/src/lib/ecosystem-pulse-window-lib";

// Fixed reference "now": 2026-07-15 12:00 UTC → today's UTC day is 2026-07-15.
// The trailing window is 14 UTC days inclusive: 2026-07-02 .. 2026-07-15.
const NOW = new Date("2026-07-15T12:00:00Z");

function entries(...dates: string[]) {
  return dates.map((date) => ({ date }));
}

describe("filterRecentPulseEntries", () => {
  it("keeps an entry dated today", () => {
    expect(filterRecentPulseEntries(entries("2026-07-15"), NOW)).toEqual([
      { date: "2026-07-15" },
    ]);
  });

  it("ignores the time-of-day and compares by UTC day", () => {
    expect(
      filterRecentPulseEntries(entries("2026-07-15T23:59:59Z"), NOW),
    ).toHaveLength(1);
  });

  it("keeps the oldest day still inside the 14-day window", () => {
    expect(filterRecentPulseEntries(entries("2026-07-02"), NOW)).toHaveLength(
      1,
    );
  });

  it("drops the day just outside the window", () => {
    expect(filterRecentPulseEntries(entries("2026-07-01"), NOW)).toEqual([]);
  });

  it("drops entries dated in the future", () => {
    expect(filterRecentPulseEntries(entries("2026-07-16"), NOW)).toEqual([]);
  });

  it("drops entries with an unparseable date", () => {
    expect(filterRecentPulseEntries(entries("not-a-date"), NOW)).toEqual([]);
  });

  it("returns an empty array for empty input", () => {
    expect(filterRecentPulseEntries([], NOW)).toEqual([]);
  });

  it("returns an empty array when now is invalid", () => {
    expect(
      filterRecentPulseEntries(entries("2026-07-15"), new Date("invalid")),
    ).toEqual([]);
  });

  it("keeps only the in-window entries from a mixed set and preserves order", () => {
    const result = filterRecentPulseEntries(
      entries("2026-07-14", "2026-06-01", "2026-07-10", "2026-08-01", "bad"),
      NOW,
    );
    expect(result).toEqual([{ date: "2026-07-14" }, { date: "2026-07-10" }]);
  });
});
