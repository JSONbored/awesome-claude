import { describe, expect, it } from "vitest";

import { isFeedCurrent } from "../apps/web/src/lib/feed-freshness-lib";

const NOW = Date.parse("2026-07-07T12:00:00.000Z");
const DAY = 24 * 60 * 60 * 1000;

describe("isFeedCurrent", () => {
  it("is not current when there is no latest timestamp", () => {
    expect(isFeedCurrent(null, NOW)).toBe(false);
    expect(isFeedCurrent("", NOW)).toBe(false);
  });

  it("is current within the default 30-day window", () => {
    expect(isFeedCurrent(new Date(NOW - DAY).toISOString(), NOW)).toBe(true);
    expect(isFeedCurrent(new Date(NOW - 30 * DAY).toISOString(), NOW)).toBe(
      true,
    );
  });

  it("is not current past the 30-day window", () => {
    expect(isFeedCurrent(new Date(NOW - 31 * DAY).toISOString(), NOW)).toBe(
      false,
    );
  });

  it("honors a custom freshnessDays threshold", () => {
    const sevenDaysAgo = new Date(NOW - 8 * DAY).toISOString();
    expect(isFeedCurrent(sevenDaysAgo, NOW, 7)).toBe(false);
    expect(isFeedCurrent(sevenDaysAgo, NOW, 30)).toBe(true);
  });
});
