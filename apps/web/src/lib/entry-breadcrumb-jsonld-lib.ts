// Pure builder for an entry detail page's schema.org BreadcrumbList JSON-LD,
// split out of the route head() so the Directory > category > entry trail can be
// unit-tested. The absolute-URL resolver is injected to keep the builder pure.
// The ListItem/position mapping is delegated to the shared breadcrumb builder.

import type { Entry } from "@/types/registry";
import { breadcrumbListJsonLd } from "@/lib/breadcrumb-jsonld-lib";

/** schema.org BreadcrumbList JSON-LD: Directory > category > entry. */
export function entryBreadcrumbJsonLd(
  entry: Entry,
  url: string,
  absoluteUrl: (path: string) => string,
) {
  return breadcrumbListJsonLd([
    { name: "Directory", item: absoluteUrl("/browse") },
    { name: entry.category, item: absoluteUrl(`/${entry.category}`) },
    { name: entry.title, item: url },
  ]);
}
