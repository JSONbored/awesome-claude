import { createFileRoute } from "@tanstack/react-router";
import { siteConfig } from "@/lib/site";
import { applySecurityHeaders } from "@/lib/security-headers";

export const Route = createFileRoute("/manifest.webmanifest")({
  server: {
    handlers: {
      GET: async () =>
        Response.json(
          {
            name: siteConfig.name,
            short_name: siteConfig.shortName,
            description: siteConfig.description,
            start_url: "/",
            scope: "/",
            display: "standalone",
            background_color: "#f7f5ef",
            theme_color: "#f7f5ef",
            icons: [
              { src: "/favicon.svg", sizes: "32x32", type: "image/svg+xml" },
              { src: "/icon.svg", sizes: "100x100", type: "image/svg+xml" },
              { src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
            ],
          },
          {
            headers: applySecurityHeaders(
              new Headers({
                "content-type": "application/manifest+json; charset=utf-8",
                "cache-control": "public, max-age=3600, stale-while-revalidate=86400",
              }),
            ),
          },
        ),
    },
  },
});
