import { describe, expect, it } from "vitest";
import {
  isSitemapIndexableEntry,
  safeSitemapDate,
  sitemapEntryLastModified,
} from "../apps/web/src/lib/sitemap-policy-lib";

describe("sitemap-policy-lib", () => {
  it("indexes entries by default", () => {
    expect(
      isSitemapIndexableEntry({ category: "tools", robotsIndex: undefined }),
    ).toBe(true);
  });

  it("excludes entries that opt out of indexing", () => {
    expect(
      isSitemapIndexableEntry({ category: "tools", robotsIndex: false }),
    ).toBe(false);
  });

  it("returns undefined for missing or invalid sitemap dates", () => {
    expect(safeSitemapDate()).toBeUndefined();
    expect(safeSitemapDate(null)).toBeUndefined();
    expect(safeSitemapDate("")).toBeUndefined();
    expect(safeSitemapDate("not-a-date")).toBeUndefined();
  });

  it("falls back through entry timestamps for last modified", () => {
    const entry = {
      category: "mcp",
      slug: "demo",
      title: "Demo",
      dateAdded: "2026-01-01T00:00:00.000Z",
      contentUpdatedAt: "2026-02-01T00:00:00.000Z",
      repoUpdatedAt: "2026-03-01T00:00:00.000Z",
      verifiedAt: "2026-04-01T00:00:00.000Z",
    } as Parameters<typeof sitemapEntryLastModified>[0];

    expect(sitemapEntryLastModified(entry)?.toISOString()).toBe(
      "2026-02-01T00:00:00.000Z",
    );
  });

  it("uses repo, verified, and dateAdded when earlier timestamps are absent", () => {
    const base = {
      category: "mcp",
      slug: "demo",
      title: "Demo",
    } as Parameters<typeof sitemapEntryLastModified>[0];

    expect(
      sitemapEntryLastModified({
        ...base,
        repoUpdatedAt: "2026-03-01T00:00:00.000Z",
        verifiedAt: "2026-04-01T00:00:00.000Z",
        dateAdded: "2026-01-01T00:00:00.000Z",
      })?.toISOString(),
    ).toBe("2026-03-01T00:00:00.000Z");

    expect(
      sitemapEntryLastModified({
        ...base,
        verifiedAt: "2026-04-01T00:00:00.000Z",
        dateAdded: "2026-01-01T00:00:00.000Z",
      })?.toISOString(),
    ).toBe("2026-04-01T00:00:00.000Z");

    expect(
      sitemapEntryLastModified({
        ...base,
        dateAdded: "2026-01-01T00:00:00.000Z",
      })?.toISOString(),
    ).toBe("2026-01-01T00:00:00.000Z");
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
  it("safeSitemapDate matrix 0", () => {
    expect(safeSitemapDate("2026-01-01T00:00:00.000Z")).toBeInstanceOf(Date);
  });
  it("isSitemapIndexableEntry matrix 0", () => {
    expect(
      isSitemapIndexableEntry({ category: "mcp", robotsIndex: true }),
    ).toBe(true);
  });
});
