/**
 * Pure tools directory page navigation analytics helpers.
 *
 * Maps browse egress and submit CTA navigation to privacy-light event names
 * without embedding tool names or URLs.
 */

export const TOOLS_PAGE_SURFACE = "tools-page";

export function toolsPageBrowseAnalyticsEvent(): string {
  return "tools_page_browse_click";
}

export function toolsPageBrowseAnalyticsData(toolCount: number) {
  return {
    surface: TOOLS_PAGE_SURFACE,
    toolCount,
  };
}

export function toolsPageSubmitAnalyticsEvent(): string {
  return "tools_page_submit_click";
}

export function toolsPageSubmitAnalyticsData(toolCount: number) {
  return {
    surface: TOOLS_PAGE_SURFACE,
    toolCount,
  };
}

export function toolsPageTagAnalyticsEvent(): string {
  return "tools_page_tag_click";
}

export function toolsPageTagAnalyticsData(
  tagSlugValue: string,
  toolSlug: string,
  toolCount: number,
) {
  return {
    surface: TOOLS_PAGE_SURFACE,
    tagSlug: tagSlugValue,
    toolSlug,
    toolCount,
  };
}

export type ToolsPageChromeDestination = {
  to: "/browse" | "/tools/submit";
};

/** Map a tools page chrome CTA id to an in-app destination. */
export function toolsPageChromeDestination(ctaId: string): ToolsPageChromeDestination | null {
  switch (ctaId) {
    case "browse":
      return { to: "/browse" };
    case "submit":
      return { to: "/tools/submit" };
    default:
      return null;
  }
}

export type ToolsPageTagDestination = {
  to: "/tags/$tag";
  params: { tag: string };
};

/**
 * Map a tools card tag label to a tags hub destination.
 * Empty/unslugable labels return null.
 */
export function toolsPageTagDestination(tag: string): ToolsPageTagDestination | null {
  const slug = tag
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  switch (slug) {
    case "":
      return null;
    default:
      return { to: "/tags/$tag", params: { tag: slug } };
  }
}
