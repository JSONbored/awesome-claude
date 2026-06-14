// Server-only Resend + umami helpers for newsletter sending. Used by the confirm
// route (welcome email) and the weekly-digest scheduled job (broadcast).

import { getEnvString } from "@/lib/cloudflare-env.server";

const RESEND_BASE = "https://api.resend.com";
const DEFAULT_UMAMI_UPSTREAM = "https://tasty.aethereal.dev";
const DEFAULT_UMAMI_WEBSITE_ID = "b734c138-2949-4527-9160-7fe5d0e81121";

/** Send a transactional email via Resend (/emails). Returns success. */
export async function sendResendEmail(params: {
  apiKey: string;
  from: string;
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<boolean> {
  try {
    const response = await fetch(`${RESEND_BASE}/emails`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${params.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: params.from,
        to: params.to,
        subject: params.subject,
        html: params.html,
        text: params.text,
      }),
      signal: AbortSignal.timeout(8000),
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Create AND send a Resend broadcast to a segment in one call (`send: true`).
 * Broadcasts can only be sent via the API if they were also created via the API,
 * which is exactly this flow.
 */
export async function sendResendBroadcast(params: {
  apiKey: string;
  segmentId: string;
  from: string;
  subject: string;
  html: string;
  text: string;
  name: string;
}): Promise<{ ok: boolean; status?: number; id?: string }> {
  try {
    const response = await fetch(`${RESEND_BASE}/broadcasts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${params.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        segment_id: params.segmentId,
        from: params.from,
        subject: params.subject,
        html: params.html,
        text: params.text,
        name: params.name,
        send: true,
      }),
      signal: AbortSignal.timeout(10000),
    });
    let body: { id?: string; data?: { id?: string } } = {};
    try {
      body = (await response.json()) as typeof body;
    } catch {
      /* non-JSON body */
    }
    return { ok: response.ok, status: response.status, id: body.id ?? body.data?.id };
  } catch {
    return { ok: false };
  }
}

/**
 * Record a server-side umami event (best-effort) so newsletter sends show up in
 * the same dashboard as web traffic. No-op on failure — analytics never blocks.
 */
export async function recordUmamiEvent(name: string, data?: Record<string, unknown>): Promise<void> {
  const upstream = getEnvString("UMAMI_UPSTREAM_URL") || DEFAULT_UMAMI_UPSTREAM;
  const websiteId = getEnvString("UMAMI_WEBSITE_ID") || DEFAULT_UMAMI_WEBSITE_ID;
  try {
    await fetch(`${upstream}/api/send`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "user-agent": "Mozilla/5.0 (compatible; HeyClaude-newsletter)",
      },
      body: JSON.stringify({
        type: "event",
        payload: {
          website: websiteId,
          hostname: "heyclau.de",
          url: "/__cron/newsletter",
          name,
          data,
        },
      }),
      signal: AbortSignal.timeout(5000),
    });
  } catch {
    /* best-effort */
  }
}
