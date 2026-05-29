/**
 * POST /api/public/newsletter/unsubscribe
 *
 * Best-effort: removes the contact from the resolved Resend segments, or from
 * the general newsletter segment when no segments resolve. The endpoint keeps
 * compatibility with the Atlas client path while applying the same origin,
 * content-type, body-size, and rate-limit controls as dynamic API routes.
 */
import { createApiFileRoute } from "@/lib/api/file-route";
import { z, ZodError } from "zod";

import { apiError, apiJson } from "@/lib/api/router";
import {
  BodyTooLargeError,
  hasJsonContentType,
  isAllowedOrigin,
  isRateLimited,
  readRequestTextWithinLimit,
} from "@/lib/api-security";
import { logApiError, logApiWarn, redactEmail } from "@/lib/api-logs";
import { getEnvString } from "@/lib/cloudflare-env.server";

const BODY_LIMIT_BYTES = 8 * 1024;
const RATE_LIMIT = {
  scope: "newsletter-unsubscribe",
  limit: 15,
  windowMs: 60_000,
} as const;

const Schema = z.object({
  email: z.string().trim().toLowerCase().email().max(320),
  segments: z
    .array(
      z
        .string()
        .trim()
        .min(1)
        .max(64)
        .regex(/^[a-z0-9:_-]+$/i),
    )
    .max(20)
    .optional()
    .default([]),
});

type UnsubscribePayload = z.infer<typeof Schema>;

function getRequestId(request: Request) {
  return (
    request.headers.get("cf-ray") || request.headers.get("x-request-id") || crypto.randomUUID()
  );
}

function envSegmentId(followId: string): string | undefined {
  const key = `RESEND_SEGMENT_${followId.toUpperCase().replace(/[^A-Z0-9]/g, "_")}`;
  return getEnvString(key) || undefined;
}

async function parsePayload(request: Request): Promise<UnsubscribePayload> {
  const rawBody = await readRequestTextWithinLimit(request, BODY_LIMIT_BYTES);
  return Schema.parse(JSON.parse(rawBody)) as UnsubscribePayload;
}

async function POST(request: Request): Promise<Response> {
  const requestId = getRequestId(request);

  if (!isAllowedOrigin(request)) {
    logApiWarn(request, "newsletter.unsubscribe.forbidden_origin");
    return apiError("forbidden_origin", 403, { requestId });
  }

  if (!hasJsonContentType(request)) {
    logApiWarn(request, "newsletter.unsubscribe.invalid_content_type");
    return apiError("invalid_content_type", 415, { requestId });
  }

  if (isRateLimited({ request, ...RATE_LIMIT })) {
    logApiWarn(request, "newsletter.unsubscribe.rate_limited");
    return apiError("rate_limited", 429, { requestId });
  }

  let payload: UnsubscribePayload;
  try {
    payload = await parsePayload(request);
  } catch (error) {
    if (error instanceof BodyTooLargeError) {
      logApiWarn(request, "newsletter.unsubscribe.payload_too_large");
      return apiError("payload_too_large", 413, { requestId });
    }
    if (error instanceof SyntaxError) {
      logApiWarn(request, "newsletter.unsubscribe.invalid_json");
      return apiError("invalid_json", 400, { requestId });
    }
    if (error instanceof ZodError) {
      logApiWarn(request, "newsletter.unsubscribe.invalid_payload");
      return apiError("invalid_payload", 400, { requestId });
    }
    throw error;
  }

  const apiKey = getEnvString("RESEND_API_KEY");
  const generalSegment = getEnvString("RESEND_SEGMENT_ID");
  if (!apiKey || !generalSegment) {
    logApiError(request, "newsletter.unsubscribe.not_configured");
    return apiError("newsletter_not_configured", 503, { requestId });
  }

  const resolved = new Set<string>();
  for (const segment of payload.segments) {
    const id = envSegmentId(segment);
    if (id) resolved.add(id);
  }
  if (resolved.size === 0) resolved.add(generalSegment);

  let lastError: string | null = null;
  for (const id of resolved) {
    try {
      const res = await fetch(
        `https://api.resend.com/audiences/${id}/contacts/${encodeURIComponent(payload.email)}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${apiKey}` },
          signal: AbortSignal.timeout(8000),
        },
      );
      // 404 = not subscribed; treat as success (don't leak membership).
      if (!res.ok && res.status !== 404) {
        lastError = `HTTP ${res.status}`;
      }
    } catch {
      lastError = "network";
    }
  }

  if (lastError && lastError !== "network") {
    logApiError(request, "newsletter.unsubscribe.provider_error", {
      email: redactEmail(payload.email),
      error: lastError,
    });
    return apiError("provider_error", 502, { requestId });
  }

  return apiJson({ ok: true });
}

export const Route = createApiFileRoute("/api/public/newsletter/unsubscribe")({
  server: {
    handlers: {
      POST: async ({ request }) => POST(request),
    },
  },
});
