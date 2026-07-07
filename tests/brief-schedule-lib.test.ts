import { describe, expect, it } from "vitest";

import { nextSendSlot } from "../apps/web/src/lib/brief-schedule-lib";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

// Derive a known Sunday 16:00 UTC from the function itself, so the assertions
// below never depend on hard-coding the weekday of an arbitrary calendar date.
const knownSunday = new Date(nextSendSlot(new Date("2026-06-01T00:00:00Z")));

function sameDayAt(base: Date, hour: number): Date {
  return new Date(
    Date.UTC(
      base.getUTCFullYear(),
      base.getUTCMonth(),
      base.getUTCDate(),
      hour,
      0,
      0,
      0,
    ),
  );
}

describe("nextSendSlot", () => {
  it("always returns a Sunday at exactly 16:00:00.000 UTC", () => {
    for (const iso of [
      "2026-06-01T00:00:00Z",
      "2026-06-03T09:30:00Z",
      "2026-06-06T23:59:59Z",
      "2026-12-25T12:00:00Z",
    ]) {
      const slot = new Date(nextSendSlot(new Date(iso)));
      expect(slot.getUTCDay()).toBe(0);
      expect(slot.getUTCHours()).toBe(16);
      expect(slot.getUTCMinutes()).toBe(0);
      expect(slot.getUTCSeconds()).toBe(0);
      expect(slot.getUTCMilliseconds()).toBe(0);
    }
  });

  it("returns a slot strictly after `from`, within one week", () => {
    for (const iso of ["2026-06-01T00:00:00Z", "2026-06-04T18:00:00Z"]) {
      const from = new Date(iso);
      const slot = new Date(nextSendSlot(from));
      expect(slot.getTime()).toBeGreaterThan(from.getTime());
      expect(slot.getTime() - from.getTime()).toBeLessThanOrEqual(WEEK_MS);
    }
  });

  it("uses the same Sunday when `from` is that Sunday before 16:00", () => {
    const before = sameDayAt(knownSunday, 10);
    expect(nextSendSlot(before)).toBe(knownSunday.toISOString());
  });

  it("rolls to the following Sunday when `from` is exactly the 16:00 slot", () => {
    const next = new Date(nextSendSlot(knownSunday));
    expect(next.getTime() - knownSunday.getTime()).toBe(WEEK_MS);
  });

  it("rolls to the following Sunday when `from` is that Sunday after 16:00", () => {
    const after = sameDayAt(knownSunday, 18);
    const next = new Date(nextSendSlot(after));
    expect(next.getUTCDay()).toBe(0);
    expect(next.getTime()).toBeGreaterThan(knownSunday.getTime());
    expect(next.getTime() - knownSunday.getTime()).toBe(WEEK_MS);
  });

  it("returns an ISO 8601 UTC string", () => {
    expect(nextSendSlot(new Date("2026-06-01T00:00:00Z"))).toMatch(
      /^\d{4}-\d{2}-\d{2}T16:00:00\.000Z$/,
    );
  });
});
