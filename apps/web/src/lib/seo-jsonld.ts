import { buildBreadcrumbJsonLd, buildItemListJsonLd } from "@heyclaude/registry/seo";
import { stringifyJsonLd } from "@/lib/json-ld";
import { absoluteUrl } from "@/lib/seo";

type Crumb = { name: string; path: string };
type ListItem = { name: string; path: string };

/** A `<script type="application/ld+json">` head entry for a BreadcrumbList (absolute URLs). */
export function breadcrumbScript(crumbs: Crumb[]) {
  return {
    type: "application/ld+json" as const,
    children: stringifyJsonLd(
      buildBreadcrumbJsonLd(crumbs.map((c) => ({ name: c.name, url: absoluteUrl(c.path) }))),
    ),
  };
}

/** A `<script type="application/ld+json">` head entry for an ItemList (absolute URLs). */
export function itemListScript(
  items: ListItem[],
  meta: { name: string; description?: string },
) {
  return {
    type: "application/ld+json" as const,
    children: stringifyJsonLd(
      buildItemListJsonLd(
        items.map((item) => ({ name: item.name, url: absoluteUrl(item.path) })),
        meta,
      ),
    ),
  };
}
