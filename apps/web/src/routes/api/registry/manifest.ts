import { createFileRoute } from "@tanstack/react-router";

import { createApiHandler } from "@/lib/api/router";
import { getRegistryManifest } from "@/lib/content";
import { cachedJsonResponse } from "@/lib/http-cache";

export const GET = createApiHandler("registry.manifest", async ({ request }) => {
  return cachedJsonResponse(request, await getRegistryManifest());
});

// @ts-ignore Generated API route is added to routeTree during Vite build.
export const Route = createFileRoute("/api/registry/manifest")({
  server: {
    handlers: {
      GET: async ({ request, params }) => GET(request, { params }),
    },
  },
});
