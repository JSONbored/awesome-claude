// Pure predicate/parse helpers behind scripts/validate-deployment-artifacts.mjs:
// normalizing a base URL, checking a submit URL against the canonical origin, and
// reading the entries array out of an artifact payload. Split out so they can be
// unit-tested without fetching a live deployment.

export const canonicalOrigin = "https://heyclau.de";

/** Trim and drop any trailing slashes from a base URL; "" for empty input. */
export function normalizeBaseUrl(value) {
  const trimmed = String(value || "").trim();
  if (!trimmed) return "";
  return trimmed.replace(/\/+$/, "");
}

/** True when value is exactly the canonical origin's /submit URL. */
export function isCanonicalSubmitUrl(value) {
  try {
    const url = new URL(String(value || ""));
    return url.origin === canonicalOrigin && url.pathname === "/submit";
  } catch {
    return false;
  }
}

/** Return payload.entries when it is an array, otherwise null. */
export function readEntries(payload) {
  if (payload && Array.isArray(payload.entries)) return payload.entries;
  return null;
}
