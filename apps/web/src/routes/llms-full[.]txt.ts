import { createFileRoute } from "@tanstack/react-router";
import { buildLlmsFullTxt, originOf, respondText } from "@/lib/llms";

export const Route = createFileRoute("/llms-full.txt")({
  server: {
    handlers: {
      GET: async ({ request }) => respondText(request, buildLlmsFullTxt(originOf(request))),
    },
  },
});
