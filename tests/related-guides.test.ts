import { describe, expect, it } from "vitest";

import { relatedGuides } from "../apps/web/src/data/search";
import { ENTRIES } from "../apps/web/src/data/entries";
import type { Entry } from "../apps/web/src/types/registry";

const guideSlugs = new Set(
  ENTRIES.filter((e) => e.category === "guides").map((e) => e.slug),
);

function entry(partial: Partial<Entry>): Entry {
  return {
    category: "commands",
    slug: "x",
    tags: [],
    ...partial,
  } as Entry;
}

describe("relatedGuides", () => {
  it("returns only guide-category entries", () => {
    const tag = ENTRIES.find(
      (e) => e.category === "guides" && e.tags.length > 0,
    )?.tags[0];
    expect(tag).toBeDefined();
    const guides = relatedGuides(entry({ tags: [tag as string] }), 5);
    expect(guides.length).toBeGreaterThan(0);
    for (const g of guides) {
      expect(g.category).toBe("guides");
      expect(guideSlugs.has(g.slug)).toBe(true);
    }
  });

  it("requires at least one shared tag (no overlap -> empty, no noise)", () => {
    expect(relatedGuides(entry({ tags: [] }))).toEqual([]);
    expect(relatedGuides(entry({ tags: ["zzz-nonexistent-tag-zzz"] }))).toEqual(
      [],
    );
  });

  it("ranks by tag overlap and respects the limit", () => {
    // Pick a real guide and feed its tags back in: it should rank highly.
    const guide = ENTRIES.find(
      (e) => e.category === "guides" && e.tags.length >= 2,
    );
    expect(guide).toBeDefined();
    const result = relatedGuides(
      entry({ slug: "probe", tags: guide!.tags.slice(0, 3) }),
      3,
    );
    expect(result.length).toBeGreaterThan(0);
    expect(result.length).toBeLessThanOrEqual(3);
    expect(result.map((g) => g.slug)).toContain(guide!.slug);
  });

  it("excludes the entry itself for a guide page", () => {
    const guide = ENTRIES.find(
      (e) => e.category === "guides" && e.tags.length > 0,
    )!;
    const result = relatedGuides(guide, 10);
    expect(result.some((g) => g.slug === guide.slug)).toBe(false);
  });

  it("is deterministic", () => {
    const input = entry({ tags: ["security", "testing", "automation"] });
    expect(relatedGuides(input)).toEqual(relatedGuides(input));
  });
});
