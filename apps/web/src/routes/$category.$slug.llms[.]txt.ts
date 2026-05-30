import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$category/$slug/llms.txt")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const url = new URL(
          `/data/llms/${encodeURIComponent(params.category)}/${encodeURIComponent(params.slug)}.txt`,
          request.url,
        );
        return Response.redirect(url, 301);
      },
    },
  },
});
