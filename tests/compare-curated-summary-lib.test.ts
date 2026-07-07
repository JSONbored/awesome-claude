import { describe, expect, it } from "vitest";
import {
  compareCuratedActionBannerText,
  compareCuratedDecisionBannerText,
  compareCuratedSummary,
} from "../apps/web/src/lib/compare-curated-summary-lib";

describe("compare-curated-summary-lib", () => {
  const entries = [{ category: "mcp", slug: "a", title: "A" }];
  it("summarizes curated comparison", () => {
    expect(compareCuratedSummary(entries as never).comparedCount).toBe(1);
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
  it("compareCuratedActionBannerText matrix 0", () => {
    expect(compareCuratedActionBannerText(false)).toBeNull();
  });
  it("compareCuratedDecisionBannerText matrix 0", () => {
    expect(
      compareCuratedDecisionBannerText({
        divergingCount: 0,
        divergingLabels: [],
        comparedCount: 1,
      }),
    ).toBeNull();
  });
});
