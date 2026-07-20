/**
 * POST /api/public/newsletter/unsubscribe
 *
 * Best-effort: removes the contact from the resolved Resend segments, or from
 * the general newsletter segment when no segments resolve. The endpoint keeps
 * compatibility with the Atlas client path while applying the same origin,
 * content-type, body-size, and durable Cloudflare rate-limit controls as its
 * newsletter siblings (subscribe/confirm).
 */
import { createApiFileRoute } from "@/lib/api/file-route";

import { newsletterUnsubscribeBodySchema } from "@/lib/api/contracts";
import { apiError, apiJson, createApiHandler, type InferApiBody } from "@/lib/api/router";
import { logApiError, redactEmail } from "@/lib/api-logs";
import { getEnvString } from "@/lib/cloudflare-env.server";

function envSegmentId(followId: string): string | undefined {
  const key = `RESEND_SEGMENT_${followId.toUpperCase().replace(/[^A-Z0-9]/g, "_")}`;
  return getEnvString(key) || undefined;
}

export const POST = createApiHandler(
  "newsletter.unsubscribe",
  async ({ request, body, requestId }) => {
    const payload = body as InferApiBody<typeof newsletterUnsubscribeBodySchema>;

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

    if (lastError) {
      logApiError(request, "newsletter.unsubscribe.provider_error", {
        email: redactEmail(payload.email),
        error: lastError,
      });
      return apiError("provider_error", 502, { requestId });
    }

    return apiJson({ ok: true });
  },
);

export const Route = createApiFileRoute("/api/public/newsletter/unsubscribe")({
  server: {
    handlers: {
      POST: async ({ request, params }) => POST(request, { params }),
    },
  },
});
