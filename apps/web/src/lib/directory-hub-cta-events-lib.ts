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

export type CategoryHubBrowseDestination = {
  to: "/browse";
  search: { category: string };
};

/** Map a category hub browse CTA to a directory browse destination. */
export function categoryHubBrowseDestination(
  category: string,
): CategoryHubBrowseDestination | null {
  const id = category.trim();
  switch (id) {
    case "":
      return null;
    default:
      return { to: "/browse", search: { category: id } };
  }
}

export type CategoryHubSeeAllDestination = {
  to: "/browse";
  search: { category: string };
};

/** Map a category hub see-all CTA to a directory browse destination. */
export function categoryHubSeeAllDestination(
  category: string,
): CategoryHubSeeAllDestination | null {
  const id = category.trim();
  switch (id) {
    case "":
      return null;
    default:
      return { to: "/browse", search: { category: id } };
  }
}

export type CategoryHubNotFoundEgressDestination = {
  to: "/browse";
};

/** Map a category hub not-found egress id to the directory browse route. */
export function categoryHubNotFoundEgressDestination(
  destination: string,
): CategoryHubNotFoundEgressDestination | null {
  switch (destination) {
    case "browse":
      return { to: "/browse" };
    default:
      return null;
  }
}

export type BestIndexListDestination = {
  to: "/best/$slug";
  params: { slug: string };
};

/** Map a best-index list slug to a best detail destination. */
export function bestIndexListDestination(listSlug: string): BestIndexListDestination | null {
  const slug = listSlug.trim();
  switch (slug) {
    case "":
      return null;
    default:
      return { to: "/best/$slug", params: { slug } };
  }
}

export type PlatformIndexSelectDestination = {
  to: "/for/$platform";
  params: { platform: string };
};

/** Map a platforms-index card to a platform hub destination. */
export function platformIndexSelectDestination(
  platformId: string,
): PlatformIndexSelectDestination | null {
  const platform = platformId.trim();
  switch (platform) {
    case "":
      return null;
    default:
      return { to: "/for/$platform", params: { platform } };
  }
}

export type PlatformHubBrowseDestination = {
  to: "/browse";
  search: { platform: string };
};

/** Map a platform hub browse CTA to a directory browse destination. */
export function platformHubBrowseDestination(
  platformId: string,
): PlatformHubBrowseDestination | null {
  const platform = platformId.trim();
  switch (platform) {
    case "":
      return null;
    default:
      return { to: "/browse", search: { platform } };
  }
}

export type PlatformHubNotFoundEgressDestination = {
  to: "/for";
};

/** Map a platform hub not-found egress id to the platforms index. */
export function platformHubNotFoundEgressDestination(
  destination: string,
): PlatformHubNotFoundEgressDestination | null {
  switch (destination) {
    case "platforms":
      return { to: "/for" };
    default:
      return null;
  }
}

export type PlatformHubSectionDestination = {
  to: "/for/$platform/$category";
  params: { platform: string; category: string };
};

/** Map a platform hub section CTA to a platform×category destination. */
export function platformHubSectionDestination(
  platformId: string,
  category: string,
): PlatformHubSectionDestination | null {
  const platform = platformId.trim();
  const categoryId = category.trim();
  switch (platform) {
    case "":
      return null;
    default:
      switch (categoryId) {
        case "":
          return null;
        default:
          return {
            to: "/for/$platform/$category",
            params: { platform, category: categoryId },
          };
      }
  }
}

export type PlatformCategoryPlatformDestination = {
  to: "/for/$platform";
  params: { platform: string };
};

/** Map a platform×category back-link to the parent platform hub. */
export function platformCategoryPlatformDestination(
  platformId: string,
): PlatformCategoryPlatformDestination | null {
  const platform = platformId.trim();
  switch (platform) {
    case "":
      return null;
    default:
      return { to: "/for/$platform", params: { platform } };
  }
}

export type PlatformCategoryCategoryDestination = {
  to: "/$category";
  params: { category: string };
};

/** Map a platform×category cross-link to the category hub. */
export function platformCategoryCategoryDestination(
  category: string,
): PlatformCategoryCategoryDestination | null {
  const categoryId = category.trim();
  switch (categoryId) {
    case "":
      return null;
    default:
      return { to: "/$category", params: { category: categoryId } };
  }
}

export type PlatformCategoryNotFoundEgressDestination = {
  to: "/for";
};

/** Map a platform×category not-found egress id to the platforms index. */
export function platformCategoryNotFoundEgressDestination(
  destination: string,
): PlatformCategoryNotFoundEgressDestination | null {
  switch (destination) {
    case "platforms":
      return { to: "/for" };
    default:
      return null;
  }
}
