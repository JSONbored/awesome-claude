import { createApiFileRoute } from "@/lib/api/file-route";

import { createApiHandler } from "@/lib/api/router";
import { getCategorySummaries, getRegistryManifest } from "@/lib/content.server";
import { cachedJsonResponse } from "@/lib/http-cache";

export const GET = createApiHandler("registry.categories", async ({ request }) => {
  const [manifest, categories] = await Promise.all([getRegistryManifest(), getCategorySummaries()]);

  return cachedJsonResponse(request, {
    schemaVersion: 1,
    generatedAt: manifest.generatedAt,
    count: categories.length,
    entries: categories,
  });
});

export const Route = createApiFileRoute("/api/registry/categories")({
  server: {
    handlers: {
      GET: async ({ request, params }) => GET(request, { params }),
    },
  },
});
