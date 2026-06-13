import { createFileRoute } from "@tanstack/react-router";

// There is no /search page — search lives at /browse. Legacy links and the WebSite
// SearchAction template surfaced /search?q=... as a soft 404, so 301 it to the real UI.
export const Route = createFileRoute("/search")({
  server: {
    handlers: {
      GET: ({ request }) => {
        const incoming = new URL(request.url);
        const target = new URL("/browse", incoming.origin);
        const q = incoming.searchParams.get("q");
        if (q) target.searchParams.set("q", q);
        return Response.redirect(target.toString(), 301);
      },
    },
  },
});
