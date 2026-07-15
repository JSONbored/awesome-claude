/**
 * Pure validators expertise filter analytics helpers.
 *
 * Maps coverage-area filter chip clicks to privacy-light event names without
 * embedding coverage copy or entry titles.
 */

export const VALIDATORS_EXPERTISE_SURFACE = "validators-expertise";

export function validatorsExpertiseFilterAnalyticsEvent(): string {
  return "validators_expertise_filter_click";
}

export function validatorsExpertiseFilterAnalyticsData(
  expertiseId: string,
  matchCount: number,
  expertiseCount: number,
) {
  return {
    surface: VALIDATORS_EXPERTISE_SURFACE,
    expertiseId,
    matchCount,
    expertiseCount,
  };
}
