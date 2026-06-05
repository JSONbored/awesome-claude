import { createApiFileRoute } from "@/lib/api/file-route";

import { createApiHandler } from "@/lib/api/router";
import { getRegistryManifest, getTagDirectory } from "@/lib/content.server";
import { cachedJsonResponse } from "@/lib/http-cache";

export const GET = createApiHandler("registry.tags", async ({ request }) => {
  const [manifest, tags] = await Promise.all([getRegistryManifest(), getTagDirectory()]);

  return cachedJsonResponse(request, {
    schemaVersion: 1,
    generatedAt: manifest.generatedAt,
    count: tags.length,
    entries: tags,
  });
});

export const Route = createApiFileRoute("/api/registry/tags")({
  server: {
    handlers: {
      GET: async ({ request, params }) => GET(request, { params }),
    },
  },
});
