import { createFileRoute } from "@tanstack/react-router";

import { POST } from "@/routes/api/newsletter/subscribe";

// @ts-ignore Generated API route is added to routeTree during Vite build.
export const Route = createFileRoute("/api/public/newsletter/subscribe")({
  server: {
    handlers: {
      POST: async ({ request, params }) => POST(request, { params }),
    },
  },
});
