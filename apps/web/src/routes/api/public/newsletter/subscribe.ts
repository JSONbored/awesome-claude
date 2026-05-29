/**
 * POST /api/public/newsletter/subscribe
 *
 * Mimics the legacy awesome-claude pattern: raw fetch to Resend's Contacts API,
 * no SDK. Resolves abstract follow IDs (e.g. "category:mcp", "changelog:security")
 * to Resend segment IDs via env vars; unknown IDs are dropped silently so we
 * never reveal which segments exist.
 *
 * Required Cloudflare Worker secrets:
 *   RESEND_API_KEY           — required, no-ops cleanly if absent (returns 503)
 *   RESEND_SEGMENT_ID        — general newsletter segment (always added)
 *   RESEND_SEGMENT_<NAME>    — per-follow segments, where NAME is upper-snake
 *                              of the follow id (e.g. category:mcp →
 *                              RESEND_SEGMENT_CATEGORY_MCP)
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
  source: z
    .string()
    .min(1)
    .max(64)
    .regex(/^[a-z0-9_-]+$/i)
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
export const Route = createFileRoute("/api/public/newsletter/subscribe")({
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
          return json({ error: "Invalid request.", details: parsed.error.flatten() }, 400);
        }

        const { email, segments = [], source = "site" } = parsed.data;

        const segmentIds = new Set<string>([generalSegment]);
        for (const s of segments) {
          const id = envSegmentId(s);
          if (id) segmentIds.add(id);
        }

        const body = {
          email,
          unsubscribed: false,
          first_name: "",
          last_name: "",
          metadata: { source },
          segments: [...segmentIds].map((id) => ({ id })),
        };

        let res: Response;
        try {
          res = await fetch("https://api.resend.com/contacts", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
            signal: AbortSignal.timeout(8000),
          });
        } catch {
          return json({ error: "Newsletter provider is unreachable." }, 502);
        }

        // Resend returns 409 for duplicate contacts — treat as success so we
        // never leak whether an address is already subscribed.
        if (!res.ok && res.status !== 409) {
          return json({ error: "Subscribe failed." }, 502);
        }

        return json({ ok: true });
      },
    },
  },
});
