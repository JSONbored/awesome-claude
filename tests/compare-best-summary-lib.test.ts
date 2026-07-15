import { describe, expect, it } from "vitest";
import {
  compareBestActionBannerText,
  compareBestBannerTexts,
  compareBestDecisionBannerText,
  compareBestListInteractiveLinkLabel,
  compareBestListInteractiveSearch,
  compareBestListPickRefs,
  compareBestSummary,
  shouldShowBestCompareSection,
} from "../apps/web/src/lib/compare-best-summary-lib";

describe("compare-best-summary-lib", () => {
  it("hides compare for single entry", () => {
    const entries = [{ category: "mcp", slug: "demo", title: "Demo" } as const];
    expect(shouldShowBestCompareSection(entries as never)).toBe(false);
  });
  it("shows compare for two entries", () => {
    const entries = [
      { category: "mcp", slug: "a", title: "A" },
      { category: "mcp", slug: "b", title: "B" },
    ];
    expect(shouldShowBestCompareSection(entries as never)).toBe(true);
  });
  it("compareBestSummary matrix 0", () => {
    const entries = [
      { category: "mcp", slug: "a-0", title: "A" },
      { category: "mcp", slug: "b-0", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 0", () => {
    const entries = [
      { category: "mcp", slug: "a-0", title: "A" },
      { category: "mcp", slug: "b-0", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 1", () => {
    const entries = [
      { category: "mcp", slug: "a-1", title: "A" },
      { category: "mcp", slug: "b-1", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 1", () => {
    const entries = [
      { category: "mcp", slug: "a-1", title: "A" },
      { category: "mcp", slug: "b-1", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 2", () => {
    const entries = [
      { category: "mcp", slug: "a-2", title: "A" },
      { category: "mcp", slug: "b-2", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 2", () => {
    const entries = [
      { category: "mcp", slug: "a-2", title: "A" },
      { category: "mcp", slug: "b-2", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 3", () => {
    const entries = [
      { category: "mcp", slug: "a-3", title: "A" },
      { category: "mcp", slug: "b-3", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 3", () => {
    const entries = [
      { category: "mcp", slug: "a-3", title: "A" },
      { category: "mcp", slug: "b-3", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 4", () => {
    const entries = [
      { category: "mcp", slug: "a-4", title: "A" },
      { category: "mcp", slug: "b-4", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 4", () => {
    const entries = [
      { category: "mcp", slug: "a-4", title: "A" },
      { category: "mcp", slug: "b-4", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 5", () => {
    const entries = [
      { category: "mcp", slug: "a-5", title: "A" },
      { category: "mcp", slug: "b-5", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 5", () => {
    const entries = [
      { category: "mcp", slug: "a-5", title: "A" },
      { category: "mcp", slug: "b-5", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 6", () => {
    const entries = [
      { category: "mcp", slug: "a-6", title: "A" },
      { category: "mcp", slug: "b-6", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 6", () => {
    const entries = [
      { category: "mcp", slug: "a-6", title: "A" },
      { category: "mcp", slug: "b-6", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 7", () => {
    const entries = [
      { category: "mcp", slug: "a-7", title: "A" },
      { category: "mcp", slug: "b-7", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 7", () => {
    const entries = [
      { category: "mcp", slug: "a-7", title: "A" },
      { category: "mcp", slug: "b-7", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 8", () => {
    const entries = [
      { category: "mcp", slug: "a-8", title: "A" },
      { category: "mcp", slug: "b-8", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 8", () => {
    const entries = [
      { category: "mcp", slug: "a-8", title: "A" },
      { category: "mcp", slug: "b-8", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 9", () => {
    const entries = [
      { category: "mcp", slug: "a-9", title: "A" },
      { category: "mcp", slug: "b-9", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 9", () => {
    const entries = [
      { category: "mcp", slug: "a-9", title: "A" },
      { category: "mcp", slug: "b-9", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 10", () => {
    const entries = [
      { category: "mcp", slug: "a-10", title: "A" },
      { category: "mcp", slug: "b-10", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 10", () => {
    const entries = [
      { category: "mcp", slug: "a-10", title: "A" },
      { category: "mcp", slug: "b-10", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 11", () => {
    const entries = [
      { category: "mcp", slug: "a-11", title: "A" },
      { category: "mcp", slug: "b-11", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 11", () => {
    const entries = [
      { category: "mcp", slug: "a-11", title: "A" },
      { category: "mcp", slug: "b-11", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 12", () => {
    const entries = [
      { category: "mcp", slug: "a-12", title: "A" },
      { category: "mcp", slug: "b-12", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 12", () => {
    const entries = [
      { category: "mcp", slug: "a-12", title: "A" },
      { category: "mcp", slug: "b-12", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 13", () => {
    const entries = [
      { category: "mcp", slug: "a-13", title: "A" },
      { category: "mcp", slug: "b-13", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 13", () => {
    const entries = [
      { category: "mcp", slug: "a-13", title: "A" },
      { category: "mcp", slug: "b-13", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 14", () => {
    const entries = [
      { category: "mcp", slug: "a-14", title: "A" },
      { category: "mcp", slug: "b-14", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 14", () => {
    const entries = [
      { category: "mcp", slug: "a-14", title: "A" },
      { category: "mcp", slug: "b-14", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 15", () => {
    const entries = [
      { category: "mcp", slug: "a-15", title: "A" },
      { category: "mcp", slug: "b-15", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 15", () => {
    const entries = [
      { category: "mcp", slug: "a-15", title: "A" },
      { category: "mcp", slug: "b-15", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 16", () => {
    const entries = [
      { category: "mcp", slug: "a-16", title: "A" },
      { category: "mcp", slug: "b-16", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 16", () => {
    const entries = [
      { category: "mcp", slug: "a-16", title: "A" },
      { category: "mcp", slug: "b-16", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 17", () => {
    const entries = [
      { category: "mcp", slug: "a-17", title: "A" },
      { category: "mcp", slug: "b-17", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 17", () => {
    const entries = [
      { category: "mcp", slug: "a-17", title: "A" },
      { category: "mcp", slug: "b-17", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 18", () => {
    const entries = [
      { category: "mcp", slug: "a-18", title: "A" },
      { category: "mcp", slug: "b-18", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 18", () => {
    const entries = [
      { category: "mcp", slug: "a-18", title: "A" },
      { category: "mcp", slug: "b-18", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 19", () => {
    const entries = [
      { category: "mcp", slug: "a-19", title: "A" },
      { category: "mcp", slug: "b-19", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 19", () => {
    const entries = [
      { category: "mcp", slug: "a-19", title: "A" },
      { category: "mcp", slug: "b-19", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 20", () => {
    const entries = [
      { category: "mcp", slug: "a-20", title: "A" },
      { category: "mcp", slug: "b-20", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 20", () => {
    const entries = [
      { category: "mcp", slug: "a-20", title: "A" },
      { category: "mcp", slug: "b-20", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 21", () => {
    const entries = [
      { category: "mcp", slug: "a-21", title: "A" },
      { category: "mcp", slug: "b-21", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 21", () => {
    const entries = [
      { category: "mcp", slug: "a-21", title: "A" },
      { category: "mcp", slug: "b-21", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 22", () => {
    const entries = [
      { category: "mcp", slug: "a-22", title: "A" },
      { category: "mcp", slug: "b-22", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 22", () => {
    const entries = [
      { category: "mcp", slug: "a-22", title: "A" },
      { category: "mcp", slug: "b-22", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 23", () => {
    const entries = [
      { category: "mcp", slug: "a-23", title: "A" },
      { category: "mcp", slug: "b-23", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 23", () => {
    const entries = [
      { category: "mcp", slug: "a-23", title: "A" },
      { category: "mcp", slug: "b-23", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 24", () => {
    const entries = [
      { category: "mcp", slug: "a-24", title: "A" },
      { category: "mcp", slug: "b-24", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 24", () => {
    const entries = [
      { category: "mcp", slug: "a-24", title: "A" },
      { category: "mcp", slug: "b-24", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 25", () => {
    const entries = [
      { category: "mcp", slug: "a-25", title: "A" },
      { category: "mcp", slug: "b-25", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 25", () => {
    const entries = [
      { category: "mcp", slug: "a-25", title: "A" },
      { category: "mcp", slug: "b-25", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 26", () => {
    const entries = [
      { category: "mcp", slug: "a-26", title: "A" },
      { category: "mcp", slug: "b-26", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 26", () => {
    const entries = [
      { category: "mcp", slug: "a-26", title: "A" },
      { category: "mcp", slug: "b-26", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 27", () => {
    const entries = [
      { category: "mcp", slug: "a-27", title: "A" },
      { category: "mcp", slug: "b-27", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 27", () => {
    const entries = [
      { category: "mcp", slug: "a-27", title: "A" },
      { category: "mcp", slug: "b-27", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 28", () => {
    const entries = [
      { category: "mcp", slug: "a-28", title: "A" },
      { category: "mcp", slug: "b-28", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 28", () => {
    const entries = [
      { category: "mcp", slug: "a-28", title: "A" },
      { category: "mcp", slug: "b-28", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 29", () => {
    const entries = [
      { category: "mcp", slug: "a-29", title: "A" },
      { category: "mcp", slug: "b-29", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 29", () => {
    const entries = [
      { category: "mcp", slug: "a-29", title: "A" },
      { category: "mcp", slug: "b-29", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 30", () => {
    const entries = [
      { category: "mcp", slug: "a-30", title: "A" },
      { category: "mcp", slug: "b-30", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 30", () => {
    const entries = [
      { category: "mcp", slug: "a-30", title: "A" },
      { category: "mcp", slug: "b-30", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 31", () => {
    const entries = [
      { category: "mcp", slug: "a-31", title: "A" },
      { category: "mcp", slug: "b-31", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 31", () => {
    const entries = [
      { category: "mcp", slug: "a-31", title: "A" },
      { category: "mcp", slug: "b-31", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 32", () => {
    const entries = [
      { category: "mcp", slug: "a-32", title: "A" },
      { category: "mcp", slug: "b-32", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 32", () => {
    const entries = [
      { category: "mcp", slug: "a-32", title: "A" },
      { category: "mcp", slug: "b-32", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 33", () => {
    const entries = [
      { category: "mcp", slug: "a-33", title: "A" },
      { category: "mcp", slug: "b-33", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 33", () => {
    const entries = [
      { category: "mcp", slug: "a-33", title: "A" },
      { category: "mcp", slug: "b-33", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 34", () => {
    const entries = [
      { category: "mcp", slug: "a-34", title: "A" },
      { category: "mcp", slug: "b-34", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 34", () => {
    const entries = [
      { category: "mcp", slug: "a-34", title: "A" },
      { category: "mcp", slug: "b-34", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 35", () => {
    const entries = [
      { category: "mcp", slug: "a-35", title: "A" },
      { category: "mcp", slug: "b-35", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 35", () => {
    const entries = [
      { category: "mcp", slug: "a-35", title: "A" },
      { category: "mcp", slug: "b-35", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 36", () => {
    const entries = [
      { category: "mcp", slug: "a-36", title: "A" },
      { category: "mcp", slug: "b-36", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 36", () => {
    const entries = [
      { category: "mcp", slug: "a-36", title: "A" },
      { category: "mcp", slug: "b-36", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 37", () => {
    const entries = [
      { category: "mcp", slug: "a-37", title: "A" },
      { category: "mcp", slug: "b-37", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 37", () => {
    const entries = [
      { category: "mcp", slug: "a-37", title: "A" },
      { category: "mcp", slug: "b-37", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 38", () => {
    const entries = [
      { category: "mcp", slug: "a-38", title: "A" },
      { category: "mcp", slug: "b-38", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 38", () => {
    const entries = [
      { category: "mcp", slug: "a-38", title: "A" },
      { category: "mcp", slug: "b-38", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 39", () => {
    const entries = [
      { category: "mcp", slug: "a-39", title: "A" },
      { category: "mcp", slug: "b-39", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 39", () => {
    const entries = [
      { category: "mcp", slug: "a-39", title: "A" },
      { category: "mcp", slug: "b-39", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 40", () => {
    const entries = [
      { category: "mcp", slug: "a-40", title: "A" },
      { category: "mcp", slug: "b-40", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 40", () => {
    const entries = [
      { category: "mcp", slug: "a-40", title: "A" },
      { category: "mcp", slug: "b-40", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 41", () => {
    const entries = [
      { category: "mcp", slug: "a-41", title: "A" },
      { category: "mcp", slug: "b-41", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 41", () => {
    const entries = [
      { category: "mcp", slug: "a-41", title: "A" },
      { category: "mcp", slug: "b-41", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 42", () => {
    const entries = [
      { category: "mcp", slug: "a-42", title: "A" },
      { category: "mcp", slug: "b-42", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 42", () => {
    const entries = [
      { category: "mcp", slug: "a-42", title: "A" },
      { category: "mcp", slug: "b-42", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 43", () => {
    const entries = [
      { category: "mcp", slug: "a-43", title: "A" },
      { category: "mcp", slug: "b-43", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 43", () => {
    const entries = [
      { category: "mcp", slug: "a-43", title: "A" },
      { category: "mcp", slug: "b-43", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 44", () => {
    const entries = [
      { category: "mcp", slug: "a-44", title: "A" },
      { category: "mcp", slug: "b-44", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 44", () => {
    const entries = [
      { category: "mcp", slug: "a-44", title: "A" },
      { category: "mcp", slug: "b-44", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 45", () => {
    const entries = [
      { category: "mcp", slug: "a-45", title: "A" },
      { category: "mcp", slug: "b-45", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 45", () => {
    const entries = [
      { category: "mcp", slug: "a-45", title: "A" },
      { category: "mcp", slug: "b-45", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 46", () => {
    const entries = [
      { category: "mcp", slug: "a-46", title: "A" },
      { category: "mcp", slug: "b-46", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 46", () => {
    const entries = [
      { category: "mcp", slug: "a-46", title: "A" },
      { category: "mcp", slug: "b-46", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 47", () => {
    const entries = [
      { category: "mcp", slug: "a-47", title: "A" },
      { category: "mcp", slug: "b-47", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 47", () => {
    const entries = [
      { category: "mcp", slug: "a-47", title: "A" },
      { category: "mcp", slug: "b-47", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 48", () => {
    const entries = [
      { category: "mcp", slug: "a-48", title: "A" },
      { category: "mcp", slug: "b-48", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 48", () => {
    const entries = [
      { category: "mcp", slug: "a-48", title: "A" },
      { category: "mcp", slug: "b-48", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 49", () => {
    const entries = [
      { category: "mcp", slug: "a-49", title: "A" },
      { category: "mcp", slug: "b-49", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 49", () => {
    const entries = [
      { category: "mcp", slug: "a-49", title: "A" },
      { category: "mcp", slug: "b-49", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 50", () => {
    const entries = [
      { category: "mcp", slug: "a-50", title: "A" },
      { category: "mcp", slug: "b-50", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 50", () => {
    const entries = [
      { category: "mcp", slug: "a-50", title: "A" },
      { category: "mcp", slug: "b-50", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 51", () => {
    const entries = [
      { category: "mcp", slug: "a-51", title: "A" },
      { category: "mcp", slug: "b-51", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 51", () => {
    const entries = [
      { category: "mcp", slug: "a-51", title: "A" },
      { category: "mcp", slug: "b-51", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 52", () => {
    const entries = [
      { category: "mcp", slug: "a-52", title: "A" },
      { category: "mcp", slug: "b-52", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 52", () => {
    const entries = [
      { category: "mcp", slug: "a-52", title: "A" },
      { category: "mcp", slug: "b-52", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 53", () => {
    const entries = [
      { category: "mcp", slug: "a-53", title: "A" },
      { category: "mcp", slug: "b-53", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 53", () => {
    const entries = [
      { category: "mcp", slug: "a-53", title: "A" },
      { category: "mcp", slug: "b-53", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 54", () => {
    const entries = [
      { category: "mcp", slug: "a-54", title: "A" },
      { category: "mcp", slug: "b-54", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 54", () => {
    const entries = [
      { category: "mcp", slug: "a-54", title: "A" },
      { category: "mcp", slug: "b-54", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 55", () => {
    const entries = [
      { category: "mcp", slug: "a-55", title: "A" },
      { category: "mcp", slug: "b-55", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 55", () => {
    const entries = [
      { category: "mcp", slug: "a-55", title: "A" },
      { category: "mcp", slug: "b-55", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 56", () => {
    const entries = [
      { category: "mcp", slug: "a-56", title: "A" },
      { category: "mcp", slug: "b-56", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 56", () => {
    const entries = [
      { category: "mcp", slug: "a-56", title: "A" },
      { category: "mcp", slug: "b-56", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 57", () => {
    const entries = [
      { category: "mcp", slug: "a-57", title: "A" },
      { category: "mcp", slug: "b-57", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 57", () => {
    const entries = [
      { category: "mcp", slug: "a-57", title: "A" },
      { category: "mcp", slug: "b-57", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 58", () => {
    const entries = [
      { category: "mcp", slug: "a-58", title: "A" },
      { category: "mcp", slug: "b-58", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 58", () => {
    const entries = [
      { category: "mcp", slug: "a-58", title: "A" },
      { category: "mcp", slug: "b-58", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 59", () => {
    const entries = [
      { category: "mcp", slug: "a-59", title: "A" },
      { category: "mcp", slug: "b-59", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 59", () => {
    const entries = [
      { category: "mcp", slug: "a-59", title: "A" },
      { category: "mcp", slug: "b-59", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 60", () => {
    const entries = [
      { category: "mcp", slug: "a-60", title: "A" },
      { category: "mcp", slug: "b-60", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 60", () => {
    const entries = [
      { category: "mcp", slug: "a-60", title: "A" },
      { category: "mcp", slug: "b-60", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 61", () => {
    const entries = [
      { category: "mcp", slug: "a-61", title: "A" },
      { category: "mcp", slug: "b-61", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 61", () => {
    const entries = [
      { category: "mcp", slug: "a-61", title: "A" },
      { category: "mcp", slug: "b-61", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 62", () => {
    const entries = [
      { category: "mcp", slug: "a-62", title: "A" },
      { category: "mcp", slug: "b-62", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 62", () => {
    const entries = [
      { category: "mcp", slug: "a-62", title: "A" },
      { category: "mcp", slug: "b-62", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 63", () => {
    const entries = [
      { category: "mcp", slug: "a-63", title: "A" },
      { category: "mcp", slug: "b-63", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 63", () => {
    const entries = [
      { category: "mcp", slug: "a-63", title: "A" },
      { category: "mcp", slug: "b-63", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 64", () => {
    const entries = [
      { category: "mcp", slug: "a-64", title: "A" },
      { category: "mcp", slug: "b-64", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 64", () => {
    const entries = [
      { category: "mcp", slug: "a-64", title: "A" },
      { category: "mcp", slug: "b-64", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 65", () => {
    const entries = [
      { category: "mcp", slug: "a-65", title: "A" },
      { category: "mcp", slug: "b-65", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 65", () => {
    const entries = [
      { category: "mcp", slug: "a-65", title: "A" },
      { category: "mcp", slug: "b-65", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 66", () => {
    const entries = [
      { category: "mcp", slug: "a-66", title: "A" },
      { category: "mcp", slug: "b-66", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 66", () => {
    const entries = [
      { category: "mcp", slug: "a-66", title: "A" },
      { category: "mcp", slug: "b-66", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 67", () => {
    const entries = [
      { category: "mcp", slug: "a-67", title: "A" },
      { category: "mcp", slug: "b-67", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 67", () => {
    const entries = [
      { category: "mcp", slug: "a-67", title: "A" },
      { category: "mcp", slug: "b-67", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 68", () => {
    const entries = [
      { category: "mcp", slug: "a-68", title: "A" },
      { category: "mcp", slug: "b-68", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 68", () => {
    const entries = [
      { category: "mcp", slug: "a-68", title: "A" },
      { category: "mcp", slug: "b-68", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 69", () => {
    const entries = [
      { category: "mcp", slug: "a-69", title: "A" },
      { category: "mcp", slug: "b-69", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 69", () => {
    const entries = [
      { category: "mcp", slug: "a-69", title: "A" },
      { category: "mcp", slug: "b-69", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 70", () => {
    const entries = [
      { category: "mcp", slug: "a-70", title: "A" },
      { category: "mcp", slug: "b-70", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 70", () => {
    const entries = [
      { category: "mcp", slug: "a-70", title: "A" },
      { category: "mcp", slug: "b-70", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 71", () => {
    const entries = [
      { category: "mcp", slug: "a-71", title: "A" },
      { category: "mcp", slug: "b-71", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 71", () => {
    const entries = [
      { category: "mcp", slug: "a-71", title: "A" },
      { category: "mcp", slug: "b-71", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 72", () => {
    const entries = [
      { category: "mcp", slug: "a-72", title: "A" },
      { category: "mcp", slug: "b-72", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 72", () => {
    const entries = [
      { category: "mcp", slug: "a-72", title: "A" },
      { category: "mcp", slug: "b-72", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 73", () => {
    const entries = [
      { category: "mcp", slug: "a-73", title: "A" },
      { category: "mcp", slug: "b-73", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 73", () => {
    const entries = [
      { category: "mcp", slug: "a-73", title: "A" },
      { category: "mcp", slug: "b-73", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 74", () => {
    const entries = [
      { category: "mcp", slug: "a-74", title: "A" },
      { category: "mcp", slug: "b-74", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 74", () => {
    const entries = [
      { category: "mcp", slug: "a-74", title: "A" },
      { category: "mcp", slug: "b-74", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 75", () => {
    const entries = [
      { category: "mcp", slug: "a-75", title: "A" },
      { category: "mcp", slug: "b-75", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 75", () => {
    const entries = [
      { category: "mcp", slug: "a-75", title: "A" },
      { category: "mcp", slug: "b-75", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 76", () => {
    const entries = [
      { category: "mcp", slug: "a-76", title: "A" },
      { category: "mcp", slug: "b-76", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 76", () => {
    const entries = [
      { category: "mcp", slug: "a-76", title: "A" },
      { category: "mcp", slug: "b-76", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 77", () => {
    const entries = [
      { category: "mcp", slug: "a-77", title: "A" },
      { category: "mcp", slug: "b-77", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 77", () => {
    const entries = [
      { category: "mcp", slug: "a-77", title: "A" },
      { category: "mcp", slug: "b-77", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 78", () => {
    const entries = [
      { category: "mcp", slug: "a-78", title: "A" },
      { category: "mcp", slug: "b-78", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 78", () => {
    const entries = [
      { category: "mcp", slug: "a-78", title: "A" },
      { category: "mcp", slug: "b-78", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 79", () => {
    const entries = [
      { category: "mcp", slug: "a-79", title: "A" },
      { category: "mcp", slug: "b-79", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 79", () => {
    const entries = [
      { category: "mcp", slug: "a-79", title: "A" },
      { category: "mcp", slug: "b-79", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 80", () => {
    const entries = [
      { category: "mcp", slug: "a-80", title: "A" },
      { category: "mcp", slug: "b-80", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 80", () => {
    const entries = [
      { category: "mcp", slug: "a-80", title: "A" },
      { category: "mcp", slug: "b-80", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 81", () => {
    const entries = [
      { category: "mcp", slug: "a-81", title: "A" },
      { category: "mcp", slug: "b-81", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 81", () => {
    const entries = [
      { category: "mcp", slug: "a-81", title: "A" },
      { category: "mcp", slug: "b-81", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 82", () => {
    const entries = [
      { category: "mcp", slug: "a-82", title: "A" },
      { category: "mcp", slug: "b-82", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 82", () => {
    const entries = [
      { category: "mcp", slug: "a-82", title: "A" },
      { category: "mcp", slug: "b-82", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 83", () => {
    const entries = [
      { category: "mcp", slug: "a-83", title: "A" },
      { category: "mcp", slug: "b-83", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 83", () => {
    const entries = [
      { category: "mcp", slug: "a-83", title: "A" },
      { category: "mcp", slug: "b-83", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 84", () => {
    const entries = [
      { category: "mcp", slug: "a-84", title: "A" },
      { category: "mcp", slug: "b-84", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 84", () => {
    const entries = [
      { category: "mcp", slug: "a-84", title: "A" },
      { category: "mcp", slug: "b-84", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 85", () => {
    const entries = [
      { category: "mcp", slug: "a-85", title: "A" },
      { category: "mcp", slug: "b-85", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 85", () => {
    const entries = [
      { category: "mcp", slug: "a-85", title: "A" },
      { category: "mcp", slug: "b-85", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 86", () => {
    const entries = [
      { category: "mcp", slug: "a-86", title: "A" },
      { category: "mcp", slug: "b-86", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 86", () => {
    const entries = [
      { category: "mcp", slug: "a-86", title: "A" },
      { category: "mcp", slug: "b-86", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 87", () => {
    const entries = [
      { category: "mcp", slug: "a-87", title: "A" },
      { category: "mcp", slug: "b-87", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 87", () => {
    const entries = [
      { category: "mcp", slug: "a-87", title: "A" },
      { category: "mcp", slug: "b-87", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 88", () => {
    const entries = [
      { category: "mcp", slug: "a-88", title: "A" },
      { category: "mcp", slug: "b-88", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 88", () => {
    const entries = [
      { category: "mcp", slug: "a-88", title: "A" },
      { category: "mcp", slug: "b-88", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 89", () => {
    const entries = [
      { category: "mcp", slug: "a-89", title: "A" },
      { category: "mcp", slug: "b-89", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 89", () => {
    const entries = [
      { category: "mcp", slug: "a-89", title: "A" },
      { category: "mcp", slug: "b-89", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 90", () => {
    const entries = [
      { category: "mcp", slug: "a-90", title: "A" },
      { category: "mcp", slug: "b-90", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 90", () => {
    const entries = [
      { category: "mcp", slug: "a-90", title: "A" },
      { category: "mcp", slug: "b-90", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 91", () => {
    const entries = [
      { category: "mcp", slug: "a-91", title: "A" },
      { category: "mcp", slug: "b-91", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 91", () => {
    const entries = [
      { category: "mcp", slug: "a-91", title: "A" },
      { category: "mcp", slug: "b-91", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 92", () => {
    const entries = [
      { category: "mcp", slug: "a-92", title: "A" },
      { category: "mcp", slug: "b-92", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 92", () => {
    const entries = [
      { category: "mcp", slug: "a-92", title: "A" },
      { category: "mcp", slug: "b-92", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 93", () => {
    const entries = [
      { category: "mcp", slug: "a-93", title: "A" },
      { category: "mcp", slug: "b-93", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 93", () => {
    const entries = [
      { category: "mcp", slug: "a-93", title: "A" },
      { category: "mcp", slug: "b-93", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 94", () => {
    const entries = [
      { category: "mcp", slug: "a-94", title: "A" },
      { category: "mcp", slug: "b-94", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 94", () => {
    const entries = [
      { category: "mcp", slug: "a-94", title: "A" },
      { category: "mcp", slug: "b-94", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 95", () => {
    const entries = [
      { category: "mcp", slug: "a-95", title: "A" },
      { category: "mcp", slug: "b-95", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 95", () => {
    const entries = [
      { category: "mcp", slug: "a-95", title: "A" },
      { category: "mcp", slug: "b-95", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 96", () => {
    const entries = [
      { category: "mcp", slug: "a-96", title: "A" },
      { category: "mcp", slug: "b-96", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 96", () => {
    const entries = [
      { category: "mcp", slug: "a-96", title: "A" },
      { category: "mcp", slug: "b-96", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 97", () => {
    const entries = [
      { category: "mcp", slug: "a-97", title: "A" },
      { category: "mcp", slug: "b-97", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 97", () => {
    const entries = [
      { category: "mcp", slug: "a-97", title: "A" },
      { category: "mcp", slug: "b-97", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 98", () => {
    const entries = [
      { category: "mcp", slug: "a-98", title: "A" },
      { category: "mcp", slug: "b-98", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 98", () => {
    const entries = [
      { category: "mcp", slug: "a-98", title: "A" },
      { category: "mcp", slug: "b-98", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
  it("compareBestSummary matrix 99", () => {
    const entries = [
      { category: "mcp", slug: "a-99", title: "A" },
      { category: "mcp", slug: "b-99", title: "B" },
    ];
    expect(compareBestSummary(entries as never).comparedCount).toBe(2);
  });
  it("compareBestBannerTexts matrix 99", () => {
    const entries = [
      { category: "mcp", slug: "a-99", title: "A" },
      { category: "mcp", slug: "b-99", title: "B" },
    ];
    expect(Array.isArray(compareBestBannerTexts(entries as never))).toBe(true);
  });
});

describe("compare-best-summary-lib delegators", () => {
  const twoEntries = [
    { category: "mcp", slug: "a", title: "A" },
    { category: "mcp", slug: "b", title: "B" },
  ];

  it("compareBestBannerTexts is empty when there is nothing to compare", () => {
    expect(
      compareBestBannerTexts([
        { category: "mcp", slug: "a", title: "A" },
      ] as never),
    ).toEqual([]);
  });

  it("compareBestDecisionBannerText delegates to the surface decision banner", () => {
    const banner = compareBestDecisionBannerText(twoEntries as never);
    expect(banner === null || typeof banner === "string").toBe(true);
  });

  it("compareBestActionBannerText is null unless next-step actions diverge", () => {
    expect(compareBestActionBannerText(false)).toBeNull();
    expect(compareBestActionBannerText(true)).toContain("Next steps differ");
  });

  it("compareBestListPickRefs maps pick refs", () => {
    expect(
      compareBestListPickRefs([{ ref: "mcp/a" }, { ref: "mcp/b" }]),
    ).toEqual(["mcp/a", "mcp/b"]);
  });

  it("compareBestListInteractiveSearch resolves matching picks and skips the rest", () => {
    const catalog = [
      { category: "mcp", slug: "a" },
      { category: "mcp", slug: "b" },
    ];
    const search = compareBestListInteractiveSearch(
      [{ ref: "mcp/a" }, { ref: "mcp/b" }],
      catalog,
    );
    expect(typeof search?.ids).toBe("string");
    // A single resolved pick is below the interactive minimum, so it is null.
    expect(
      compareBestListInteractiveSearch([{ ref: "mcp/a" }], catalog),
    ).toBeNull();
  });

  it("compareBestListInteractiveLinkLabel scales with the resolved pick count", () => {
    const catalog = [
      { category: "mcp", slug: "a" },
      { category: "mcp", slug: "b" },
      { category: "mcp", slug: "c" },
    ];
    expect(
      compareBestListInteractiveLinkLabel(
        [{ ref: "mcp/a" }, { ref: "mcp/b" }],
        catalog,
      ),
    ).toBe("Open interactively");
    expect(
      compareBestListInteractiveLinkLabel(
        [{ ref: "mcp/a" }, { ref: "mcp/b" }, { ref: "mcp/c" }],
        catalog,
      ),
    ).toBe("Open 3 picks in the interactive comparison tool");
  });
});
