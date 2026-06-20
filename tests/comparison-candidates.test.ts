import { describe, expect, it } from "vitest";

import {
  findComparisonCandidates,
  pairKey,
} from "../scripts/lib/comparison-candidates.mjs";
import { COMPARISONS } from "../apps/web/src/data/comparisons";
import { ENTRIES } from "../apps/web/src/data/entries";

function entry(
  category: string,
  slug: string,
  tags: string[],
  relatedEntries: Array<{
    category: string;
    slug: string;
    relation: string;
  }> = [],
) {
  return { category, slug, tags, relatedEntries };
}

describe("findComparisonCandidates", () => {
  it("surfaces same-category pairs with enough tag overlap; excludes weak + cross-category", () => {
    const entries = [
      entry("mcp", "a", ["x", "y", "z", "w"]),
      entry("mcp", "b", ["x", "y", "z", "w"]), // 4 shared with a
      entry("mcp", "c", ["x", "y"]), // only 2 shared -> below minOverlap
      entry("hooks", "d", ["x", "y", "z", "w"]), // cross-category
    ];
    const pairs = findComparisonCandidates(entries, new Set(), {
      minOverlap: 3,
    }).map((c) => c.pair.join("|"));
    expect(pairs).toContain("mcp/a|mcp/b");
    expect(pairs.some((p) => p.includes("mcp/c"))).toBe(false);
    expect(pairs.some((p) => p.includes("hooks/d"))).toBe(false);
  });

  it("excludes pairs already covered by a comparison page", () => {
    const entries = [
      entry("mcp", "a", ["x", "y", "z"]),
      entry("mcp", "b", ["x", "y", "z"]),
    ];
    const covered = new Set([pairKey("mcp/a", "mcp/b")]);
    expect(
      findComparisonCandidates(entries, covered, { minOverlap: 3 }),
    ).toEqual([]);
  });

  it("includes + boosts explicit alternative relations even below the tag threshold", () => {
    const entries = [
      entry(
        "mcp",
        "a",
        ["x"],
        [{ category: "mcp", slug: "b", relation: "alternative" }],
      ),
      entry("mcp", "b", ["x"]),
    ];
    const candidates = findComparisonCandidates(entries, new Set(), {
      minOverlap: 3,
    });
    expect(candidates).toHaveLength(1);
    expect(candidates[0].isAlternative).toBe(true);
    expect(candidates[0].score).toBeGreaterThan(1);
  });

  it("is deterministic", () => {
    const entries = [
      entry("mcp", "a", ["x", "y", "z"]),
      entry("mcp", "b", ["x", "y", "z"]),
      entry("mcp", "c", ["x", "y", "z"]),
    ];
    const opts = { minOverlap: 3 };
    expect(findComparisonCandidates(entries, new Set(), opts)).toEqual(
      findComparisonCandidates(entries, new Set(), opts),
    );
  });
});

describe("comparison pages", () => {
  const refSet = new Set(ENTRIES.map((e) => `${e.category}/${e.slug}`));

  it("every comparison resolves at least 2 entries (route requirement)", () => {
    for (const comparison of COMPARISONS) {
      const resolved = comparison.refs.filter((ref) => refSet.has(ref));
      expect(resolved.length, comparison.slug).toBeGreaterThanOrEqual(2);
    }
  });

  it("comparison slugs are unique", () => {
    const slugs = COMPARISONS.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("includes the new demand-backed batch", () => {
    const slugs = new Set(COMPARISONS.map((c) => c.slug));
    for (const slug of [
      "llm-observability-mcp-servers",
      "paas-deployment-mcp-servers",
      "mcp-gateway-servers",
    ]) {
      expect(slugs.has(slug)).toBe(true);
    }
  });
});
