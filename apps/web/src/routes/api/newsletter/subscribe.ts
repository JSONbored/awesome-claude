import { createApiFileRoute } from "@/lib/api/file-route";

import { newsletterSubscribeBodySchema } from "@/lib/api/contracts";
import { apiError, apiJson, createApiHandler, type InferApiBody } from "@/lib/api/router";
import { logApiError, logApiInfo, redactEmail } from "@/lib/api-logs";
import { getEnvString } from "@/lib/cloudflare-env.server";
import { signConfirmToken } from "@/lib/newsletter-token.server";
import { buildNewsletterConfirmEmail } from "@/lib/newsletter-emails";
import { siteConfig } from "@/lib/site";

const CONFIRM_TTL_MS = 48 * 60 * 60 * 1000;
// mail.heyclau.de is the verified Resend sending domain; the apex domain is not.
const DEFAULT_FROM = "HeyClaude <newsletter@mail.heyclau.de>";

function envSegmentId(followId: string): string | undefined {
  const key = `RESEND_SEGMENT_${followId.toUpperCase().replace(/[^A-Z0-9]/g, "_")}`;
  return getEnvString(key) || undefined;
}

/**
 * Add (or upsert) a CONFIRMED contact in the Resend audience. Shared by the
 * single-opt-in fallback below and the double-opt-in confirm route. Returns a
 * status the caller maps to an HTTP response. 409 (already a contact) is a
 * success from the user's perspective and avoids account enumeration.
 */
export async function addNewsletterContact(params: {
  email: string;
  segments: string[];
  source: string;
  resendApiKey: string;
  resendSegmentId: string;
}): Promise<"ok" | "duplicate" | "error"> {
  const segmentIds = new Set<string>([params.resendSegmentId]);
  for (const segment of params.segments) {
    const segmentId = envSegmentId(segment);
    if (segmentId) segmentIds.add(segmentId);
  }

  let response: Response;
  try {
    response = await fetch("https://api.resend.com/contacts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${params.resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: params.email,
        unsubscribed: false,
        first_name: "",
        last_name: "",
        metadata: { source: params.source },
        segments: [...segmentIds].map((id) => ({ id })),
      }),
      signal: AbortSignal.timeout(8000),
    });
  } catch {
    return "error";
  }

  if (response.ok) return "ok";
  if (response.status === 409) return "duplicate";
  return "error";
}

async function sendConfirmEmail(params: {
  email: string;
  token: string;
  resendApiKey: string;
  from: string;
}): Promise<boolean> {
  const confirmUrl = `${siteConfig.url}/api/public/newsletter/confirm?token=${encodeURIComponent(
    params.token,
  )}`;
  const { subject, html, text } = buildNewsletterConfirmEmail({
    confirmUrl,
    siteUrl: siteConfig.url,
  });
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${params.resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: params.from, to: params.email, subject, html, text }),
      signal: AbortSignal.timeout(8000),
    });
    return response.ok;
  } catch {
    return false;
  }
}

export const POST = createApiHandler(
  "newsletter.subscribe",
  async ({ request, body, requestId }) => {
    const payload = body as InferApiBody<typeof newsletterSubscribeBodySchema>;
    const { email, segments, source } = payload;

    const resendApiKey = getEnvString("RESEND_API_KEY");
    const resendSegmentId = getEnvString("RESEND_SEGMENT_ID");

    if (!resendApiKey || !resendSegmentId) {
      logApiError(request, "newsletter.subscribe.not_configured");
      return apiError("newsletter_not_configured", 503, { requestId });
    }

    // Double opt-in when a confirm secret is configured: email a signed confirm
    // link and add the contact only after they click it. Without the secret we
    // fall back to single opt-in (direct add) to preserve prior behavior.
    const confirmSecret = getEnvString("NEWSLETTER_CONFIRM_SECRET");
    if (confirmSecret) {
      const from = getEnvString("RESEND_FROM") || DEFAULT_FROM;
      const token = await signConfirmToken(confirmSecret, {
        email,
        segments,
        source,
        exp: Date.now() + CONFIRM_TTL_MS,
      });
      const sent = await sendConfirmEmail({ email, token, resendApiKey, from });
      if (!sent) {
        logApiError(request, "newsletter.subscribe.confirm_send_failed", {
          email: redactEmail(email),
          source,
        });
        return apiError("provider_error", 502, { requestId });
      }
      logApiInfo(request, "newsletter.subscribe.confirm_sent", {
        email: redactEmail(email),
        source,
      });
      return apiJson({ ok: true, pending: true }, { headers: { "cache-control": "no-store" } });
    }

    const result = await addNewsletterContact({
      email,
      segments,
      source,
      resendApiKey,
      resendSegmentId,
    });
    if (result === "ok" || result === "duplicate") {
      logApiInfo(request, `newsletter.subscribe.${result === "ok" ? "success" : "duplicate"}`, {
        email: redactEmail(email),
        source,
      });
      return apiJson({ ok: true }, { headers: { "cache-control": "no-store" } });
    }

    logApiError(request, "newsletter.subscribe.provider_error", {
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
