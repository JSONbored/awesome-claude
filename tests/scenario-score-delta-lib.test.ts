import { describe, expect, it } from "vitest";

import { scoreDeltaText } from "../apps/web/src/lib/scenario-score-delta-lib";

describe("scoreDeltaText", () => {
  it("labels a zero delta as the top score", () => {
    expect(scoreDeltaText(0)).toBe("Top score");
  });

  it("prefixes a positive delta with '+'", () => {
    expect(scoreDeltaText(4)).toBe("+4");
  });

  it("renders a negative delta as the raw number", () => {
    expect(scoreDeltaText(-3)).toBe("-3");
  });
});
