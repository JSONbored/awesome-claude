import { createFileRoute } from "@tanstack/react-router";

import { apiError } from "@/lib/api/router";
import {
  BodyTooLargeError,
  hasJsonContentType,
  isAllowedOrigin,
  isRateLimited,
  readRequestTextWithinLimit,
} from "@/lib/api-security";
import { logApiWarn } from "@/lib/api-logs";
import { joinAnalyticsUpstreamUrl, scrubSensitiveAnalyticsBody } from "@/lib/analytics-proxy";
import { getEnvString } from "@/lib/cloudflare-env.server";
import { parseAllowedUpstreamOrigins, validateUpstreamOrigin } from "@/lib/upstream-origin-lib";

const BODY_LIMIT_BYTES = 16 * 1024;
const RATE_LIMIT = {
  scope: "umami-collector",
  limit: 60,
  windowMs: 60_000,
} as const;
const DEFAULT_ALLOWED_UPSTREAM_ORIGINS = ["https://tasty.aethereal.dev"] as const;

function getRequestId(request: Request) {
  return (
    request.headers.get("cf-ray") || request.headers.get("x-request-id") || crypto.randomUUID()
  );
}

function allowedUpstreamOrigins() {
  return parseAllowedUpstreamOrigins(
    getEnvString("UMAMI_ALLOWED_UPSTREAM_ORIGINS"),
    DEFAULT_ALLOWED_UPSTREAM_ORIGINS,
  );
}

function validatedUpstreamOrigin(upstream: string) {
  return validateUpstreamOrigin(upstream, allowedUpstreamOrigins());
}

/**
 * First-party umami collector proxy. The bundled tracker posts events here; we
 * forward them to the umami instance server-side, preserving the visitor
 * User-Agent and IP (umami needs both for sessions + geolocation). Keeps
 * `connect-src` to `'self'` — no third-party analytics origin in the CSP. Lives
 * under `/u/` (not `/api/`) since it's infra, not a product API.
 */
export async function POST(request: Request): Promise<Response> {
  const requestId = getRequestId(request);

  if (!isAllowedOrigin(request)) {
    logApiWarn(request, "umami.collector.forbidden_origin");
    return apiError("forbidden_origin", 403, { requestId });
  }

  if (!hasJsonContentType(request)) {
    logApiWarn(request, "umami.collector.invalid_content_type");
    return apiError("invalid_content_type", 415, { requestId });
  }

  if (isRateLimited({ request, ...RATE_LIMIT })) {
    logApiWarn(request, "umami.collector.rate_limited");
    return apiError("rate_limited", 429, { requestId });
  }

  let body: string;
  try {
    body = await readRequestTextWithinLimit(request, BODY_LIMIT_BYTES);
  } catch (error) {
    if (error instanceof BodyTooLargeError) {
      logApiWarn(request, "umami.collector.payload_too_large");
      return apiError("payload_too_large", 413, { requestId });
    }
    throw error;
  }

  const upstream = validatedUpstreamOrigin(getEnvString("UMAMI_UPSTREAM_URL"));
  if (!upstream) return apiError("analytics_not_configured", 404, { requestId });

  const headers = new Headers({
    "content-type": "application/json",
    // umami drops requests without a User-Agent.
    "user-agent": request.headers.get("user-agent") || "Mozilla/5.0 (compatible; HeyClaude)",
  });
  const clientIp =
    request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for");
  if (clientIp) headers.set("x-forwarded-for", clientIp);

  let response: Response;
  try {
    response = await fetch(joinAnalyticsUpstreamUrl(upstream, "/api/send"), {
      method: "POST",
      headers,
      body: scrubSensitiveAnalyticsBody(body),
      signal: AbortSignal.timeout(8000),
    });
  } catch {
    return new Response("", {
      status: 502,
      headers: { "cache-control": "no-store" },
    });
  }

  const text = await response.text();
  return new Response(text, {
    status: response.status,
    headers: {
      "content-type": response.headers.get("content-type") || "text/plain; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

export const Route = createFileRoute("/u/api/send")({
  server: {
    handlers: {
      POST: async ({ request }) => POST(request),
    },
  },
});
