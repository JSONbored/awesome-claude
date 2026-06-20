import { describe, expect, it } from "vitest";

import {
  findCoverageGaps,
  NON_INTENT_TAGS,
} from "../scripts/lib/coverage-gaps.mjs";

function e(category: string, tags: string[]) {
  return { category, tags };
}

describe("findCoverageGaps", () => {
  // "testing" appears 4x globally but never in hooks -> a hooks gap.
  const entries = [
    ...Array.from({ length: 4 }, () => e("guides", ["testing"])),
    e("hooks", ["formatting"]),
    e("hooks", ["formatting"]),
  ];

  it("surfaces high-demand intents that are thin/absent in a category", () => {
    const groups = findCoverageGaps(entries, {
      minDemand: 4,
      maxInCategory: 1,
      perCategory: 10,
    });
    const hooks = groups.find((g) => g.category === "hooks");
    expect(hooks).toBeDefined();
    const tags = hooks!.gaps.map((x) => x.tag);
    expect(tags).toContain("testing"); // 4 demand, 0 in hooks
    const testing = hooks!.gaps.find((x) => x.tag === "testing");
    expect(testing).toMatchObject({ demand: 4, inCategory: 0 });
  });

  it("ignores demand below the threshold and well-covered intents", () => {
    const groups = findCoverageGaps(entries, {
      minDemand: 5, // testing has demand 4 -> excluded
      maxInCategory: 1,
    });
    expect(groups.every((g) => g.gaps.every((x) => x.tag !== "testing"))).toBe(
      true,
    );
  });

  it("excludes platform/packaging/category mechanism tags", () => {
    const noisy = [
      ...Array.from({ length: 10 }, () => e("guides", ["claude-code"])),
      e("hooks", ["formatting"]),
    ];
    const groups = findCoverageGaps(noisy, { minDemand: 4 });
    expect(NON_INTENT_TAGS.has("claude-code")).toBe(true);
    expect(
      groups.every((g) => g.gaps.every((x) => x.tag !== "claude-code")),
    ).toBe(true);
  });

  it("is deterministic and grouped by category", () => {
    const opts = { minDemand: 4 };
    const a = findCoverageGaps(entries, opts);
    expect(a).toEqual(findCoverageGaps(entries, opts));
    expect(a.map((g) => g.category)).toEqual(
      [...a.map((g) => g.category)].sort(),
    );
  });
});
