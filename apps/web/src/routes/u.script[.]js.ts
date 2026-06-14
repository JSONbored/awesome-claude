import { createFileRoute } from "@tanstack/react-router";

import { getEnvString } from "@/lib/cloudflare-env.server";

const DEFAULT_UPSTREAM = "https://tasty.aethereal.dev";

/**
 * First-party umami tracker proxy.
 *
 * Serving the analytics script from our own origin (instead of a third-party
 * `script-src`) keeps the CSP to `'self'` — no external eTLD+1 trust boundary —
 * and makes the tracker resilient to ad blockers. The browser only ever talks
 * to heyclau.de; this worker fetches the script from the umami instance
 * server-side. Served under `/u/` so umami auto-derives its collector from the
 * script directory (`/u/api/send`, see u.api.send.ts) — keeping both out of the
 * product `/api/` namespace and its central-router contract.
 */
export const Route = createFileRoute("/u/script.js")({
  server: {
    handlers: {
      GET: async () => {
        const upstream = getEnvString("UMAMI_UPSTREAM_URL") || DEFAULT_UPSTREAM;
        try {
          const response = await fetch(`${upstream}/script.js`, {
            signal: AbortSignal.timeout(8000),
          });
          if (!response.ok) return new Response("", { status: 502 });
          const body = await response.text();
          return new Response(body, {
            status: 200,
            headers: {
              "content-type": "application/javascript; charset=utf-8",
              // Tracker changes rarely; cache at the edge + browser for a day.
              "cache-control": "public, max-age=86400, s-maxage=86400",
            },
          });
        } catch {
          return new Response("", { status: 502 });
        }
      },
    },
  },
});
