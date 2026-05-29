import { createFileRoute } from "@tanstack/react-router";

import { newsletterSubscribeBodySchema } from "@/lib/api/contracts";
import { apiError, apiJson, createApiHandler, type InferApiBody } from "@/lib/api/router";
import { logApiError, logApiInfo, redactEmail } from "@/lib/api-logs";
import { getEnvString } from "@/lib/cloudflare-env";

export const POST = createApiHandler(
  "newsletter.subscribe",
  async ({ request, body, requestId }) => {
    const payload = body as InferApiBody<typeof newsletterSubscribeBodySchema>;
    const email = payload.email;
    const source = payload.source;

    const resendApiKey = getEnvString("RESEND_API_KEY");
    const resendSegmentId = getEnvString("RESEND_SEGMENT_ID");

    if (!resendApiKey || !resendSegmentId) {
      logApiError(request, "newsletter.subscribe.not_configured");
      return apiError("newsletter_not_configured", 503, { requestId });
    }

    const requestBody: Record<string, unknown> = {
      email,
      unsubscribed: false,
      first_name: "",
      last_name: "",
      metadata: {
        source,
      },
      segments: [{ id: resendSegmentId }],
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

// @ts-ignore Generated API route is added to routeTree during Vite build.
export const Route = createFileRoute("/api/newsletter/subscribe")({
  server: {
    handlers: {
      POST: async ({ request, params }) => POST(request, { params }),
    },
  },
});
