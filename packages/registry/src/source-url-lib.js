/**
 * Pure source URL normalization helpers.
 *
 * Classifies affiliate/tracking query params, strips promotional noise, and
 * canonicalizes submitted source URLs for duplicate comparison. Nothing here
 * touches the network — given the same URL string the output is deterministic.
 *
 * The public surface (`source-url.js` / `@heyclaude/registry/source-url`)
 * re-exports everything below so existing imports stay unchanged.
 */

import { RESERVED_OWNERS } from "./source-repo-lib.js";

const AFFILIATE_PARAMS = new Set([
  "aff",
  "affiliate",
  "affiliate_id",
  "campaign",
  "coupon",
  "irclickid",
  "partner",
  "ref",
  "referral",
  "referral_code",
  "via",
]);

const ANALYTICS_PARAMS = new Set([
  "_hsenc",
  "_hsmi",
  "fbclid",
  "gclid",
  "gclsrc",
  "igshid",
  "mc_cid",
  "mc_eid",
  "msclkid",
  "pk_campaign",
  "pk_kwd",
  "rb_clickid",
  "s_cid",
  "twclid",
  "yclid",
]);

function parseUrl(value) {
  const text = String(value ?? "").trim();
  if (!text) return null;
  try {
    return new URL(text);
  } catch {
    return null;
  }
}

/**
 * Return true when a URL embeds credentials in the userinfo component.
 *
 * @param {unknown} value
 * @returns {boolean}
 */
export function hasEmbeddedUrlUserinfo(value) {
  const url = parseUrl(value);
  if (!url) return false;
  return Boolean(url.username || url.password);
}

/**
 * Return true when a URL uses HTTPS without embedded userinfo credentials.
 * Empty values are treated as valid so optional submission fields stay optional.
 *
 * @param {unknown} value
 * @returns {boolean}
 */
export function isPublicHttpsUrl(value) {
  const text = String(value ?? "").trim();
  if (!text) return true;
  const url = parseUrl(value);
  if (!url) return false;
  return (
    url.protocol === "https:" && url.username === "" && url.password === ""
  );
}

/**
 * Return true when a URL uses HTTP or HTTPS without embedded userinfo.
 * Empty values are treated as valid so optional fields stay optional.
 *
 * @param {unknown} value
 * @returns {boolean}
 */
export function isPublicHttpUrl(value) {
  const text = String(value ?? "").trim();
  if (!text) return true;
  const url = parseUrl(value);
  if (!url) return false;
  return (
    (url.protocol === "https:" || url.protocol === "http:") &&
    url.username === "" &&
    url.password === ""
  );
}

/**
 * Return the normalized hostname for a URL, or "" when invalid or credential-bearing.
 *
 * @param {unknown} value
 * @returns {string}
 */
export function publicUrlHostname(value) {
  const url = parseUrl(value);
  if (!url || url.username || url.password) return "";
  return url.hostname.replace(/^www\./i, "").toLowerCase();
}

/**
 * Return the canonical href for a public HTTP(S) URL, or "" when invalid.
 *
 * @param {unknown} value
 * @returns {string}
 */
export function publicHttpUrlHref(value) {
  const text = String(value ?? "").trim();
  if (!text) return "";
  const url = parseUrl(value);
  if (!url || url.username || url.password) return "";
  if (url.protocol !== "https:" && url.protocol !== "http:") return "";
  return url.href;
}

/**
 * Return true for a single-segment GitHub profile URL without embedded userinfo.
 *
 * The single path segment must be a real account name, not a GitHub product
 * surface: `github.com/features`, `github.com/sponsors`, and `github.com/about`
 * are reserved pages, never user profiles. The reserved set is shared with the
 * repo-URL parser (`RESERVED_OWNERS`) so the two classifiers stay in sync.
 *
 * @param {unknown} value
 * @returns {boolean}
 */
