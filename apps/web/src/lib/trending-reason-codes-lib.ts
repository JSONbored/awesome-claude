// Pure mapping of an entry's trend signals to its reason codes, split out of
// the registry trending route so the code selection can be unit-tested.

/** Reason codes for the trend signals present on an entry (order preserved). */
export function trendingReasonCodes(signals: {
  firstPartyPackage: boolean;
  productionVerified: boolean;
}): string[] {
  return [
    signals.firstPartyPackage ? "first_party_package" : "",
    signals.productionVerified ? "production_verified" : "",
  ].filter(Boolean);
}
