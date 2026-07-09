import { describe, expect, it } from "vitest";

import { trendingReasonCodes } from "../apps/web/src/lib/trending-reason-codes-lib";

describe("trendingReasonCodes", () => {
  it("returns both codes when both signals are set", () => {
    expect(
      trendingReasonCodes({
        firstPartyPackage: true,
        productionVerified: true,
      }),
    ).toEqual(["first_party_package", "production_verified"]);
  });

  it("returns only the set signal's code", () => {
    expect(
      trendingReasonCodes({
        firstPartyPackage: true,
        productionVerified: false,
      }),
    ).toEqual(["first_party_package"]);
    expect(
      trendingReasonCodes({
        firstPartyPackage: false,
        productionVerified: true,
      }),
    ).toEqual(["production_verified"]);
  });

  it("returns an empty list when neither signal is set", () => {
    expect(
      trendingReasonCodes({
        firstPartyPackage: false,
        productionVerified: false,
      }),
    ).toEqual([]);
  });
});
