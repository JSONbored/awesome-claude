/**
 * Pure app-shell navigation analytics helpers.
 *
 * Maps top-bar, mobile menu, footer, and feed-chip egress to privacy-light
 * event names without embedding button labels or free text.
 */

export const APP_SHELL_SURFACE = "app-shell";

export type AppShellNavSource = "desktop" | "mobile";

export type AppShellFeedChip = "rss" | "atom" | "json" | "llms";

export type AppShellLegalDestination = "legal" | "privacy";

export type AppShellHeaderAction = "submit" | "github" | "theme" | "logo" | "shortcuts";

export function appShellNavAnalyticsEvent(): string {
  return "app_shell_nav_click";
}

export function appShellNavAnalyticsData(
  destination: string,
  source: AppShellNavSource,
  sectionId: string | null = null,
) {
  return {
    surface: APP_SHELL_SURFACE,
    destination,
    source,
    sectionId,
  };
}

export function appShellHeaderAnalyticsEvent(): string {
  return "app_shell_header_click";
}

export function appShellHeaderAnalyticsData(action: AppShellHeaderAction) {
  return {
    surface: APP_SHELL_SURFACE,
    action,
  };
}

export function appShellFeedChipAnalyticsEvent(): string {
  return "app_shell_feed_chip_click";
}

export function appShellFeedChipAnalyticsData(feed: AppShellFeedChip) {
  return {
    surface: APP_SHELL_SURFACE,
    feed,
  };
}

export function appShellFooterLinkAnalyticsEvent(): string {
  return "app_shell_footer_link_click";
}

export function appShellFooterLinkAnalyticsData(columnId: string, destination: string) {
  return {
    surface: APP_SHELL_SURFACE,
    columnId,
    destination,
  };
}

export function appShellCategoryAnalyticsEvent(): string {
  return "app_shell_category_click";
}

export function appShellCategoryAnalyticsData(
  category: string,
  rowIndex: number,
  categoryCount: number,
) {
  return {
    surface: APP_SHELL_SURFACE,
    category,
    rowIndex,
    categoryCount,
  };
}

export function appShellLegalAnalyticsEvent(): string {
  return "app_shell_legal_click";
}

export function appShellLegalAnalyticsData(destination: AppShellLegalDestination) {
  return {
    surface: APP_SHELL_SURFACE,
    destination,
  };
}
