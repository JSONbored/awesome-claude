// Pure builder for the ecosystem page's schema.org ItemList of integrations,
// split out of the route head() so the mapping can be unit-tested. The
// absolute-URL resolver is injected to keep the builder pure.

type IntegrationRefLike = {
  name: string;
  slug: string;
};

/** schema.org ItemList JSON-LD linking each integration's detail page. */
export function ecosystemIntegrationsJsonLd(
  integrations: IntegrationRefLike[],
  absoluteUrl: (path: string) => string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "HeyClaude integrations",
    itemListElement: integrations.map((integration, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: integration.name,
      url: absoluteUrl(`/integrations/${integration.slug}`),
    })),
  };
}
