import { describe, expect, it } from "vitest";
import {
  compareCuratedActionBannerText,
  compareCuratedBannerTexts,
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

describe("compare-curated-summary-lib divergence and banner branches", () => {
  it("compareCuratedActionBannerText returns copy when actions diverge", () => {
    expect(compareCuratedActionBannerText(true)).toContain("Next steps differ");
  });

  it("compareCuratedDecisionBannerText uses the singular for one diverging signal", () => {
    const text = compareCuratedDecisionBannerText({
      divergingCount: 1,
      divergingLabels: ["trust"],
      comparedCount: 2,
    });
    expect(text).toBe("1 trust signal differ across this comparison (trust).");
  });

  it("compareCuratedDecisionBannerText uses the plural for multiple diverging signals", () => {
    const text = compareCuratedDecisionBannerText({
      divergingCount: 2,
      divergingLabels: ["trust", "safety"],
      comparedCount: 2,
    });
    expect(text).toBe(
      "2 trust signals differ across this comparison (trust, safety).",
    );
  });

  it("compareCuratedBannerTexts returns an array of banner strings", () => {
    const entries = [
      { category: "mcp", slug: "a", title: "A" },
      { category: "mcp", slug: "b", title: "B" },
    ];
    const texts = compareCuratedBannerTexts(entries as never);
    expect(Array.isArray(texts)).toBe(true);
    expect(texts.every((text) => typeof text === "string")).toBe(true);
  });
});
