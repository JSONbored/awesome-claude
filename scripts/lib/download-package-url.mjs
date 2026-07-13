// Pure download-URL classification behind scripts/validate-download-packages.mjs:
// deciding whether a content entry declares a first-party (maintainer-verified)
// package and whether its download URL points at a local /downloads/ artifact.
// Split out so these checks can be unit-tested without the filesystem / unzip /
// checksum layers the validator runs around them.

/** True only when the entry is explicitly marked as a verified first-party package. */
export function isFirstPartyPackage(data = {}) {
  return data.packageVerified === true;
}

/** Coerce a download URL to a trimmed string (null/undefined become ""). */
export function normalizeDownloadUrl(downloadUrl) {
  return String(downloadUrl ?? "").trim();
}

/** True when the (normalized) download URL is a local /downloads/ artifact path. */
export function isLocalDownloadUrl(downloadUrl) {
  return normalizeDownloadUrl(downloadUrl).startsWith("/downloads/");
}
