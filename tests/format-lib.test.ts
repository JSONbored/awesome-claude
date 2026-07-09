import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

import { formatCompact, timeAgo } from "../apps/web/src/lib/format-lib";

describe("formatCompact", () => {
  it("returns the em-dash for nullish and NaN inputs", () => {
    expect(formatCompact(null)).toBe("—");
    expect(formatCompact(undefined)).toBe("—");
    expect(formatCompact(Number.NaN)).toBe("—");
  });

  it("passes small values (< 1000) through as plain strings", () => {
    expect(formatCompact(0)).toBe("0");
    expect(formatCompact(42)).toBe("42");
    expect(formatCompact(999)).toBe("999");
    expect(formatCompact(-5)).toBe("-5");
  });

  it("formats the thousands (k) bucket with one decimal below 100", () => {
    expect(formatCompact(1000)).toBe("1k");
    expect(formatCompact(1234)).toBe("1.2k");
    expect(formatCompact(14_300)).toBe("14.3k");
    expect(formatCompact(2000)).toBe("2k");
  });

  it("uses an integer in the k bucket at or above 100", () => {
    expect(formatCompact(120_000)).toBe("120k");
    expect(formatCompact(120_400)).toBe("120k");
  });

  it("promotes 999_999 to 1M instead of 1000k", () => {
    expect(formatCompact(999_999)).toBe("1M");
  });

  it("formats the millions (M) bucket", () => {
    expect(formatCompact(2_000_000)).toBe("2M");
    expect(formatCompact(1_500_000)).toBe("1.5M");
    expect(formatCompact(120_000_000)).toBe("120M");
  });

  it("promotes 999_999_999 to 1B instead of 1000M", () => {
    expect(formatCompact(999_999_999)).toBe("1B");
  });

  it("formats the billions (B) bucket with a stripped trailing .0", () => {
    expect(formatCompact(1_000_000_000)).toBe("1B");
    expect(formatCompact(2_000_000_000)).toBe("2B");
    expect(formatCompact(123_500_000_000)).toBe("123.5B");
  });
});

describe("timeAgo", () => {
  const NOW = new Date("2026-06-15T12:00:00.000Z");
  const ago = (ms: number) => new Date(NOW.getTime() - ms).toISOString();
  const SECOND = 1_000;
  const MINUTE = 60_000;
  const HOUR = 60 * MINUTE;
  const DAY = 24 * HOUR;

  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it("returns the em-dash for nullish, invalid, and future dates", () => {
    expect(timeAgo(null)).toBe("—");
    expect(timeAgo(undefined)).toBe("—");
    expect(timeAgo("")).toBe("—");
    expect(timeAgo("not-a-date")).toBe("—");
    expect(timeAgo(ago(-MINUTE))).toBe("—");
  });

  it('returns "just now" under a minute', () => {
    expect(timeAgo(ago(20 * SECOND))).toBe("just now");
    expect(timeAgo(NOW.toISOString())).toBe("just now");
  });

  it("formats the minutes bucket", () => {
    expect(timeAgo(ago(5 * MINUTE))).toBe("5m ago");
    expect(timeAgo(ago(59 * MINUTE))).toBe("59m ago");
  });

  it("formats the hours bucket", () => {
    expect(timeAgo(ago(2 * HOUR))).toBe("2h ago");
    expect(timeAgo(ago(23 * HOUR))).toBe("23h ago");
  });

  it("formats the days bucket", () => {
    expect(timeAgo(ago(2 * DAY))).toBe("2d ago");
    expect(timeAgo(ago(29 * DAY))).toBe("29d ago");
  });

  it("formats the months bucket", () => {
    expect(timeAgo(ago(60 * DAY))).toBe("2mo ago");
    expect(timeAgo(ago(330 * DAY))).toBe("11mo ago");
  });

  it("formats the years bucket", () => {
    expect(timeAgo(ago(400 * DAY))).toBe("1y ago");
    expect(timeAgo(ago(800 * DAY))).toBe("2y ago");
  });

  it("floors each unit at sub-boundary values instead of rounding up", () => {
    // Regression: these all sit just short of the next unit's boundary. With Math.round they
    // rounded up into the wrong bucket ("just now"->"1m", "1h"->"2h", "23h"->"1d", "29d"->"1mo").
    expect(timeAgo(ago(45 * SECOND))).toBe("just now");
    expect(timeAgo(ago(59 * MINUTE + 59 * SECOND))).toBe("59m ago");
    expect(timeAgo(ago(90 * MINUTE))).toBe("1h ago");
    expect(timeAgo(ago(23 * HOUR + 30 * MINUTE))).toBe("23h ago");
    expect(timeAgo(ago(29 * DAY + 12 * HOUR))).toBe("29d ago");
    expect(timeAgo(ago(345 * DAY))).toBe("11mo ago");
  });
});
