# HeyClaude Routes

TanStack Start uses file-based routing from this directory. Keep the Atlas route
structure as the public site contract and adapt backend/data wiring to it rather
than reviving old Next.js paths.

## Conventions

- Canonical entry detail pages live at `/entry/<category>/<slug>`.
- Legacy `/<category>` and `/<category>/<slug>` routes are redirects only.
- Public API handlers live under `routes/api/**` and should stay thin adapters
  around `createApiHandler`.
- Server-only helpers must use `.server.ts` when they import Cloudflare runtime,
  filesystem, Node builtins, generated artifact readers, or MCP server code.
- `routeTree.gen.ts` is generated. Do not edit it by hand.
