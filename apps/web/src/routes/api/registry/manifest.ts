import { createApiFileRoute } from "@/lib/api/file-route";

import { createApiHandler } from "@/lib/api/router";
import { getRegistryManifest } from "@/lib/content.server";
import { cachedJsonResponse } from "@/lib/http-cache";

export const GET = createApiHandler("registry.manifest", async ({ request }) => {
  return cachedJsonResponse(request, await getRegistryManifest());
});

export const Route = createApiFileRoute("/api/registry/manifest")({
  server: {
    handlers: {
      GET: async ({ request, params }) => GET(request, { params }),
    },
  },
});
