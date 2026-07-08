// Pure coercion of a submitted tool-listing tier, split out of the tools submit
// route so the allowlist + default can be unit-tested.

export const TOOL_LISTING_TIERS = ["featured", "sponsored"] as const;
export type ToolListingTier = (typeof TOOL_LISTING_TIERS)[number];

/** Coerce a raw form value to a valid tool-listing tier, defaulting to "featured". */
export function toolListingTierInterest(raw: FormDataEntryValue | null): ToolListingTier {
  const value = String(raw ?? "featured");
  return TOOL_LISTING_TIERS.includes(value as ToolListingTier)
    ? (value as ToolListingTier)
    : "featured";
}
