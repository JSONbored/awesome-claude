import { createFileRoute } from "@tanstack/react-router";
import { getEntryLlmsText } from "@/lib/content";
import { respondText } from "@/lib/llms";

export const Route = createFileRoute("/$category/$slug/llms.txt")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const text = await getEntryLlmsText(params.category, params.slug);
        if (!text) return new Response("Not found", { status: 404 });
        return respondText(request, text);
      },
    },
  },
});
