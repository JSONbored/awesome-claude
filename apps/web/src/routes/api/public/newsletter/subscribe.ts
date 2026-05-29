import { createApiFileRoute } from "@/lib/api/file-route";
import { POST } from "@/routes/api/newsletter/subscribe";

export const Route = createApiFileRoute("/api/public/newsletter/subscribe")({
  server: {
    handlers: {
      POST: async ({ request, params }) => POST(request, { params }),
    },
  },
});
