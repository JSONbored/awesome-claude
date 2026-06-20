import { describe, expect, it } from "vitest";

import {
  BEST_LIST_EDITORIAL,
  getBestListEditorial,
} from "../apps/web/src/data/best-list-editorial";
import { BEST_LISTS } from "../apps/web/src/data/entries";
import { seoClusterDefinitions } from "../apps/web/src/data/seo-cluster-definitions";

describe("best-list editorial overrides (#3922)", () => {
  const clusterSlugs = new Set(seoClusterDefinitions.map((c) => c.slug));

  it("every override targets a real best-list cluster", () => {
    for (const editorial of BEST_LIST_EDITORIAL) {
      expect(clusterSlugs.has(editorial.slug), editorial.slug).toBe(true);
    }
  });

  it("each override has a short answer and decision criteria", () => {
    for (const editorial of BEST_LIST_EDITORIAL) {
      expect(editorial.shortAnswer.length).toBeGreaterThan(60);
      expect(editorial.decisionCriteria.length).toBeGreaterThanOrEqual(3);
      for (const criterion of editorial.decisionCriteria) {
        expect(criterion.label.length).toBeGreaterThan(0);
        expect(criterion.detail.length).toBeGreaterThan(20);
      }
    }
  });

  it("avoids unmeasured popularity/rating claims", () => {
    for (const editorial of BEST_LIST_EDITORIAL) {
      const blob = [
        editorial.shortAnswer,
        ...editorial.decisionCriteria.map((c) => c.detail),
      ]
        .join(" ")
        .toLowerCase();
      for (const banned of [
        "most popular",
        "#1",
        "best-rated",
        "highest rated",
      ]) {
        expect(blob, banned).not.toContain(banned);
      }
    }
  });

  it("getBestListEditorial returns overrides only for seeded slugs", () => {
    expect(getBestListEditorial("claude-code-hooks")).toBeDefined();
    expect(getBestListEditorial("not-a-real-list")).toBeUndefined();
  });

  it("seeded best-lists exist and still render without the override (generated fallback)", () => {
    const bestSlugs = new Set(BEST_LISTS.map((b) => b.slug));
    for (const editorial of BEST_LIST_EDITORIAL) {
      expect(bestSlugs.has(editorial.slug), editorial.slug).toBe(true);
    }
    // A list with no override is still a valid best list.
    const ungoverned = BEST_LISTS.find((b) => !getBestListEditorial(b.slug));
    expect(ungoverned).toBeDefined();
  });
});
