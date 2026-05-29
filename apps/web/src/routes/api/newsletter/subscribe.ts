import { createApiFileRoute } from "@/lib/api/file-route";

import { newsletterSubscribeBodySchema } from "@/lib/api/contracts";
import { apiError, apiJson, createApiHandler, type InferApiBody } from "@/lib/api/router";
import { logApiError, logApiInfo, redactEmail } from "@/lib/api-logs";
import { getEnvString } from "@/lib/cloudflare-env.server";

function envSegmentId(followId: string): string | undefined {
  const key = `RESEND_SEGMENT_${followId.toUpperCase().replace(/[^A-Z0-9]/g, "_")}`;
  return getEnvString(key) || undefined;
}

export const POST = createApiHandler(
  "newsletter.subscribe",
  async ({ request, body, requestId }) => {
    const payload = body as InferApiBody<typeof newsletterSubscribeBodySchema>;
    const email = payload.email;
    const segments = payload.segments;
    const source = payload.source;

    const resendApiKey = getEnvString("RESEND_API_KEY");
    const resendSegmentId = getEnvString("RESEND_SEGMENT_ID");

    if (!resendApiKey || !resendSegmentId) {
      logApiError(request, "newsletter.subscribe.not_configured");
      return apiError("newsletter_not_configured", 503, { requestId });
    }

    const segmentIds = new Set<string>([resendSegmentId]);
    for (const segment of segments) {
      const segmentId = envSegmentId(segment);
      if (segmentId) segmentIds.add(segmentId);
    }

    const requestBody: Record<string, unknown> = {
      email,
      unsubscribed: false,
      first_name: "",
      last_name: "",
      metadata: {
        source,
      },
      segments: [...segmentIds].map((id) => ({ id })),
    };

    let response: Response;
    try {
      response = await fetch("https://api.resend.com/contacts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
        signal: AbortSignal.timeout(8000),
      });
    } catch {
      logApiError(request, "newsletter.subscribe.provider_unavailable");
      return apiError("provider_unavailable", 502, { requestId });
    }

    if (response.ok) {
      logApiInfo(request, "newsletter.subscribe.success", {
        email: redactEmail(email),
        source,
      });
      return apiJson({ ok: true }, { headers: { "cache-control": "no-store" } });
    }

    if (response.status === 409) {
      // Treat duplicate as success to keep UX simple and avoid account enumeration.
      logApiInfo(request, "newsletter.subscribe.duplicate", {
        email: redactEmail(email),
        source,
      });
      return apiJson({ ok: true }, { headers: { "cache-control": "no-store" } });
    }

    logApiError(request, "newsletter.subscribe.provider_error", {
      status: response.status,
      email: redactEmail(email),
      source,
    });
    return apiError("provider_error", 502, { requestId });
  },
);

export const Route = createApiFileRoute("/api/newsletter/subscribe")({
  server: {
    handlers: {
      POST: async ({ request, params }) => POST(request, { params }),
    },
  },
});
