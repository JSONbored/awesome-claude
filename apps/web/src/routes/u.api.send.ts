import { createFileRoute } from "@tanstack/react-router";

import { getEnvString } from "@/lib/cloudflare-env.server";

const DEFAULT_UPSTREAM = "https://tasty.aethereal.dev";

/**
 * First-party umami collector proxy. The tracker served from `/u/script.js`
 * posts events here (umami derives the collector from the script directory); we
 * forward them to the umami instance server-side, preserving the visitor
 * User-Agent and IP (umami needs both for sessions + geolocation). Keeps
 * `connect-src` to `'self'` — no third-party analytics origin in the CSP. Lives
 * under `/u/` (not `/api/`) since it's infra, not a product API.
 */
export const Route = createFileRoute("/u/api/send")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const upstream = getEnvString("UMAMI_UPSTREAM_URL") || DEFAULT_UPSTREAM;
        const body = await request.text();

        const headers = new Headers({
          "content-type": request.headers.get("content-type") || "application/json",
          // umami drops requests without a User-Agent.
          "user-agent": request.headers.get("user-agent") || "Mozilla/5.0 (compatible; HeyClaude)",
        });
        const clientIp =
          request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for");
        if (clientIp) headers.set("x-forwarded-for", clientIp);

        let response: Response;
        try {
          response = await fetch(`${upstream}/api/send`, {
            method: "POST",
            headers,
            body,
            signal: AbortSignal.timeout(8000),
          });
        } catch {
          return new Response("", { status: 502, headers: { "cache-control": "no-store" } });
        }

        const text = await response.text();
        return new Response(text, {
          status: response.status,
          headers: {
            "content-type": response.headers.get("content-type") || "text/plain; charset=utf-8",
            "cache-control": "no-store",
          },
        });
      },
    },
  },
});
