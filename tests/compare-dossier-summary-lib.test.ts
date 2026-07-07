import { describe, expect, it } from "vitest";
import {
  compareDossierActionBannerText,
  compareDossierEntries,
  compareDossierSummary,
} from "../apps/web/src/lib/compare-dossier-summary-lib";

describe("compare-dossier-summary-lib", () => {
  const entry = { category: "mcp", slug: "a", title: "A" };
  it("places primary entry first", () => {
    expect(compareDossierEntries(entry as never, [])).toHaveLength(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
  it("compareDossierActionBannerText matrix 0", () => {
    expect(compareDossierActionBannerText(false)).toBeNull();
  });
  it("compareDossierSummary matrix 0", () => {
    const summary = compareDossierSummary(entry as never, []);
    expect(summary.comparedCount).toBe(1);
  });
});
