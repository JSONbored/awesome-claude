// Pure builder for schema.org BreadcrumbList JSON-LD from an ordered list of
// { name, item } crumbs, split out so route head() functions can share one
// tested implementation instead of open-coding the ListItem positions.

export type BreadcrumbCrumb = {
  name: string;
  item: string;
};

/** schema.org BreadcrumbList JSON-LD; positions are 1-based in list order. */
export function breadcrumbListJsonLd(crumbs: BreadcrumbCrumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.item,
    })),
  };
}
