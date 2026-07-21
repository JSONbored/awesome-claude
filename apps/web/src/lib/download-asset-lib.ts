// Pure helpers for the download API route: validate the requested asset path
// against the allowlist, resolve its content type, and derive a filename. Split
// out of the route so the guards/mappings can be unit-tested without the handler.

/**
 * Cache policy for `/api/download` responses.
 *
 * Local package URLs are slug-addressed (`/downloads/skills/<slug>.zip`), not
 * content-addressed, and rebuilds can replace bytes under the same path when
 * `downloadSha256` changes. Keep a long edge TTL for unchanged artifacts, but
 * never mark the response `immutable` — that would pin stale bytes for a year.
 */
export const DOWNLOAD_CACHE_CONTROL =
  "public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000";

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
