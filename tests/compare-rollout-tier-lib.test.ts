import { describe, expect, it } from "vitest";

import { tierClass } from "../apps/web/src/lib/compare-rollout-tier-lib";

describe("tierClass", () => {
  it("maps ready/hold/review to trusted/blocked/amber classes", () => {
    expect(tierClass("ready")).toContain("text-trust-trusted");
    expect(tierClass("hold")).toContain("text-trust-blocked");
    expect(tierClass("review")).toContain("text-amber-900");
  });
});
