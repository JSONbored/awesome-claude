import { communitySignalsBatchQueryBodySchema } from "@/lib/api/contracts";
import {
  apiError,
  apiJson,
  createApiHandler,
  type InferApiBody,
} from "@/lib/api/router";
import {
  normalizeCommunityTargetKey,
  normalizeCommunityTargetKind,
  safeCommunitySignalCounts,
  type CommunitySignalTarget,
} from "@/lib/community-signals";

export const POST = createApiHandler(
  "communitySignals.query",
  async ({ body, requestId }) => {
    const payload = body as InferApiBody<
      typeof communitySignalsBatchQueryBodySchema
    >;
    const targets: CommunitySignalTarget[] = [];

    for (const target of payload.targets || []) {
      const targetKind = normalizeCommunityTargetKind(target.targetKind);
      const targetKey = normalizeCommunityTargetKey(target.targetKey);
      if (!targetKind || !targetKey) {
        return apiError("invalid_payload", 400, {
          requestId,
          message:
            "Provide targets as entry/tool with keys like entry:<category>/<slug> or tool:<slug>.",
        });
      }
      targets.push({ targetKind, targetKey });
    }

    const { available, counts } = await safeCommunitySignalCounts(targets);
    return apiJson(
      {
        ok: true,
        available,
        counts,
      },
      {
        headers: { "cache-control": "no-store" },
      },
    );
  },
);
