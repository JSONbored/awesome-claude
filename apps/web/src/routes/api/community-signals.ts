import { createApiFileRoute } from "@/lib/api/file-route";

import { communitySignalsBodySchema, communitySignalsQuerySchema } from "@/lib/api/contracts";
import {
  apiError,
  apiJson,
  createApiHandler,
  type InferApiBody,
  type InferApiQuery,
} from "@/lib/api/router";
import { logApiWarn } from "@/lib/api-logs";
import {
  normalizeCommunityClientId,
  normalizeCommunitySignalTarget,
  normalizeCommunitySignalType,
  queryCommunitySignalCounts,
  safeCommunitySignalCounts,
  ZERO_COMMUNITY_SIGNAL_COUNTS,
} from "@/lib/community-signals";
import { getSiteDb } from "@/lib/db";

export const GET = createApiHandler("communitySignals.read", async ({ query, requestId }) => {
  const payload = query as InferApiQuery<typeof communitySignalsQuerySchema>;
  const target = normalizeCommunitySignalTarget(payload.targetKind, payload.targetKey);

  if (!target) {
    return apiError("invalid_payload", 400, {
      requestId,
      message:
        "Provide targetKind as entry/tool and targetKey as entry:<category>/<slug> or tool:<slug>.",
    });
  }

  const { targetKind, targetKey } = target;
  const { available, counts } = await safeCommunitySignalCounts([target]);
  return apiJson({
    ok: true,
    available,
    targetKind,
    targetKey,
    counts: counts[targetKey] || { ...ZERO_COMMUNITY_SIGNAL_COUNTS },
  });
});

export const POST = createApiHandler(
  "communitySignals.write",
  async ({ body, request, requestId }) => {
    const payload = body as InferApiBody<typeof communitySignalsBodySchema>;
    const target = normalizeCommunitySignalTarget(payload.targetKind, payload.targetKey);
    const signalType = normalizeCommunitySignalType(payload.signalType);
    const clientId = normalizeCommunityClientId(payload.clientId);

    if (!target || !signalType || !clientId) {
      return apiError("invalid_payload", 400, {
        requestId,
        message: "Provide targetKind, targetKey, signalType, and clientId.",
      });
    }

    const { targetKind, targetKey } = target;
    try {
      const db = getSiteDb();
      if (!db) {
        return apiJson(
          {
            ok: true,
            stored: false,
            available: false,
            targetKind,
            targetKey,
            counts: { ...ZERO_COMMUNITY_SIGNAL_COUNTS },
          },
          { status: 200 },
        );
      }

      if (payload.active === false) {
        await db
          .prepare(
            `DELETE FROM community_signals
           WHERE target_kind = ? AND target_key = ? AND signal_type = ? AND client_id = ?`,
          )
          .bind(targetKind, targetKey, signalType, clientId)
          .run();
      } else {
        await db
          .prepare(
            `INSERT INTO community_signals (
             target_kind,
             target_key,
             signal_type,
             client_id,
             created_at,
             updated_at
           )
           VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
           ON CONFLICT(target_kind, target_key, signal_type, client_id)
           DO UPDATE SET updated_at = CURRENT_TIMESTAMP`,
          )
          .bind(targetKind, targetKey, signalType, clientId)
          .run();
      }

      const counts = await queryCommunitySignalCounts(db, [target]);
      return apiJson(
        {
          ok: true,
          stored: true,
          available: true,
          targetKind,
          targetKey,
          counts: counts[targetKey] || { ...ZERO_COMMUNITY_SIGNAL_COUNTS },
        },
        { status: 200 },
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (!message.includes("no such table: community_signals") && !message.includes("SITE_DB")) {
        logApiWarn(request, "community_signals.store_failed", {
          error: message,
          signalType,
          targetKey,
          targetKind,
        });
      }

      const { counts } = await safeCommunitySignalCounts([target]);
      return apiJson(
        {
          ok: true,
          stored: false,
          available: false,
          targetKind,
          targetKey,
          counts: counts[targetKey] || { ...ZERO_COMMUNITY_SIGNAL_COUNTS },
        },
        { status: 200 },
      );
    }
  },
);

export const Route = createApiFileRoute("/api/community-signals")({
  server: {
    handlers: {
      GET: async ({ request, params }) => GET(request, { params }),
      POST: async ({ request, params }) => POST(request, { params }),
    },
  },
});
