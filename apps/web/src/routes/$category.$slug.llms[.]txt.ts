import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$category/$slug/llms.txt")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const url = new URL(
          `/api/registry/entries/${encodeURIComponent(params.category)}/${encodeURIComponent(params.slug)}/llms`,
          request.url,
        );
        return Response.redirect(url, 301);
      },
    },
  },
});
