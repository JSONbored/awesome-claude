import { describe, expect, it } from "vitest";

import type { Entry } from "@/types/registry";
import {
  buildTagGroups,
  computeRelatedTags,
  filterIndexableTagGroups,
  findTagGroup,
  tagSlug,
} from "../apps/web/src/lib/tags-lib";

function entry(slug: string, tags: string[]): Entry {
  return {
    category: "mcp",
    slug,
    title: slug,
    description: "d",
    author: "a",
    tags,
    platforms: ["claude-code"],
    installType: "manual",
    trust: "review",
    source: "unverified",
    dateAdded: "2026-01-01",
  } as Entry;
}

describe("tagSlug", () => {
  it("lowercases, trims, and slugs non-alphanumeric runs", () => {
    expect(tagSlug("AI Tools")).toBe("ai-tools");
    expect(tagSlug("  Foo  ")).toBe("foo");
    expect(tagSlug("C++ / Rust")).toBe("c-rust");
  });

  it("strips leading/trailing separators and is empty for symbol-only input", () => {
    expect(tagSlug("--Hello--")).toBe("hello");
    expect(tagSlug("!!!")).toBe("");
  });
});

describe("buildTagGroups", () => {
  it("groups entries by slug and sorts by group size descending", () => {
    const groups = buildTagGroups([
      entry("a", ["AI", "cli"]),
      entry("b", ["AI"]),
      entry("c", ["cli", "AI"]),
    ]);
    // "ai" has 3 entries, "cli" has 2 → ai first.
    expect(groups.map((g) => [g.slug, g.entries.length])).toEqual([
      ["ai", 3],
      ["cli", 2],
    ]);
  });

  it("counts an entry once per slug even when it carries same-slug raw tags", () => {
    const groups = buildTagGroups([entry("a", ["AI", "ai", "A.I."])]);
    const ai = findTagGroup(groups, "ai");
    expect(ai?.entries).toHaveLength(1);
  });

  it("picks the most frequent raw casing as the canonical group name", () => {
    const groups = buildTagGroups([
      entry("a", ["AI"]),
      entry("b", ["AI"]),
      entry("c", ["ai"]),
    ]);
    expect(findTagGroup(groups, "ai")?.name).toBe("AI");
  });

  it("ignores empty/symbol-only tags", () => {
    const groups = buildTagGroups([entry("a", ["", "!!!", "Valid"])]);
    expect(groups.map((g) => g.slug)).toEqual(["valid"]);
  });
});

describe("filterIndexableTagGroups", () => {
  it("keeps only groups with at least two entries", () => {
    const groups = buildTagGroups([
      entry("a", ["shared", "solo"]),
      entry("b", ["shared"]),
    ]);
    expect(filterIndexableTagGroups(groups).map((g) => g.slug)).toEqual([
      "shared",
    ]);
  });
});

describe("computeRelatedTags", () => {
  const groups = buildTagGroups([
    entry("a", ["ai", "cli", "web"]),
    entry("b", ["ai", "cli"]),
    entry("c", ["ai", "web"]),
    entry("d", ["web"]),
  ]);

  it("returns [] for an unknown slug", () => {
    expect(computeRelatedTags(groups, "missing")).toEqual([]);
  });

  it("ranks co-occurring indexable tags by count and excludes the tag itself", () => {
    // Within the "ai" group (a,b,c): cli co-occurs 2x, web 2x — both indexable (>=2 entries).
    const related = computeRelatedTags(groups, "ai").map((g) => g.slug);
    expect(related).toContain("cli");
    expect(related).toContain("web");
    expect(related).not.toContain("ai");
  });

  it("honors the limit", () => {
    expect(computeRelatedTags(groups, "ai", 1)).toHaveLength(1);
  });
});
