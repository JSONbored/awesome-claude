import { describe, expect, it } from "vitest";
import {
  filterTrendingRowsByWindow,
  resolveTrendingWindowRows,
  TRENDING_WINDOW_OPTIONS,
  trendingSharePath,
  trendingWindowDays,
} from "../apps/web/src/lib/trending-window-lib";

describe("trending window lib", () => {
  const nowMs = Date.parse("2026-07-23T12:00:00.000Z");

  it("maps window ids to day counts", () => {
    expect(trendingWindowDays("7d")).toBe(7);
    expect(trendingWindowDays("30d")).toBe(30);
    expect(trendingWindowDays("all")).toBeNull();
    expect(TRENDING_WINDOW_OPTIONS.map((option) => option.id)).toEqual([
      "7d",
      "30d",
      "all",
    ]);
  });

  it("filters rows by dateAdded for finite windows and keeps all for all-time", () => {
    const rows = [
      { id: "fresh", dateAdded: "2026-07-20" },
      { id: "month", dateAdded: "2026-07-01" },
      { id: "old", dateAdded: "2026-01-01" },
      { id: "missing", dateAdded: "" },
      { id: "invalid", dateAdded: "not-a-date" },
    ];

    expect(
      filterTrendingRowsByWindow(rows, "7d", nowMs).map((row) => row.id),
    ).toEqual(["fresh"]);
    expect(
      filterTrendingRowsByWindow(rows, "30d", nowMs).map((row) => row.id),
    ).toEqual(["fresh", "month"]);
    expect(
      filterTrendingRowsByWindow(rows, "all", nowMs).map((row) => row.id),
    ).toEqual(["fresh", "month", "old", "missing", "invalid"]);
  });

  it("falls back to recent rows when a finite window matches nothing in the loaded set", () => {
    const fetched = [{ id: "old", dateAdded: "2026-01-01" }];
    const recent = [{ id: "fresh", dateAdded: "2026-07-20" }];
    expect(
      resolveTrendingWindowRows(fetched, recent, "7d", nowMs).map(
        (row) => row.id,
      ),
    ).toEqual(["fresh"]);
    expect(
      resolveTrendingWindowRows(fetched, recent, "all", nowMs).map(
        (row) => row.id,
      ),
    ).toEqual(["old"]);
    expect(
      resolveTrendingWindowRows(
        [{ id: "in-window", dateAdded: "2026-07-20" }, ...fetched],
        recent,
        "7d",
        nowMs,
      ).map((row) => row.id),
    ).toEqual(["in-window"]);
  });

  it("builds share paths that omit the default all-time window", () => {
    expect(trendingSharePath("all", "")).toBe("/trending");
    expect(trendingSharePath("all", "mcp")).toBe("/trending?category=mcp");
    expect(trendingSharePath("30d", "")).toBe("/trending?window=30d");
    expect(trendingSharePath("7d", "skills")).toBe(
      "/trending?window=7d&category=skills",
    );
  });
});
