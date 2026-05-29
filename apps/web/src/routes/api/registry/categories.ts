import { createFileRoute } from "@tanstack/react-router";

import { createApiHandler } from "@/lib/api/router";
import { getCategorySummaries, getRegistryManifest } from "@/lib/content";
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

// @ts-ignore Generated API route is added to routeTree during Vite build.
export const Route = createFileRoute("/api/registry/categories")({
  server: {
    handlers: {
      GET: async ({ request, params }) => GET(request, { params }),
    },
  },
});
