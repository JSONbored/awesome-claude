import { describe, expect, it } from "vitest";

import {
  entryMatchesTrendingWindow,
  trendingWindowCutoffIso,
} from "../apps/web/src/lib/trending-window-lib";

describe("trending window filter (#5477)", () => {
  const now = Date.parse("2026-07-30T12:00:00.000Z");

  it("uses all as unfiltered and computes 7d/30d cutoffs", () => {
    expect(trendingWindowCutoffIso("all", now)).toBeNull();
    expect(trendingWindowCutoffIso("7d", now)).toBe("2026-07-23");
    expect(trendingWindowCutoffIso("30d", now)).toBe("2026-06-30");
  });

  it("matches entries by dateAdded against the cutoff", () => {
    expect(
      entryMatchesTrendingWindow({ dateAdded: "2026-07-29" }, "7d", now),
    ).toBe(true);
    expect(
      entryMatchesTrendingWindow({ dateAdded: "2026-07-01" }, "7d", now),
    ).toBe(false);
    expect(
      entryMatchesTrendingWindow({ dateAdded: "2026-07-01" }, "30d", now),
    ).toBe(true);
    expect(
      entryMatchesTrendingWindow({ dateAdded: "2026-01-01" }, "all", now),
    ).toBe(true);
    expect(entryMatchesTrendingWindow({ dateAdded: "" }, "7d", now)).toBe(
      false,
    );
  });
});
