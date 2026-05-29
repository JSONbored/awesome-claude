import { createFileRoute } from "@tanstack/react-router";

import { intentEventsBodySchema } from "@/lib/api/contracts";
import { apiError, apiJson, createApiHandler, type InferApiBody } from "@/lib/api/router";
import { logApiWarn } from "@/lib/api-logs";
import { getSiteDb } from "@/lib/db";
import {
  normalizeIntentEntryKey,
  normalizeIntentEventType,
  normalizeIntentSessionId,
} from "@/lib/intent-events";

export const POST = createApiHandler(
  "intentEvents.create",
  async ({ request, body, requestId }) => {
    const payload = body as InferApiBody<typeof intentEventsBodySchema>;
    const eventType = normalizeIntentEventType(payload.type);
    const entryKey = normalizeIntentEntryKey(payload.entryKey);
    const sessionId = normalizeIntentSessionId(payload.sessionId);
    if (!eventType) {
      return apiError("invalid_payload", 400, { requestId });
    }

    const db = getSiteDb();
    if (!db) {
      return apiJson(
        { ok: false, stored: false, reason: "site_db_not_configured" },
        { status: 200, headers: { "cache-control": "no-store" } },
      );
    }

    try {
      await db
        .prepare(
          `INSERT INTO intent_events (
          event_type,
          entry_key,
          source,
          session_id,
          created_at
        ) VALUES (?, ?, 'web', ?, CURRENT_TIMESTAMP)`,
        )
        .bind(eventType, entryKey || null, sessionId || null)
        .run();
      return apiJson({ ok: true, stored: true }, { headers: { "cache-control": "no-store" } });
    } catch {
      logApiWarn(request, "intent_events.insert_failed", { eventType });
      return apiJson(
        { ok: false, stored: false, reason: "insert_failed" },
        { status: 200, headers: { "cache-control": "no-store" } },
      );
    }
  },
);

// @ts-ignore Generated API route is added to routeTree during Vite build.
export const Route = createFileRoute("/api/intent-events")({
  server: {
    handlers: {
      POST: async ({ request, params }) => POST(request, { params }),
    },
  },
});
