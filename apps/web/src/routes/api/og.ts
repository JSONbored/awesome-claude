import { createApiFileRoute } from "@/lib/api/file-route";
import { createApiHandler } from "@/lib/api/router";

const PNG_1X1_TRANSPARENT = Uint8Array.from(
  atob(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=",
  ),
  (char) => char.charCodeAt(0),
);

export const GET = createApiHandler("og.render", async () => {
  return new Response(PNG_1X1_TRANSPARENT, {
    headers: {
      "content-type": "image/png",
      "cache-control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
});

export const Route = createApiFileRoute("/api/og")({
  server: {
    handlers: {
      GET: async ({ request, params }) => GET(request, { params }),
    },
  },
});
