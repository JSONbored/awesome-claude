import { describe, expect, it } from "vitest";

import { filterRecentPulseEntries } from "../apps/web/src/lib/ecosystem-pulse-window-lib";

// Fixed reference point so every case is deterministic.
// now = 2026-06-20 (UTC). 14-day trailing window (inclusive) => 2026-06-07 .. 2026-06-20.
const NOW = new Date("2026-06-20T12:00:00.000Z");

const entry = (date: string) => ({ date });

describe("filterRecentPulseEntries", () => {
  it("keeps entries inside the 14-day UTC window", () => {
    const result = filterRecentPulseEntries([entry("2026-06-15")], NOW);
    expect(result).toEqual([{ date: "2026-06-15" }]);
  });

  it("keeps the entry falling exactly on the cutoff day", () => {
    expect(filterRecentPulseEntries([entry("2026-06-07")], NOW)).toEqual([
      { date: "2026-06-07" },
    ]);
  });

  it("keeps the entry falling exactly on today", () => {
    expect(filterRecentPulseEntries([entry("2026-06-20")], NOW)).toEqual([
      { date: "2026-06-20" },
    ]);
  });

  it("drops the entry on the day before the cutoff", () => {
    expect(filterRecentPulseEntries([entry("2026-06-06")], NOW)).toEqual([]);
  });

  it("drops entries older than the cutoff", () => {
    expect(filterRecentPulseEntries([entry("2026-05-01")], NOW)).toEqual([]);
  });

  it("drops future entries beyond today", () => {
    expect(filterRecentPulseEntries([entry("2026-06-21")], NOW)).toEqual([]);
  });

  it("compares on UTC calendar days regardless of intraday time", () => {
    const result = filterRecentPulseEntries(
      [entry("2026-06-20T23:59:59.999Z"), entry("2026-06-07T00:00:00.000Z")],
      NOW,
    );
    expect(result).toEqual([
      { date: "2026-06-20T23:59:59.999Z" },
      { date: "2026-06-07T00:00:00.000Z" },
    ]);
  });

  it("drops entries with an invalid date", () => {
    expect(filterRecentPulseEntries([entry("not-a-date")], NOW)).toEqual([]);
    expect(filterRecentPulseEntries([entry("")], NOW)).toEqual([]);
  });

  it("filters a mixed batch, preserving input order of kept entries", () => {
    const entries = [
      entry("2026-05-01"), // too old
      entry("2026-06-07"), // cutoff boundary (kept)
      entry("2026-06-06"), // day before cutoff (dropped)
      entry("2026-06-14"), // inside (kept)
      entry("bogus"), // invalid (dropped)
      entry("2026-06-20"), // today (kept)
      entry("2026-06-21"), // future (dropped)
    ];
    expect(filterRecentPulseEntries(entries, NOW)).toEqual([
      { date: "2026-06-07" },
      { date: "2026-06-14" },
      { date: "2026-06-20" },
    ]);
  });

  it("returns [] when now is an invalid Date", () => {
    expect(
      filterRecentPulseEntries([entry("2026-06-15")], new Date("invalid")),
    ).toEqual([]);
  });

  it("uses the current time as the default now", () => {
    // Only exercises the default-parameter path deterministically.
    expect(filterRecentPulseEntries([])).toEqual([]);
  });

  it("returns an empty array for empty input", () => {
    expect(filterRecentPulseEntries([], NOW)).toEqual([]);
  });
});
