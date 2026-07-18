/**
 * Pure how-it-works step navigation analytics helpers.
 *
 * Maps home how-it-works step cards to privacy-light event names without
 * embedding titles, body copy, or free-form search queries.
 */

export const HOW_IT_WORKS_SURFACE = "how-it-works";

export type HowItWorksStepId = "search" | "inspect" | "copy";
export type HowItWorksDestination = "browse" | "quality" | "platforms";

export function howItWorksStepAnalyticsEvent(): string {
  return "how_it_works_step_click";
}

export function howItWorksStepAnalyticsData(
  stepId: HowItWorksStepId,
  destination: HowItWorksDestination,
  stepIndex: number,
  stepCount: number,
) {
  return {
    surface: HOW_IT_WORKS_SURFACE,
    stepId,
    destination,
    stepIndex,
    stepCount,
  };
}

export type HowItWorksStepRouteDestination = { to: "/browse" | "/quality" | "/platforms" };

/** Map a how-it-works step id to an in-app route. */
export function howItWorksStepDestination(stepId: string): HowItWorksStepRouteDestination | null {
  switch (stepId) {
    case "search":
      return { to: "/browse" };
    case "inspect":
      return { to: "/quality" };
    case "copy":
      return { to: "/platforms" };
    default:
      return null;
  }
}
