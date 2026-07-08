import { describe, expect, it } from "vitest";

import { toolListingTierInterest } from "../apps/web/src/lib/tool-listing-tier-lib";

describe("toolListingTierInterest", () => {
  it("defaults to 'featured' for null or unknown values", () => {
    expect(toolListingTierInterest(null)).toBe("featured");
    expect(toolListingTierInterest("enterprise")).toBe("featured");
  });

  it("passes through an allow-listed tier", () => {
    expect(toolListingTierInterest("featured")).toBe("featured");
    expect(toolListingTierInterest("sponsored")).toBe("sponsored");
  });
});
