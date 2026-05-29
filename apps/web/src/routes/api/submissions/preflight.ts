import { createApiFileRoute } from "@/lib/api/file-route";

import { buildSubmissionPreflight } from "@/lib/submission-preflight";
import { apiJson, createApiHandler, type InferApiBody } from "@/lib/api/router";
import { submissionPreflightBodySchema } from "@/lib/api/contracts";
import { logApiInfo } from "@/lib/api-logs";

export const POST = createApiHandler("submissions.preflight", async ({ request, body }) => {
  const payload = body as InferApiBody<typeof submissionPreflightBodySchema>;
  if (String(payload.honeypot ?? "").trim()) {
    logApiInfo(request, "submissions.preflight.honeypot_discarded");
    return apiJson(
      { ok: true, valid: false, queued: false },
      { headers: { "cache-control": "no-store" } },
    );
  }

  const fields = payload.fields && typeof payload.fields === "object" ? payload.fields : {};
  const preflight = await buildSubmissionPreflight(fields);
  return apiJson(preflight, {
    headers: { "cache-control": "no-store" },
  });
});

export const Route = createApiFileRoute("/api/submissions/preflight")({
  server: {
    handlers: {
      POST: async ({ request, params }) => POST(request, { params }),
    },
  },
});
