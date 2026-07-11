/**
 * Pure app shell back-to-top analytics helpers.
 *
 * Maps the global floating back-to-top control to privacy-light event names
 * without embedding route paths, titles, or other page content.
 */

export const APP_SHELL_BACK_TO_TOP_SURFACE = "app-shell-back-to-top";

export function appShellBackToTopScrollProgress(
  scrollY: number,
  scrollHeight: number,
  innerHeight: number,
): number {
  const max = scrollHeight - innerHeight;
  if (max <= 0) return 0;
  return Math.round(Math.min(100, Math.max(0, (scrollY / max) * 100)));
}

export function appShellBackToTopAnalyticsEvent(): string {
  return "app_shell_back_to_top_click";
}

export function appShellBackToTopAnalyticsData(scrollProgress: number) {
  return {
    surface: APP_SHELL_BACK_TO_TOP_SURFACE,
    scrollProgress: Math.round(scrollProgress),
  };
}
