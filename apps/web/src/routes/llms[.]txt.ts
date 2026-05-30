import { createFileRoute } from "@tanstack/react-router";
import { buildLlmsTxt, originOf, respondText } from "@/lib/llms";

export const Route = createFileRoute("/llms.txt")({
  server: {
    handlers: {
      GET: async ({ request }) => respondText(request, buildLlmsTxt(originOf(request))),
    },
  },
});
