import { beforeEach, describe, expect, it, vi } from "vitest";

const { getGrowthSurfaces } = vi.hoisted(() => ({
  getGrowthSurfaces: vi.fn(),
}));

vi.mock("@/lib/growth-surfaces", () => ({
  getGrowthSurfaces,
}));

import { trendingItems } from "@/lib/feeds";
import { feedLastBuilt } from "@/lib/feed-items-lib";

describe("feeds trendingItems branch coverage", () => {
  beforeEach(() => {
    getGrowthSurfaces.mockReset();
  });

  it("returns an empty list when no live signals are available", async () => {
    getGrowthSurfaces.mockResolvedValue({
      communitySignalsAvailable: false,
      votesAvailable: false,
      intentEventsAvailable: false,
      communityTrending: [],
    });

    await expect(trendingItems()).resolves.toEqual([]);
  });

  it("maps community trending entries into feed items when live signals exist", async () => {
    getGrowthSurfaces.mockResolvedValue({
      communitySignalsAvailable: true,
      votesAvailable: false,
      intentEventsAvailable: false,
      communityTrending: [
        {
          category: "mcp",
          slug: "live-trending-fixture",
          title: "Live Trending Fixture",
          description: "Fixture description",
          dateAdded: "2026-01-15T00:00:00.000Z",
        },
      ],
    });

    await expect(trendingItems()).resolves.toEqual([
      {
        title: "Live Trending Fixture",
        link: "/entry/mcp/live-trending-fixture",
        guid: "trending:mcp/live-trending-fixture",
        pubDate: "2026-01-15T00:00:00.000Z",
        description: "Fixture description",
        category: "mcp",
      },
    ]);
  });

  it("falls back to epoch pubDate when trending entries omit dateAdded", async () => {
    getGrowthSurfaces.mockResolvedValue({
      communitySignalsAvailable: false,
      votesAvailable: true,
      intentEventsAvailable: false,
      communityTrending: [
        {
          category: "skills",
          slug: "undated-fixture",
          title: "Undated Fixture",
          description: "No date",
        },
      ],
    });

    const items = await trendingItems();
    expect(items[0]?.pubDate).toBe(new Date(0).toISOString());
  });

  it("returns the newest pubDate as lastBuildDate when the highest-scoring item is not the newest", async () => {
    const oldItem = {
      category: "mcp",
      slug: "old-item",
      title: "Old Item",
      description: "Old",
      dateAdded: "2026-01-01T00:00:00.000Z",
    };
    const newItem = {
      category: "mcp",
      slug: "new-item",
      title: "New Item",
      description: "New",
      dateAdded: "2026-01-02T00:00:00.000Z",
    };

    // oldItem is first in the trending list (higher score) but has an older date
    getGrowthSurfaces.mockResolvedValue({
      communitySignalsAvailable: true,
      votesAvailable: false,
      intentEventsAvailable: false,
      communityTrending: [oldItem, newItem],
    });

    const items = await trendingItems();
    // items will be in the order: [oldItem, newItem] (as per communityTrending)
    const lastBuilt = feedLastBuilt(items);
    expect(lastBuilt).toBe(newItem.dateAdded); // because newItem has the newer date
  });
});
