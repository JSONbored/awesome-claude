import { describe, expect, it } from "vitest";

import {
  bucketWeekly,
  compact,
  escapeXml,
  WEEKS,
} from "../scripts/lib/impact-card-core.mjs";

const NOW = new Date("2026-04-01T00:00:00Z");
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
/** Start of the oldest bucket for the given `now`. */
const windowStart = new Date(NOW.getTime() - WEEKS * WEEK_MS);
/** A date `weeksAgo` weeks before `now`, nudged inside the bucket. */
const at = (weeksAgo: number) =>
  new Date(NOW.getTime() - weeksAgo * WEEK_MS + 60_000).toISOString();

const pr = (over: Record<string, unknown> = {}) => ({
  mergedAt: at(1),
  author: "ada",
  additions: 0,
  deletions: 0,
  ...over,
});

describe("compact", () => {
  it("formats millions, thousands and small numbers", () => {
    expect(compact(2_500_000)).toBe("2.5M");
    expect(compact(1_000_000)).toBe("1.0M");
    expect(compact(34_400)).toBe("34k");
    expect(compact(1000)).toBe("1k");
    expect(compact(999)).toBe("999");
    expect(compact(0)).toBe("0");
  });

  it("rolls the just-under-a-million boundary up to millions, not 1000k", () => {
    expect(compact(999_499)).toBe("999k");
    expect(compact(999_500)).toBe("1.0M");
    expect(compact(999_999)).toBe("1.0M");
  });
});

describe("escapeXml", () => {
  it("escapes the five XML entities", () => {
    expect(escapeXml(`&<>"'`)).toBe("&amp;&lt;&gt;&quot;&#x27;");
  });

  it("escapes ampersands first and stringifies non-strings", () => {
    expect(escapeXml("a & b")).toBe("a &amp; b");
    expect(escapeXml(42)).toBe("42");
  });
});

describe("bucketWeekly", () => {
  it("returns WEEKS buckets, all zero for no PRs", () => {
    const { prBuckets, locBuckets, contributorBuckets } = bucketWeekly([], NOW);
    expect(prBuckets).toHaveLength(WEEKS);
    expect(prBuckets.every((n: number) => n === 0)).toBe(true);
    expect(locBuckets.every((n: number) => n === 0)).toBe(true);
    expect(contributorBuckets.every((n: number) => n === 0)).toBe(true);
  });

  it("counts a PR and its lines changed in the right bucket", () => {
    const { prBuckets, locBuckets } = bucketWeekly(
      [pr({ mergedAt: at(1), additions: 10, deletions: 5 })],
      NOW,
    );
    // one week ago falls in the last bucket
    expect(prBuckets[WEEKS - 1]).toBe(1);
    expect(locBuckets[WEEKS - 1]).toBe(15);
    expect(prBuckets.reduce((a: number, b: number) => a + b, 0)).toBe(1);
  });

  it("ignores PRs outside the window or with an unparseable date", () => {
    const tooOld = new Date(windowStart.getTime() - WEEK_MS).toISOString();
    const future = new Date(NOW.getTime() + WEEK_MS).toISOString();
    const { prBuckets } = bucketWeekly(
      [
        pr({ mergedAt: tooOld }),
        pr({ mergedAt: future }),
        pr({ mergedAt: "nope" }),
      ],
      NOW,
    );
    expect(prBuckets.reduce((a: number, b: number) => a + b, 0)).toBe(0);
  });

  it("counts contributors cumulatively across buckets", () => {
    const { contributorBuckets } = bucketWeekly(
      [
        pr({ mergedAt: at(6), author: "ada" }),
        pr({ mergedAt: at(1), author: "bob" }),
      ],
      NOW,
    );
    // ada is still counted in later buckets; bob joins at the end
    expect(contributorBuckets[WEEKS - 1]).toBe(2);
    expect(contributorBuckets[0]).toBe(0);
    // monotonically non-decreasing
    for (let i = 1; i < WEEKS; i++) {
      expect(contributorBuckets[i]).toBeGreaterThanOrEqual(
        contributorBuckets[i - 1],
      );
    }
  });

  it("does not double-count the same author within a bucket", () => {
    const { contributorBuckets } = bucketWeekly(
      [
        pr({ mergedAt: at(1), author: "ada" }),
        pr({ mergedAt: at(1), author: "ada" }),
      ],
      NOW,
    );
    expect(contributorBuckets[WEEKS - 1]).toBe(1);
  });
});