export function isPublicGitHubProfileUrl(value) {
  const url = parseUrl(value);
  if (!url) return false;
  const segments = url.pathname.split("/").filter(Boolean);
  return (
    url.protocol === "https:" &&
    url.username === "" &&
    url.password === "" &&
    url.hostname === "github.com" &&
    segments.length === 1 &&
    !RESERVED_OWNERS.has(segments[0].toLowerCase())
  );
}

/**
 * Return true when a URL resolves to github.com or a *.github.com host over
 * HTTP(S) and without embedded userinfo. The protocol guard matches the other
 * public-URL validators here (`isPublicHttpUrl`, `publicHttpUrlHref`): a
 * non-http(s) URL such as `ftp://github.com/x` or `ws://raw.github.com/x` is
 * not a public GitHub web URL even though its hostname is a GitHub host.
 *
 * @param {unknown} value
 * @returns {boolean}
 */
export function isPublicGitHubHostUrl(value) {
  const url = parseUrl(value);
  if (
    !url ||
    url.username ||
    url.password ||
    (url.protocol !== "https:" && url.protocol !== "http:")
  ) {
    return false;
  }
  const hostname = url.hostname.replace(/^www\./i, "").toLowerCase();
  return hostname === "github.com" || hostname.endsWith(".github.com");
}

function normalizeParamName(name) {
  return String(name ?? "")
    .trim()
    .toLowerCase();
}

/**
 * Return true for affiliate/referral params and the UTM params that the
 * submission validator already treats as promotional source noise.
 *
 * @param {unknown} name
 * @returns {boolean}
 */
export function isAffiliateParam(name) {
  const normalized = normalizeParamName(name);
  return normalized.startsWith("utm_") || AFFILIATE_PARAMS.has(normalized);
}

/**
 * Return true for query params that should not affect source identity.
 *
 * @param {unknown} name
 * @returns {boolean}
 */
export function isTrackingParam(name) {
  const normalized = normalizeParamName(name);
  return isAffiliateParam(normalized) || ANALYTICS_PARAMS.has(normalized);
}

/**
 * Detect whether a URL carries affiliate/referral style params.
 *
 * @param {unknown} value
 * @returns {boolean}
 */
export function hasAffiliateParam(value) {
  const text = String(value ?? "").trim();
  if (!text) return false;
  try {
    const url = new URL(text);
    return [...url.searchParams.keys()].some(isAffiliateParam);
  } catch {
    return false;
  }
}

/**
 * Strip known tracking query params while preserving meaningful params.
 *
 * @param {unknown} value
 * @returns {string}
 */
export function stripTrackingParams(value) {
  const text = String(value ?? "").trim();
  if (!text) return "";
  try {
    const url = new URL(text);
    const kept = [...url.searchParams.entries()].filter(
      ([key]) => !isTrackingParam(key),
    );
    url.search = "";
    for (const [key, paramValue] of kept) {
      url.searchParams.append(key, paramValue);
    }
    return url.toString();
  } catch {
    return text;
  }
}

/**
 * Canonical form for comparing submitted source URLs against registry entries.
 *
 * @param {unknown} value
 * @returns {string}
 */
export function canonicalizeSourceUrl(value) {
  const stripped = stripTrackingParams(value);
  if (!stripped) return "";
  try {
    const url = new URL(stripped);
    url.username = "";
    url.password = "";
    url.hash = "";
    url.protocol = url.protocol.toLowerCase();
    url.hostname = url.hostname.replace(/^www\./i, "").toLowerCase();
    while (url.pathname !== "/" && url.pathname.endsWith("/")) {
      url.pathname = url.pathname.slice(0, -1);
    }
    const sortedParams = [...url.searchParams.entries()].sort(
      ([left], [right]) => left.localeCompare(right),
    );
    url.search = "";
    for (const [key, paramValue] of sortedParams) {
      url.searchParams.append(key, paramValue);
    }
    return url.toString();
  } catch {
    return stripped.toLowerCase();
  }
}
