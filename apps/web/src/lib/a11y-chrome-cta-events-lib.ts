/**
 * Pure a11y chrome navigation analytics helpers.
 *
 * Maps skip-link activation and peek-hint dismiss actions to privacy-light
 * event names without embedding page path or coach-mark copy.
 */

export const SKIP_LINK_SURFACE = "skip-link";
export const PEEK_HINT_SURFACE = "peek-hint";

export type PeekHintDismissReason = "button" | "timeout" | "hotkey";

export function skipLinkAnalyticsEvent(): string {
  return "skip_link_click";
}

export function skipLinkAnalyticsData() {
  return {
    surface: SKIP_LINK_SURFACE,
  };
}

export function peekHintDismissAnalyticsEvent(): string {
  return "peek_hint_dismiss_click";
}

export function peekHintDismissAnalyticsData(reason: PeekHintDismissReason) {
  return {
    surface: PEEK_HINT_SURFACE,
    reason,
  };
}
