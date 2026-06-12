# API Security Contract

HeyClaude exposes a public read-only registry API plus a small set of limited
dynamic endpoints. Registry publishing is not exposed over the public API.

## Public Read-Only Surfaces

- `/api/registry/manifest`
- `/api/registry/categories`
- `/api/registry/search`
- `/api/registry/feed`
- `/api/registry/diff`
- `/api/registry/entries/{category}/{slug}`
- `/api/registry/entries/{category}/{slug}/llms`
- `/api/mcp`
- `/data/*.json` registry artifacts
- `/data/feeds/index.json`
- `/data/feeds/categories/{category}.json`
- `/data/feeds/platforms/{platform}.json`
- `/data/skill-adapters/...` generated adapters
- `/feed.xml` and static registry changelog artifacts

## Limited Dynamic Surfaces

- `/api/votes/query`
- `/api/votes/toggle`
- `/api/community-signals`
- `/api/community-signals/query`
- `/api/intent-events`
- `/api/newsletter/subscribe`
- `/api/newsletter/webhook`
- `/api/og`
- `/api/submissions/preflight`
- `/api/listing-leads`
- `/api/admin/listing-leads`
- `/api/admin/jobs`
- `/api/admin/jobs/health`

## Controls

- API route contracts live in `apps/web/src/lib/api/contracts.ts`. Route files
  under `apps/web/src/routes/api/**` are thin TanStack server handlers that
  delegate to the central router in `apps/web/src/lib/api/router.ts`.
- Request params, queries, and JSON bodies are validated with Zod. The generated
  OpenAPI document in `cloudflare/api-schema-heyclaude-openapi.yaml` is derived
  from those Zod contracts with `pnpm generate:openapi` and checked with
  `pnpm validate:openapi`.
- API errors use one normalized envelope:
  `{ ok: false, error: { code, message, details? }, requestId? }`.
- Public browser-facing endpoints keep origin checks and route-level rate limits.
- JSON writes require content-type validation and payload size limits.
- Admin review endpoints require bearer or admin-token headers.
- Webhooks require provider signatures when configured.
- Newsletter template syncing is a local operator script that talks to Resend
  Templates only; the public site does not expose campaign-send, scheduling, or
  template-management endpoints.
- Website submission preflight requires origin checks, payload limits, schema
  validation, honeypot discard logging, and existing-content duplicate checks.
  It never creates GitHub issues, branches, pull requests, labels, comments, or
  registry content.
- Website submissions do not accept or publish package uploads. Community
  ZIP/MCPB artifacts are review/quarantine material only; public downloads are
  maintainer-built artifacts after review.
- PR creation and final review happen in the private Cloudflare submission gate
  through GitHub App user auth, webhooks, Queues, Durable Objects, and D1/R2.
- Cloudflare rate-limit bindings are configured for registry, dynamic, strict,
  and MCP routes. The public no-key MCP endpoint uses a dedicated
  `API_MCP_RATE_LIMIT` binding with a `60 requests/minute/IP` production cap.
  In-process limits remain a local/dev fallback when the Worker binding is
  unavailable.
- Worker responses attach security headers in code as well as static asset
  headers: CSP, HSTS, `X-Frame-Options`, `X-Content-Type-Options`,
  `Referrer-Policy`, `Permissions-Policy`, and `Cross-Origin-Opener-Policy`.
- No public website endpoint may import content into the registry or publish
  submissions directly. Content PR creation and direct merge decisions are
  isolated in the private submission gate after public checks and private
  maintainer review pass.
- Job lead intake is intentionally shallow. Paid job publication remains gated
  by the token-protected D1 admin flow, which requires enriched reviewed listing
  content before active paid rows can publish.

## Registry Endpoint Change Checklist

Registry API PRs need a separate review path from content-only submission
fallbacks. A clean CodeRabbit review or a skipped bot review is not enough for a
new or changed registry endpoint. Review these surfaces together:

- Route handler: add or update the thin handler under
  `apps/web/src/routes/api/**` and keep request handling delegated through the
  central API router.
- Contract: add or update the matching route definition in
  `apps/web/src/lib/api/contracts.ts`, including method, path, route id, tags,
  response schema, error responses, origin-check setting, and rate-limit scope.
- Runtime posture: state whether the endpoint is read-only or write-capable,
  whether browser origin checks apply, which Cloudflare rate-limit binding is
  used, and whether auth, webhook signatures, payload limits, or content-type
  checks are required.
- Source logic: keep registry aggregation or lookup behavior in the shared
  content/server layer rather than duplicating registry traversal in the route
  file.
- Tests: update `tests/api-contracts.test.ts` and focused route/router tests so
  route coverage, ids, paths, schemas, examples, and error envelopes stay
  deterministic.
- OpenAPI: run `pnpm validate:openapi` or document why it was not run. Generated
  files such as `apps/web/public/openapi.{json,yaml}`,
  `apps/web/src/data/openapi.ts`, and
  `cloudflare/api-schema-heyclaude-openapi.yaml` must come from the generator;
  do not hand-edit them.
- Reproducibility: for maintainer/internal generation PRs, confirm generator
  output is reproducible and generated diffs are limited to the endpoint change.
  For external contributor PRs, prefer source route/contract/test changes and
  leave generated artifact commits to maintainer automation.
- Linked issue: link the issue being solved, or write an explicit
  maintainer-lane no-issue rationale in the PR body so advisory bots do not
  keep surfacing missing-link noise.

## Registry Trust Fields

Registry feeds and entry detail payloads may include `trustSignals` derived from
existing file-backed facts:

- package verification flags, first-party/external trust, and package SHA256
- source URLs already present on the entry
- content/repository/verification timestamps already present on the entry
- generated adapter status and platform compatibility

These fields are factual metadata, not paid ranking or live health claims. Live
link health checks can be added later as a separate generated artifact once they
are backed by a real checker.
