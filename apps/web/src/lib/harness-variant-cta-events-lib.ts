/**
 * Pure harness variant selection analytics helpers.
 *
 * Maps harness picker interactions to privacy-light event names without
 * embedding snippet payloads.
 */

import type { Harness } from "@/types/registry";

export function harnessVariantSelectAnalyticsEvent(): string {
  return "harness_variant_select";
}

export function harnessVariantSelectAnalyticsData(
  category: string,
  slug: string,
  surface: string,
  harness: Harness,
) {
  return {
    entry: `${category}/${slug}`,
    surface,
    harness,
  };
}
