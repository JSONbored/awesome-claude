import { describe, expect, it } from "vitest";

import { compareScoreLabel } from "../apps/web/src/lib/compare-score-label-lib";

describe("compareScoreLabel", () => {
  it("reports when no baseline is selected", () => {
    expect(compareScoreLabel(null)).toBe("No baseline selected");
  });

  it("prefixes a positive delta and keeps a negative delta", () => {
    expect(compareScoreLabel(5)).toBe("+5 vs baseline");
    expect(compareScoreLabel(-3)).toBe("-3 vs baseline");
  });

  it("reports parity at exactly zero", () => {
    expect(compareScoreLabel(0)).toBe("Score parity with baseline");
  });
});
