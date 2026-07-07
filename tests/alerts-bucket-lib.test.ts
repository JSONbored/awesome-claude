import { describe, expect, it } from "vitest";

import { alertBucket } from "../apps/web/src/lib/alerts-bucket-lib";

// Fixed reference point so the boundaries are deterministic.
const NOW = Date.parse("2026-07-07T12:00:00.000Z");
const DAY = 86_400_000;

describe("alertBucket", () => {
  it("buckets an alert from the last 24h as Today", () => {
    expect(alertBucket(new Date(NOW - 1000).toISOString(), NOW)).toBe("Today");
    expect(alertBucket(new Date(NOW - (DAY - 1)).toISOString(), NOW)).toBe(
      "Today",
    );
  });

  it("buckets an alert older than a day but within a week as This week", () => {
    expect(alertBucket(new Date(NOW - 2 * DAY).toISOString(), NOW)).toBe(
      "This week",
    );
    expect(alertBucket(new Date(NOW - (7 * DAY - 1)).toISOString(), NOW)).toBe(
      "This week",
    );
  });

  it("buckets an alert older than a week as Earlier", () => {
    expect(alertBucket(new Date(NOW - 8 * DAY).toISOString(), NOW)).toBe(
      "Earlier",
    );
  });

  it("treats the exact 1-day boundary as no longer Today", () => {
    expect(alertBucket(new Date(NOW - DAY).toISOString(), NOW)).toBe(
      "This week",
    );
  });

  it("falls back to Earlier for an unparseable date", () => {
    expect(alertBucket("not a date", NOW)).toBe("Earlier");
  });
});
