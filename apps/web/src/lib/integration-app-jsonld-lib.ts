// Pure builder for an integration page's schema.org SoftwareApplication JSON-LD,
// split out of the route head() so the optional softwareVersion and publisher
// fields can be unit-tested. The absolute-URL resolver is injected.

type IntegrationAppFields = {
  name: string;
  description: string;
  version?: string | null;
};

/** schema.org SoftwareApplication JSON-LD for an integration at the given url. */
export function integrationAppJsonLd(
  integration: IntegrationAppFields,
  url: string,
  absoluteUrl: (path: string) => string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: integration.name,
    description: integration.description,
    url,
    applicationCategory: "DeveloperApplication",
    ...(integration.version ? { softwareVersion: integration.version } : {}),
    publisher: { "@type": "Organization", name: "HeyClaude", url: absoluteUrl("/") },
  };
}
