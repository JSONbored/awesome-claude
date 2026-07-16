/**
 * Pure directory hub navigation analytics helpers.
 *
 * Maps category, best index, and platform index hub navigation to privacy-light
 * event names without embedding list titles or entry names.
 */

export const CATEGORY_HUB_SURFACE = "category-hub";
export const CATEGORY_HUB_NOTFOUND_SURFACE = "category-hub-notfound";
export const BEST_INDEX_SURFACE = "best-index";
export const PLATFORM_INDEX_SURFACE = "platform-index";
export const PLATFORM_HUB_SURFACE = "platform-hub";
export const PLATFORM_HUB_NOTFOUND_SURFACE = "platform-hub-notfound";
export const PLATFORM_CATEGORY_SURFACE = "platform-category";
export const PLATFORM_CATEGORY_NOTFOUND_SURFACE = "platform-category-notfound";

export function categoryHubBrowseAnalyticsEvent(): string {
  return "category_hub_browse_click";
}

export function categoryHubBrowseAnalyticsData(category: string, entryCount: number) {
  return {
    surface: CATEGORY_HUB_SURFACE,
    category,
    entryCount,
  };
}

export function categoryHubSeeAllAnalyticsEvent(): string {
  return "category_hub_see_all_click";
}

export function categoryHubSeeAllAnalyticsData(category: string, entryCount: number) {
  return {
    surface: CATEGORY_HUB_SURFACE,
    category,
    entryCount,
  };
}

export function categoryHubNotFoundEgressAnalyticsEvent(): string {
  return "category_hub_notfound_egress_click";
}

export function categoryHubNotFoundEgressAnalyticsData() {
  return {
    surface: CATEGORY_HUB_NOTFOUND_SURFACE,
  };
}

export function bestIndexListAnalyticsEvent(): string {
  return "best_index_list_click";
}

export function bestIndexListAnalyticsData(
  listSlug: string,
  pickCount: number,
  rowIndex: number,
  listCount: number,
) {
  return {
    surface: BEST_INDEX_SURFACE,
    listSlug,
    pickCount,
    rowIndex,
    listCount,
  };
}

export function platformIndexSelectAnalyticsEvent(): string {
  return "platform_index_select";
}

export function platformIndexSelectAnalyticsData(
  platformId: string,
  entryCount: number,
  rowIndex: number,
  platformCount: number,
) {
  return {
    surface: PLATFORM_INDEX_SURFACE,
    platformId,
    entryCount,
    rowIndex,
    platformCount,
  };
}

export function platformHubBrowseAnalyticsEvent(): string {
  return "platform_hub_browse_click";
}

export function platformHubBrowseAnalyticsData(platformId: string, entryCount: number) {
  return {
    surface: PLATFORM_HUB_SURFACE,
    platformId,
    entryCount,
  };
}

export function platformHubNotFoundEgressAnalyticsEvent(): string {
  return "platform_hub_notfound_egress_click";
}

export function platformHubNotFoundEgressAnalyticsData() {
  return {
    surface: PLATFORM_HUB_NOTFOUND_SURFACE,
  };
}

export function platformHubSectionAnalyticsEvent(): string {
  return "platform_hub_section_click";
}

export function platformHubSectionAnalyticsData(
  platformId: string,
  category: string,
  sectionEntryCount: number,
  rowIndex: number,
  sectionCount: number,
) {
  return {
    surface: PLATFORM_HUB_SURFACE,
    platformId,
    category,
    sectionEntryCount,
    rowIndex,
    sectionCount,
  };
}

export function platformCategoryPlatformAnalyticsEvent(): string {
  return "platform_category_platform_click";
}

export function platformCategoryPlatformAnalyticsData(
  platformId: string,
  category: string,
  entryCount: number,
) {
  return {
    surface: PLATFORM_CATEGORY_SURFACE,
    platformId,
    category,
    entryCount,
  };
}

export function platformCategoryCategoryAnalyticsEvent(): string {
  return "platform_category_category_click";
}

export function platformCategoryCategoryAnalyticsData(
  platformId: string,
  category: string,
  entryCount: number,
) {
  return {
    surface: PLATFORM_CATEGORY_SURFACE,
    platformId,
    category,
    entryCount,
  };
}

export function platformCategoryNotFoundEgressAnalyticsEvent(): string {
  return "platform_category_notfound_egress_click";
}

export function platformCategoryNotFoundEgressAnalyticsData() {
  return {
    surface: PLATFORM_CATEGORY_NOTFOUND_SURFACE,
  };
}
