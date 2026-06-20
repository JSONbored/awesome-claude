import { describe, expect, it } from "vitest";

import {
  hasCompareItem,
  resolveCompareParam,
  serializeCompareItems,
  toggleCompareItem,
} from "../apps/web/src/lib/compare-selection";
import {
  entryDomId,
  entryRef,
  parseEntryRef,
  sameEntry,
  type EntryIdentity,
} from "../apps/web/src/lib/entry-identity";
import { relatedBySimilarity } from "../apps/web/src/data/search";
import { getRelatedEntries } from "../apps/web/src/lib/detail-assembly";
import type { Entry } from "../apps/web/src/types/registry";
import type { ContentEntry, DirectoryEntry } from "@heyclaude/registry";

function identity(category: Entry["category"], slug: string): EntryIdentity {
  return { category, slug };
}

function registryEntry(
  category: Entry["category"],
  slug: string,
  tags: string[] = ["shared"],
): Entry {
  return {
    category,
    slug,
    title: `${category} ${slug}`,
    description: `${category} ${slug} description`,
    author: "Example",
    tags,
    platforms: ["claude-code"],
    installType: "manual",
    trust: "unverified",
    source: "unverified",
    dateAdded: "2026-01-01",
  };
}

function directoryEntry(
  category: Entry["category"],
  slug: string,
  tags: string[] = ["shared"],
): DirectoryEntry {
  return {
    category,
    slug,
    title: `${category} ${slug}`,
    description: `${category} ${slug} description`,
    tags,
    dateAdded: "2026-01-01",
  } as DirectoryEntry;
}

function contentEntry(
  category: Entry["category"],
  slug: string,
  tags: string[] = ["shared"],
): ContentEntry {
  return {
    ...directoryEntry(category, slug, tags),
    body: "Example body",
  } as ContentEntry;
}

describe("entry identity", () => {
  it("uses category and slug as the stable registry identity", () => {
    const mcpEntry = identity("mcp", "shared-slug");
    const skillEntry = identity("skills", "shared-slug");

    expect(entryRef(mcpEntry)).toBe("mcp/shared-slug");
    expect(entryDomId(mcpEntry)).toBe("mcp-shared-slug");
    expect(sameEntry(mcpEntry, identity("mcp", "shared-slug"))).toBe(true);
    expect(sameEntry(mcpEntry, skillEntry)).toBe(false);
  });

  it("parses only exact category/slug references", () => {
    expect(parseEntryRef(" mcp/shared-slug ")).toEqual({
      category: "mcp",
      slug: "shared-slug",
    });
    expect(parseEntryRef("mcp")).toBeNull();
    expect(parseEntryRef("mcp/shared/extra")).toBeNull();
    expect(parseEntryRef("/shared-slug")).toBeNull();
    expect(parseEntryRef("mcp/")).toBeNull();
  });
});

describe("compare selection identity", () => {
  it("allows entries with the same slug from different categories", () => {
    const mcpEntry = identity("mcp", "shared-slug");
    const skillEntry = identity("skills", "shared-slug");

    const selected = toggleCompareItem([mcpEntry], skillEntry);

    expect(selected).toEqual([mcpEntry, skillEntry]);
    expect(hasCompareItem(selected, mcpEntry)).toBe(true);
    expect(hasCompareItem(selected, skillEntry)).toBe(true);
    expect(toggleCompareItem(selected, mcpEntry)).toEqual([skillEntry]);
  });

  it("serializes and hydrates category-qualified compare refs", () => {
    const entries = [
      identity("mcp", "shared-slug"),
      identity("skills", "shared-slug"),
      identity("hooks", "runner"),
      identity("commands", "deploy"),
    ];

    const resolved = resolveCompareParam(
      entries,
      "bad-ref,mcp/shared-slug,skills/shared-slug,mcp/shared-slug,missing/nope,hooks/runner,commands/deploy",
      3,
    );

    expect(resolved).toEqual([entries[0], entries[1], entries[2]]);
    expect(serializeCompareItems(resolved)).toBe(
      "mcp/shared-slug,skills/shared-slug,hooks/runner",
    );
  });
});

describe("related entry identity", () => {
  it("excludes only the exact entry in client related fallback results", () => {
    const anchor = registryEntry("mcp", "shared-slug", ["alpha"]);
    const exactSameEntry = registryEntry("mcp", "shared-slug", ["alpha"]);
    const sameSlugDifferentCategory = registryEntry("skills", "shared-slug", [
      "alpha",
    ]);
    const sameCategoryDifferentSlug = registryEntry("mcp", "runner", ["alpha"]);

    const related = relatedBySimilarity(
      anchor,
      [exactSameEntry, sameSlugDifferentCategory, sameCategoryDifferentSlug],
      3,
    );

    expect(related).not.toContain(exactSameEntry);
    expect(related).toEqual(
      expect.arrayContaining([
        sameSlugDifferentCategory,
        sameCategoryDifferentSlug,
      ]),
    );
  });

  it("excludes only the exact entry in detail related results", () => {
    const anchor = contentEntry("mcp", "shared-slug", ["alpha"]);
    const exactSameEntry = directoryEntry("mcp", "shared-slug", ["alpha"]);
    const sameSlugDifferentCategory = directoryEntry("skills", "shared-slug", [
      "alpha",
    ]);
    const sameCategoryDifferentSlug = directoryEntry("mcp", "runner", [
      "alpha",
    ]);

    const related = getRelatedEntries(anchor, [
      exactSameEntry,
      sameSlugDifferentCategory,
      sameCategoryDifferentSlug,
    ]);

    expect(related).not.toContain(exactSameEntry);
    expect(related).toEqual(
      expect.arrayContaining([
        sameSlugDifferentCategory,
        sameCategoryDifferentSlug,
      ]),
    );
  });
});
