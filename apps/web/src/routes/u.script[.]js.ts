import { createFileRoute } from "@tanstack/react-router";

/**
 * The first-party umami tracker proxy is intentionally disabled. Serving a
 * script fetched from an external analytics upstream as same-origin JavaScript
 * would allow an upstream compromise to execute in the heyclau.de origin.
 */
export async function GET(): Promise<Response> {
  return new Response(null, {
    status: 404,
    headers: {
      "cache-control": "public, max-age=300, s-maxage=300",
    },
  });
}

export const Route = createFileRoute("/u/script.js")({
  server: {
    handlers: {
      GET: async () => GET(),
    },
  },
});
