/**
 * Pure citation-facts egress analytics helpers.
 *
 * Maps single-URL citation fact clicks to privacy-light event names without
 * embedding full URLs, author names, or free-text fact values.
 */

export const CITATION_FACTS_SURFACE = "citation-facts";

export function citationFactLabelKey(label: string): string {
  return label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function citationFactsEgressAnalyticsEvent(): string {
  return "citation_facts_egress_click";
}

export function citationFactsEgressAnalyticsData(
  category: string,
  slug: string,
  label: string,
  host: string,
) {
  return {
    entry: `${category}/${slug}`,
    surface: CITATION_FACTS_SURFACE,
    factLabel: citationFactLabelKey(label),
    host,
  };
}
