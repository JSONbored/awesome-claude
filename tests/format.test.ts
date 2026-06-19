import { describe, expect, it } from "vitest";

import { formatBytes, formatCompact, formatDate, formatPercent, timeAgo } from "@/lib/format";

describe("formatCompact", () => {
  it("returns plain number for values below 1 000", () => {
    expect(formatCompact(0)).toBe("0");
    expect(formatCompact(999)).toBe("999");
  });

  it("formats thousands with k suffix", () => {
    expect(formatCompact(1_200)).toBe("1.2k");
    expect(formatCompact(14_300)).toBe("14.3k");
    expect(formatCompact(120_000)).toBe("120k");
    expect(formatCompact(999_999)).toBe("1000k");
  });

  it("formats millions and billions", () => {
    expect(formatCompact(2_000_000)).toBe("2M");
    expect(formatCompact(1_500_000_000)).toBe("1.5B");
  });

  it("returns em-dash for nullish or NaN", () => {
    expect(formatCompact(null)).toBe("—");
    expect(formatCompact(undefined)).toBe("—");
    expect(formatCompact(NaN)).toBe("—");
  });
});

describe("timeAgo", () => {
  it("returns em-dash for missing or invalid input", () => {
    expect(timeAgo(null)).toBe("—");
    expect(timeAgo(undefined)).toBe("—");
    expect(timeAgo("not-a-date")).toBe("—");
    expect(timeAgo("")).toBe("—");
  });
});

describe("formatPercent", () => {
  it("formats the ratio as an integer percentage string", () => {
    expect(formatPercent(1, 3)).toBe("33%");
    expect(formatPercent(1, 4)).toBe("25%");
    expect(formatPercent(2, 4)).toBe("50%");
    expect(formatPercent(3, 3)).toBe("100%");
    expect(formatPercent(0, 10)).toBe("0%");
  });

  it("returns em-dash when denominator is zero", () => {
    expect(formatPercent(0, 0)).toBe("—");
    expect(formatPercent(5, 0)).toBe("—");
  });

  it("returns em-dash for nullish or NaN inputs", () => {
    expect(formatPercent(null, 10)).toBe("—");
    expect(formatPercent(5, null)).toBe("—");
    expect(formatPercent(NaN, 10)).toBe("—");
    expect(formatPercent(5, NaN)).toBe("—");
  });

  it("clamps floating-point results to [0, 100]", () => {
    // Very large numerator: clamp to 100
    expect(formatPercent(200, 100)).toBe("100%");
    // Negative numerator: clamp to 0
    expect(formatPercent(-5, 10)).toBe("0%");
  });
});

describe("formatBytes", () => {
  it("formats sub-kilobyte values with B suffix", () => {
    expect(formatBytes(0)).toBe("0 B");
    expect(formatBytes(512)).toBe("512 B");
    expect(formatBytes(1_023)).toBe("1023 B");
  });

  it("formats kilobytes with one decimal place", () => {
    expect(formatBytes(1_024)).toBe("1 KB");
    expect(formatBytes(1_536)).toBe("1.5 KB");
    expect(formatBytes(102_400)).toBe("100 KB");
  });

  it("formats megabytes and gigabytes", () => {
    expect(formatBytes(1_048_576)).toBe("1 MB");
    expect(formatBytes(1_572_864)).toBe("1.5 MB");
    expect(formatBytes(1_073_741_824)).toBe("1 GB");
    expect(formatBytes(1_610_612_736)).toBe("1.5 GB");
  });

  it("returns em-dash for nullish or NaN", () => {
    expect(formatBytes(null)).toBe("—");
    expect(formatBytes(undefined)).toBe("—");
    expect(formatBytes(NaN)).toBe("—");
  });
});

describe("formatDate", () => {
  it("formats an ISO date string as a short calendar date", () => {
    expect(formatDate("2026-06-19")).toBe("Jun 19, 2026");
    expect(formatDate("2026-01-01")).toBe("Jan 1, 2026");
    expect(formatDate("2025-12-31")).toBe("Dec 31, 2025");
  });

  it("returns em-dash for missing or invalid input", () => {
    expect(formatDate(null)).toBe("—");
    expect(formatDate(undefined)).toBe("—");
    expect(formatDate("")).toBe("—");
    expect(formatDate("not-a-date")).toBe("—");
  });

  it("uses UTC so the date matches the ISO string date component", () => {
    // A timestamp late in the day UTC should not roll over to the next day.
    expect(formatDate("2026-03-15T23:59:59.000Z")).toBe("Mar 15, 2026");
  });
});
