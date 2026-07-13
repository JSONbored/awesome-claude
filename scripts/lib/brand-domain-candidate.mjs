// Pure brand-domain selection behind scripts/enrich-brand-assets.mjs: picking the
// best candidate brand domain for a content entry from its explicit brandDomain,
// then its websiteUrl, then (review-only) its documentationUrl - skipping hosting
// and registry domains. Split out so the selection can be unit-tested without the
// mdx walk / file writes the script performs.

import {
  domainFromUrl,
  isHostingOrRegistryDomain,
  normalizeBrandDomain,
} from "@heyclaude/registry/brand-assets";

/**
 * Choose a brand domain for an entry, returning { domain, source }. Prefers an
 * explicit brandDomain, then a non-hosting websiteUrl domain, then a non-hosting
 * documentationUrl domain (flagged review-only); otherwise { domain: "",
 * source: "missing" }.
 */
export function candidateDomain(data) {
  const explicit = normalizeBrandDomain(data.brandDomain);
  if (explicit) return { domain: explicit, source: "explicit" };

  const websiteDomain = domainFromUrl(data.websiteUrl);
  if (websiteDomain && !isHostingOrRegistryDomain(websiteDomain)) {
    return { domain: websiteDomain, source: "websiteUrl" };
  }

  const docsDomain = domainFromUrl(data.documentationUrl);
  if (docsDomain && !isHostingOrRegistryDomain(docsDomain)) {
    return { domain: docsDomain, source: "documentationUrl-review-only" };
  }

  return { domain: "", source: "missing" };
}
