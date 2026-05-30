import { createFileRoute } from "@tanstack/react-router";
import { renderRobotsTxt } from "@/lib/robots-policy";
import { applySecurityHeaders } from "@/lib/security-headers";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: async () =>
        new Response(renderRobotsTxt(), {
          headers: applySecurityHeaders(
            new Headers({
              "content-type": "text/plain; charset=utf-8",
              "cache-control": "public, max-age=3600, stale-while-revalidate=86400",
            }),
          ),
        }),
    },
  },
});
