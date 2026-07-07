const REDACTED_QUERY_VALUE = "[redacted]";

const GENERIC_SENSITIVE_SEARCH_PARAMS = new Set([
  "access_token",
  "auth",
  "code",
  "email",
  "key",
  "secret",
  "signature",
  "state",
  "token",
]);

const SENSITIVE_SEARCH_PARAMS_BY_PATH: Record<string, readonly string[]> = {
  "/brief/approve": ["token"],
};

export function sensitiveSearchParamsForPath(pathname: string) {
  return new Set([
    ...GENERIC_SENSITIVE_SEARCH_PARAMS,
    ...(SENSITIVE_SEARCH_PARAMS_BY_PATH[pathname] ?? []),
  ]);
}

export function joinAnalyticsUpstreamUrl(upstream: string, path: string) {
  const base = upstream.replace(/\/+$/, "");
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${base}${suffix}`;
}

export function scrubSensitiveUrlSearch(rawUrl: unknown): unknown {
  if (typeof rawUrl !== "string") return rawUrl;

  let url: URL;
  try {
    url = new URL(rawUrl, "https://heyclau.de");
  } catch {
    return rawUrl;
  }

  const sensitiveParams = sensitiveSearchParamsForPath(url.pathname);
  let changed = false;
  for (const param of [...url.searchParams.keys()]) {
    if (sensitiveParams.has(param.toLowerCase())) {
      url.searchParams.set(param, REDACTED_QUERY_VALUE);
      changed = true;
    }
  }
  if (!changed) return rawUrl;

  return rawUrl.startsWith("http://") || rawUrl.startsWith("https://")
    ? url.toString()
    : `${url.pathname}${url.search}${url.hash}`;
}

export function scrubSensitiveAnalyticsBody(body: string): string {
  let parsed: unknown;
  try {
    parsed = JSON.parse(body);
  } catch {
    return body;
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return body;
  const event = parsed as { payload?: { url?: unknown } };
  if (!event.payload || typeof event.payload !== "object" || Array.isArray(event.payload)) {
    return body;
  }

  const scrubbedUrl = scrubSensitiveUrlSearch(event.payload.url);
  if (scrubbedUrl === event.payload.url) return body;

  event.payload.url = scrubbedUrl;
  return JSON.stringify(event);
}
