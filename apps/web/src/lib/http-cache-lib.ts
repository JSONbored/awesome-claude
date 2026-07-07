function toHex(buffer: ArrayBuffer) {
  return [...new Uint8Array(buffer)].map((value) => value.toString(16).padStart(2, "0")).join("");
}

export async function buildEtag(body: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(body));
  return `"sha256-${toHex(digest).slice(0, 32)}"`;
}

export function ifNoneMatchMatches(header: string | null, etag: string) {
  if (!header) return false;
  const normalize = (value: string) => value.trim().replace(/^W\//i, "");
  const normalizedEtag = normalize(etag);
  return header
    .split(",")
    .map(normalize)
    .some((candidate) => candidate === "*" || candidate === normalizedEtag);
}

export function hasMatchingEtag(request: Request, etag: string) {
  return ifNoneMatchMatches(request.headers.get("if-none-match"), etag);
}

export const JSON_CACHE_HEADERS = {
  "cache-control": "public, max-age=300, stale-while-revalidate=3600",
} as const;
