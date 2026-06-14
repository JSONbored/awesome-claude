import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

import {
  isSitemapIndexableEntry,
  sitemapEntryLastModified,
} from "@/lib/sitemap-policy";
import { repoRoot } from "./helpers/registry-fixtures";

describe("sitemap policy", () => {
  it("excludes noindex registry entries from indexable sitemap URLs", () => {
    expect(
      isSitemapIndexableEntry({
        category: "skills",
        slug: "draft-skill",
        title: "Draft Skill",
        description: "Draft skill.",
        robotsIndex: false,
        tags: [],
        keywords: [],
      } as any),
    ).toBe(false);
  });

  it("prefers content modified metadata for sitemap lastmod", () => {
    const lastModified = sitemapEntryLastModified({
      category: "skills",
      slug: "updated-skill",
      title: "Updated Skill",
      description: "Updated skill.",
      contentUpdatedAt: "2026-04-26T12:34:56.000Z",
      repoUpdatedAt: "2026-04-20T00:00:00.000Z",
      dateAdded: "2026-04-01",
      tags: [],
      keywords: [],
    } as any);

    expect(lastModified?.toISOString()).toBe("2026-04-26T12:34:56.000Z");
  });

  it("includes machine-readable distribution surfaces in the sitemap source", () => {
    const source = fs.readFileSync(
      path.join(repoRoot, "apps/web/src/routes/sitemap[.]xml.ts"),
      "utf8",
    );
    expect(source).toContain('"/llms.txt"');
    expect(source).toContain('"/llms-full.txt"');
    expect(source).toContain('"/feed.xml"');
    expect(source).toContain('"/atom.xml"');
    expect(source).toContain('"/feeds/trending.xml"');
    // /data/** is robots-disallowed, so it must not be advertised in the sitemap.
    expect(source).not.toContain('"/data/feeds/index.json"');
    expect(source).toContain('"/validators"');
    expect(source).not.toContain('"/validators/mcp-config"');
    expect(source).not.toContain('"/validators/skill-package"');
    expect(source).not.toContain("lastModified: new Date()");
    // Entry pages are filtered through the sitemap-indexable policy (drops
    // commercial `tools` listings + any robotsIndex:false entries).
    expect(source).toContain("ENTRIES.filter(isSitemapIndexableEntry)");
    // Category hub landing pages with per-category + per-entry lastmod.
    expect(source).toContain("categoryLastmod");
    expect(source).toContain("entry.reviewedAt ?? entry.dateAdded");
  });
});
