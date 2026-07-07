import { applySecurityHeaders } from "@/lib/security-headers";

import {
  buildEtag,
  hasMatchingEtag,
  ifNoneMatchMatches,
  JSON_CACHE_HEADERS,
} from "@/lib/http-cache-lib";

export {
  buildEtag,
  hasMatchingEtag,
  ifNoneMatchMatches,
  JSON_CACHE_HEADERS,
} from "@/lib/http-cache-lib";

export async function cachedJsonResponse(
  request: Request,
  payload: unknown,
  init: ResponseInit = {},
) {
  const body = `${JSON.stringify(payload)}\n`;
  const etag = await buildEtag(body);
  const headers = new Headers(init.headers);
  applySecurityHeaders(headers);
  headers.set("content-type", "application/json; charset=utf-8");
  headers.set("etag", etag);
  for (const [name, value] of Object.entries(JSON_CACHE_HEADERS)) {
    if (!headers.has(name)) headers.set(name, value);
  }

  if (hasMatchingEtag(request, etag)) {
    return new Response(null, { status: 304, headers });
  }

  return new Response(body, { ...init, headers });
}

export async function cachedTextResponse(request: Request, text: string, init: ResponseInit = {}) {
  const body = text.endsWith("\n") ? text : `${text}\n`;
  const etag = await buildEtag(body);
  const headers = new Headers(init.headers);
  applySecurityHeaders(headers);
  headers.set("content-type", "text/plain; charset=utf-8");
  headers.set("etag", etag);
  for (const [name, value] of Object.entries(JSON_CACHE_HEADERS)) {
    if (!headers.has(name)) headers.set(name, value);
  }

  if (hasMatchingEtag(request, etag)) {
    return new Response(null, { status: 304, headers });
  }

  return new Response(body, { ...init, headers });
}
