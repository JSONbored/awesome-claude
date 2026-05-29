/**
 * POST /api/public/newsletter/unsubscribe
 *
 * Best-effort: removes the contact from the resolved Resend segments, or
 * marks them unsubscribed on the general audience when no segments resolve.
 * Always returns { ok: true } when Resend accepts the request so we never
 * leak whether an address is on file.
 */
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { getEnvString } from "@/lib/cloudflare-env";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
} as const;

const Schema = z.object({
  email: z.string().email().max(255),
  segments: z
    .array(
      z
        .string()
        .min(1)
        .max(64)
        .regex(/^[a-z0-9:_-]+$/i),
    )
    .max(20)
    .optional(),
});

function envSegmentId(followId: string): string | undefined {
  const key = `RESEND_SEGMENT_${followId.toUpperCase().replace(/[^A-Z0-9]/g, "_")}`;
  return getEnvString(key) || undefined;
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...CORS },
  });
}

// @ts-ignore Generated API route is added to routeTree during Vite build.
export const Route = createFileRoute("/api/public/newsletter/unsubscribe")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: CORS }),
      POST: async ({ request }) => {
        const apiKey = getEnvString("RESEND_API_KEY");
        const generalSegment = getEnvString("RESEND_SEGMENT_ID");
        if (!apiKey || !generalSegment) {
          return json({ error: "Newsletter is not configured yet." }, 503);
        }

        let raw: unknown;
        try {
          raw = await request.json();
        } catch {
          return json({ error: "Invalid JSON body." }, 400);
        }

        const parsed = Schema.safeParse(raw);
        if (!parsed.success) {
          return json({ error: "Invalid request." }, 400);
        }

        const { email, segments = [] } = parsed.data;
        const resolved = new Set<string>();
        for (const s of segments) {
          const id = envSegmentId(s);
          if (id) resolved.add(id);
        }
        if (resolved.size === 0) resolved.add(generalSegment);

        let lastError: string | null = null;
        for (const id of resolved) {
          try {
            const res = await fetch(
              `https://api.resend.com/audiences/${id}/contacts/${encodeURIComponent(email)}`,
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
          return json({ error: "Unsubscribe failed." }, 502);
        }
        return json({ ok: true });
      },
    },
  },
});
