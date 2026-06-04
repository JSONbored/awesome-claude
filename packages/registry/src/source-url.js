/**
 * Shared canonicalizer for submission source URLs.
 *
 * Two related concerns live here so the rules stay in one place:
 *  - Affiliate detection (utm_* plus partner/referral params) used by
 *    submission triage to flag promotional links.
 *  - Tracking-parameter canonicalization used when comparing source URLs
 *    for duplicate detection, so analytics noise on one submission does
 *    not defeat an otherwise-identical match.
 */

const AFFILIATE_PARAM_NAMES = new Set([
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

const ANALYTICS_PARAM_NAMES = new Set([
  "fbclid",
  "gclid",
  "dclid",
  "gbraid",
  "wbraid",
  "msclkid",
  "igshid",
  "mc_cid",
  "mc_eid",
  "mkt_tok",
  "vero_id",
  "oly_enc_id",
  "oly_anon_id",
  "_hsenc",
  "_hsmi",
  "ref_src",
  "ref_url",
  "spm",
]);

function normalize(value) {
  return String(value ?? "").trim();
}

function parseUrl(value) {
  const text = normalize(value);
  if (!text) return null;
  try {
    return new URL(text);
  } catch {
    return null;
  }
}

function preservedParams(url) {
  const preserved = [];
  for (const [key, value] of url.searchParams.entries()) {
    if (!isTrackingParam(key)) preserved.push([key, value]);
  }
  url.search = "";
  for (const [key, value] of preserved) {
    url.searchParams.append(key, value);
  }
  return url;
}

export function isAffiliateParam(name) {
  const key = normalize(name).toLowerCase();
  if (!key) return false;
  return key.startsWith("utm_") || AFFILIATE_PARAM_NAMES.has(key);
}

export function isTrackingParam(name) {
  const key = normalize(name).toLowerCase();
  if (!key) return false;
  return isAffiliateParam(key) || ANALYTICS_PARAM_NAMES.has(key);
}

export function hasAffiliateParam(value) {
  const url = parseUrl(value);
  if (!url) return false;
  for (const key of url.searchParams.keys()) {
    if (isAffiliateParam(key)) return true;
  }
  return false;
}

export function stripTrackingParams(value) {
  const text = normalize(value);
  const url = parseUrl(text);
  if (!url) return text;
  return preservedParams(url).toString();
}

export function canonicalizeSourceUrl(value) {
  const url = parseUrl(value);
  if (!url) return normalize(value).toLowerCase();
  url.hash = "";
  url.hostname = url.hostname.replace(/^www\./, "");
  preservedParams(url);
  if (url.pathname !== "/" && url.pathname.endsWith("/")) {
    url.pathname = url.pathname.slice(0, -1);
  }
  return url.toString().toLowerCase();
}
