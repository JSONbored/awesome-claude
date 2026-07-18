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

export type AppShellHeaderAction = "submit" | "github" | "theme" | "logo" | "shortcuts" | "menu";

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

export type AppShellHeaderSubmitDestination = { to: "/submit" };

/** Map a header submit action id to an in-app route. */
export function appShellHeaderSubmitDestination(
  action: string,
): AppShellHeaderSubmitDestination | null {
  switch (action) {
    case "submit":
      return { to: "/submit" };
    default:
      return null;
  }
}

export type AppShellLegalRouteDestination = { to: "/legal" } | { to: "/legal"; hash: "privacy" };

/** Map a legal footer destination id to an in-app route. */
export function appShellLegalRouteDestination(
  destination: string,
): AppShellLegalRouteDestination | null {
  switch (destination) {
    case "legal":
      return { to: "/legal" };
    case "privacy":
      return { to: "/legal", hash: "privacy" };
    default:
      return null;
  }
}

export type AppShellFeedChipHrefDestination = { href: string };

/** Map a feed chip id to a static href. */
export function appShellFeedChipHrefDestination(
  feed: string,
): AppShellFeedChipHrefDestination | null {
  switch (feed) {
    case "rss":
      return { href: "/feed.xml" };
    case "atom":
      return { href: "/atom.xml" };
    case "json":
      return { href: "/data/feeds/index.json" };
    case "llms":
      return { href: "/llms.txt" };
    default:
      return null;
  }
}

export type AppShellCategoryDestination = { to: "/$category"; params: { category: string } };

/** Map a category id to an in-app route. */
export function appShellCategoryDestination(category: string): AppShellCategoryDestination | null {
  const id = category.trim();
  switch (id) {
    case "":
      return null;
    default:
      return { to: "/$category", params: { category: id } };
  }
}

export type AppShellNavRouteDestination =
  | { to: "/browse" }
  | { to: "/trending" }
  | { to: "/best" }
  | { to: "/quality" }
  | { to: "/ecosystem" }
  | { to: "/jobs" }
  | { to: "/tags" }
  | { to: "/for" }
  | { to: "/compare" }
  | { to: "/validators" }
  | { to: "/state-of-claude-tooling" }
  | { to: "/integrations" }
  | { to: "/integrations/$slug"; params: { slug: string } }
  | { to: "/api-docs" }
  | { to: "/feeds" }
  | { to: "/submit" }
  | { to: "/claim" }
  | { to: "/contributors" }
  | { to: "/about" }
  | { to: "/changelog" }
  | { to: "/brief" }
  | { to: "/advertise" }
  | { to: "/subscriptions" };

/** Map a shell nav path to an in-app route. */
export function appShellNavRouteDestination(path: string): AppShellNavRouteDestination | null {
  switch (path) {
    case "/browse":
      return { to: "/browse" };
    case "/trending":
      return { to: "/trending" };
    case "/best":
      return { to: "/best" };
    case "/quality":
      return { to: "/quality" };
    case "/ecosystem":
      return { to: "/ecosystem" };
    case "/jobs":
      return { to: "/jobs" };
    case "/tags":
      return { to: "/tags" };
    case "/for":
      return { to: "/for" };
    case "/compare":
      return { to: "/compare" };
    case "/validators":
      return { to: "/validators" };
    case "/state-of-claude-tooling":
      return { to: "/state-of-claude-tooling" };
    case "/integrations":
      return { to: "/integrations" };
    case "/integrations/mcp-server":
      return { to: "/integrations/$slug", params: { slug: "mcp-server" } };
    case "/api-docs":
      return { to: "/api-docs" };
    case "/feeds":
      return { to: "/feeds" };
    case "/submit":
      return { to: "/submit" };
    case "/claim":
      return { to: "/claim" };
    case "/contributors":
      return { to: "/contributors" };
    case "/about":
      return { to: "/about" };
    case "/changelog":
      return { to: "/changelog" };
    case "/brief":
      return { to: "/brief" };
    case "/advertise":
      return { to: "/advertise" };
    case "/subscriptions":
      return { to: "/subscriptions" };
    default:
      return null;
  }
}
