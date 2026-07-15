/**
 * Pure hover chevrons navigation analytics helpers.
 *
 * Maps horizontal scroll nudges to privacy-light event names without embedding
 * page path or scrolled child content.
 */

export const HOVER_CHEVRONS_SURFACE = "hover-chevrons";

export type HoverChevronsDirection = "left" | "right";

export function hoverChevronsScrollAnalyticsEvent(): string {
  return "hover_chevrons_scroll_click";
}

export function hoverChevronsScrollAnalyticsData(direction: HoverChevronsDirection) {
  return {
    surface: HOVER_CHEVRONS_SURFACE,
    direction,
  };
}
