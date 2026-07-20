// Pure helpers for the download API route: validate the requested asset path
// against the allowlist, resolve its content type, and derive a filename. Split
// out of the route so the guards/mappings can be unit-tested without the handler.

/** True only for allow-listed skill (.zip) and mcp (.mcpb) download paths. */
export function isAllowedAssetPath(asset: string): boolean {
  const normalized = String(asset || "").trim();
  return (
    /^\/downloads\/skills\/[a-z0-9-]+\.zip$/.test(normalized) ||
    /^\/downloads\/mcp\/[a-z0-9-]+\.mcpb$/.test(normalized)
  );
}

/** Content-type for a download asset, defaulting to a binary stream. */
export function getContentType(asset: string): string {
  if (asset.endsWith(".zip")) return "application/zip";
  if (asset.endsWith(".mcpb")) return "application/octet-stream";
  return "application/octet-stream";
}

/** Last path segment of an asset, falling back to "download". */
export function filenameFromAsset(asset: string): string {
  return asset.split("/").filter(Boolean).at(-1) || "download";
}

/**
 * Cache-control for `/api/download` responses.
 *
 * These URLs are *not* content-addressed — `getDownloadHref` builds
 * `/api/download?asset=/downloads/skills/<slug>.zip` from the slug alone, so a
 * maintainer rebuilding a package publishes different bytes at an unchanged
 * URL. `immutable` promised the opposite: never revalidate for a year, which
 * would pin clients to a stale artifact whose bytes no longer match the entry's
 * `downloadSha256`, with nothing short of a cache-busting query string able to
 * dislodge it.
 *
 * So: still cacheable, but revalidated once the short TTL lapses. An unchanged
 * artifact revalidates cheaply; a republished one is picked up within the hour
 * rather than within a year.
 */
export const DOWNLOAD_CACHE_CONTROL = "public, max-age=3600, must-revalidate";
