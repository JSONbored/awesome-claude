/**
 * Public brand-asset resolution surface.
 *
 * Pure domain normalization, known-brand detection, Brandfetch/proxy URL
 * construction, and metadata sanitization live in `brand-assets-lib.js`. This
 * module re-exports that surface so existing `@heyclaude/registry/brand-assets`
 * and package-root imports stay unchanged.
 */
export {
  BRAND_ASSET_SOURCES,
  KNOWN_BRANDS,
  HOSTING_DOMAINS,
  clean,
  normalizedText,
  textContainsAlias,
  normalizeBrandDomain,
  domainFromUrl,
  isHostingOrRegistryDomain,
  knownBrandTextCandidates,
  knownBrandMatchesDomain,
  shouldAutoResolveBrandAsset,
  normalizeBrandColors,
  isAllowedBrandAssetUrl,
  brandfetchClientId,
  brandfetchLogoUrl,
  brandAssetProxyUrl,
  detectKnownBrand,
  buildBrandAssetMetadata,
} from "./brand-assets-lib.js";
