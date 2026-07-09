// Pure builders for the registry feed route's category/platform alias maps,
// split out so the path construction can be unit-tested without the handler.

import { platformFeedSlug } from "@heyclaude/registry/artifacts";

/** Map each category id to its category feed JSON path. */
export function categoryFeedAliases(
  categories: Array<{ category: string }>,
): Record<string, string> {
  return Object.fromEntries(
    categories.map(({ category }) => [category, `/data/feeds/categories/${category}.json`]),
  );
}

/** Map each platform page slug to its platform feed JSON path. */
export function platformFeedAliases(
  definitions: Array<{ platform: string; slug: string }>,
): Record<string, string> {
  return Object.fromEntries(
    definitions.map(({ platform, slug }) => [
      slug,
      `/data/feeds/platforms/${platformFeedSlug(platform)}.json`,
    ]),
  );
}
