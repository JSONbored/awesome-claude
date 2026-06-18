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
    url.hash = "";
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
    return url.toString().toLowerCase();
  } catch {
    return stripped.toLowerCase();
  }
}
