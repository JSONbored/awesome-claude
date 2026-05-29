import { createApiFileRoute } from "@/lib/api/file-route";

import { communitySignalsBatchQueryBodySchema } from "@/lib/api/contracts";
import { apiError, apiJson, createApiHandler, type InferApiBody } from "@/lib/api/router";
import {
  normalizeCommunitySignalTarget,
  safeCommunitySignalCounts,
  type CommunitySignalTarget,
} from "@/lib/community-signals";

export const POST = createApiHandler("communitySignals.query", async ({ body, requestId }) => {
  const payload = body as InferApiBody<typeof communitySignalsBatchQueryBodySchema>;
  const targets: CommunitySignalTarget[] = [];

  for (const target of payload.targets || []) {
    const normalizedTarget = normalizeCommunitySignalTarget(target.targetKind, target.targetKey);
    if (!normalizedTarget) {
      return apiError("invalid_payload", 400, {
        requestId,
        message:
          "Provide targets as entry/tool with keys like entry:<category>/<slug> or tool:<slug>.",
      });
    }
    targets.push(normalizedTarget);
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
});

export const Route = createApiFileRoute("/api/community-signals/query")({
  server: {
    handlers: {
      POST: async ({ request, params }) => POST(request, { params }),
    },
  },
});
