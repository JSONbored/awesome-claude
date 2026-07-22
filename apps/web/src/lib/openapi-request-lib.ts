// Pure request-path builder for the OpenAPI "try it" panel, split out of
// openapi.tsx so the path-parameter substitution and query-string assembly can
// be unit-tested without React or a live fetch.

import type { OpenApiEndpoint } from "@/data/openapi";

/**
 * Build the request path for an endpoint from user-entered parameter values.
 * Substitutes `{name}` path params (falling back to each param's documented
 * `example`), URL-encodes the substituted segments, and appends non-empty
 * `query` params as a query string. Returns the path unchanged when there is
 * nothing to substitute or append.
 */
export function buildRequestUrl(endpoint: OpenApiEndpoint, values: Record<string, string>): string {
  let path = endpoint.path.replace(/\{(\w+)\}/g, (_match, name) => {
    const value = values[name] || endpoint.parameters?.find((p) => p.name === name)?.example;
    return encodeURIComponent(value || "");
  });

  const params = new URLSearchParams();
  endpoint.parameters
    ?.filter((param) => param.in === "query")
    .forEach((param) => {
      const value = values[param.name] || param.example || "";
      if (value) params.set(param.name, value);
    });
  const query = params.toString();
  if (query) path = `${path}?${query}`;
  return path;
}

const CURL_BASE = "https://heyclau.de";

/**
 * Build the copyable curl snippet shown beside the OpenAPI playground.
 *
 * Path/query examples come from the endpoint's documented parameter examples.
 * For non-GET methods, `body` is the live playground textarea value (falling
 * back to the documented body example) so edits visibly change the snippet.
 */
export function buildCurlCommand(endpoint: OpenApiEndpoint, body?: string): string {
  const params =
    endpoint.parameters
      ?.filter((p) => p.in === "query" && p.example)
      .map((p) => `${p.name}=${p.example}`)
      .join("&") ?? "";
  const url = endpoint.path.replace(/\{(\w+)\}/g, (_m, name) => {
    const ex = endpoint.parameters?.find((p) => p.in === "path" && p.name === name)?.example;
    return ex ?? `:${name}`;
  });
  const fullUrl = `${CURL_BASE}${url}${params ? `?${params}` : ""}`;
  if (endpoint.method === "GET") return `curl '${fullUrl}'`;

  const payload = (body ?? endpoint.body?.example ?? "").replace(/\n/g, "");
  return `curl -X ${endpoint.method} '${fullUrl}' \\\n  -H 'content-type: application/json' \\\n  -d '${payload}'`;
}
