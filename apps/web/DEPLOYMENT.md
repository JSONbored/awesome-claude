# Web Deployment Notes (TanStack Start on Cloudflare)

## Runtime model

- This project deploys as a TanStack Start app bundled by Vite/Nitro for
  Cloudflare Workers.
- Production worker: `heyclaude-prod`
- Development worker: `heyclaude-dev`
- File routes under `apps/web/src/routes/**` include both page routes and
  server-side API handlers that run inside each Worker.

## Required bindings

Configured in [`wrangler.jsonc`](./wrangler.jsonc):

- `SITE_DB` (D1) for durable upvotes, reviewed jobs listings, listing leads, commercial placements, community signals, and future dynamic site state.
- Production uses the existing `heyclaude-votes` database for continuity.
- Development uses the separate `heyclaude-dev-site-state` database so PR/dev
  testing does not mutate production votes, jobs, leads, or community signals.
- `API_REGISTRY_RATE_LIMIT`, `API_DYNAMIC_RATE_LIMIT`,
  `API_STRICT_RATE_LIMIT`, and `API_MCP_RATE_LIMIT` for Cloudflare-native
  per-route rate limiting. The MCP binding is intentionally separate so the
  public no-key MCP endpoint keeps a durable `60 requests/minute/IP` production
  cap. The app also keeps an in-process development fallback, but production
  should rely on the Worker bindings configured in `wrangler.jsonc`.

## D1 setup

1. Create database:

```bash
pnpm --filter web exec wrangler d1 create heyclaude-site-state
```

2. Set `database_name` and `database_id` returned by Cloudflare in [`wrangler.jsonc`](./wrangler.jsonc) for `SITE_DB`.

Production currently points at the historical `heyclaude-votes` database name
for continuity. The binding is the source of truth; new environments should use
a site-state name because the same D1 database now stores votes, jobs, leads,
placements, intents, and community signals.

3. Apply migrations:

```bash
pnpm --filter web db:migrate:remote
pnpm --filter web exec wrangler d1 migrations apply SITE_DB --remote --env dev
```

Local migration:

```bash
pnpm --filter web db:migrate:local
```

Current migrations include:

- `0001_votes.sql` for upvotes
- `0002_jobs.sql` for reviewed jobs listing records
- `0003_commercial_leads.sql` for job/tool listing leads and commercial placement windows
- `0004_intent_events.sql` for privacy-light copy/open/install/download/vote intent counters
- `0005_community_signals.sql` for used-this, works-for-me, and reported-broken listing signals
- `0006_jobs_curation_and_claims.sql` for curated job source fields, claim leads, and stale job review states
- `0007_jobs_admin_indexes.sql` for reviewed job admin queues, expiry checks, and paid placement windows
- `0008_jobs_compensation_metadata.sql` for dedicated salary, equity, bonus, and benefits/perks job metadata

The jobs board renders active reviewed D1 rows only. Curated, employer-submitted,
claimed, featured, and sponsored jobs all go through the same private D1-backed
review path. Closed, stale-review, archived, or expired roles are excluded from
the public jobs index, sitemap, and JobPosting data. Compensation metadata is
split into salary, equity, bonus, and benefits/perks fields so salary ranges can
feed `JobPosting.baseSalary` truthfully without mixing in equity or bonus copy.
Public job intake stays shallow and lead-first. The strict content-quality gate
only applies when private reviewed rows are activated as paid `standard`,
`featured`, or `sponsored` listings.

Before a release, validate the jobs schema against local, dev, and production
D1. Remote checks require a Cloudflare API token with D1 read access:

```bash
pnpm --filter web db:migrate:local
pnpm validate:d1-jobs -- --local
CLOUDFLARE_API_TOKEN=... pnpm validate:d1-jobs -- --remote --env dev
CLOUDFLARE_API_TOKEN=... pnpm validate:d1-jobs -- --remote
```

Reviewed jobs are managed through the token-protected admin API and CLI, never
through public repository seed files:

```bash
ADMIN_API_TOKEN=... pnpm jobs:admin health --base-url https://dev.heyclau.de
ADMIN_API_TOKEN=... pnpm jobs:admin upsert --base-url https://dev.heyclau.de --file job.json
ADMIN_API_TOKEN=... pnpm jobs:admin transition --base-url https://dev.heyclau.de --slug example-role --action activate
ADMIN_API_TOKEN=... pnpm jobs:check-sources -- --base-url https://dev.heyclau.de
ADMIN_API_TOKEN=... pnpm jobs:check-sources -- --base-url https://dev.heyclau.de --apply
```

The source checker reads active and stale-review jobs. Healthy source pages are
revalidated, first failed checks move to `stale_pending_review`, and repeated
failures are closed. Healthy stale-review jobs reactivate only when the live
source check and public exposure gate both pass. Shallow active rows, source
mismatches, closed source pages, or missing apply signals are kept out of public
jobs, sitemap coverage, and `JobPosting` JSON-LD. See
`docs/jobs-revenue-ops.md` for the lead review, scheduled source revalidation,
enrichment, Polar handoff, and follow-up templates.

## Build/deploy commands

These are the project-standard commands:

```bash
pnpm --filter web deploy:prod
```

That command runs:

1. registry artifact generation
2. `vite build`, which emits `dist/client` and `dist/server/index.mjs`
3. `wrangler deploy --config wrangler.jsonc --env ""`

Development deploy:

```bash
pnpm --filter web deploy:dev
```

That command targets `heyclaude-dev` with:

```bash
wrangler deploy --config wrangler.jsonc --env dev
```

Always pass the explicit Wrangler config and environment. TanStack/Nitro emits a
redirected `dist/server/wrangler.json`; invoking `wrangler deploy` without
`--config wrangler.jsonc` can make Wrangler validate that generated redirected
config and reject it when environments are present.

For local Worker-runtime preview:

```bash
pnpm --filter web preview
```

After production is deployed and the new sitemap is live, IndexNow can be
submitted with:

```bash
INDEXNOW_SUBMIT=1 pnpm indexnow:submit
```

The public key file is committed under `apps/web/public/` and served from the
site root. See [`docs/indexnow.md`](../../docs/indexnow.md) for dry-run and CI
guard details.

PR previews must pass artifact validation before merge:

```bash
pnpm validate:deployment-artifacts -- --base-url https://<preview-host>
```

CI resolves the preview URL automatically. For same-repo PRs with Cloudflare
credentials, `.github/workflows/content-validation.yml` deploys the PR SHA to
the shared `heyclaude-dev` Worker and validates that URL. If Cloudflare branch
or PR previews publish GitHub Deployment statuses, CI validates the deployment
`environment_url` instead. `DEPLOYMENT_ARTIFACT_BASE_URL` is only a local
escape hatch for the validation script, not the pull-request merge gate.

## Newsletter (Resend)

Set secrets/vars in Cloudflare:

```bash
pnpm --filter web exec wrangler secret put RESEND_API_KEY
pnpm --filter web exec wrangler secret put RESEND_SEGMENT_ID
pnpm --filter web exec wrangler secret put RESEND_WEBHOOK_SECRET
pnpm --filter web exec wrangler secret put DISCORD_WEBHOOK_URL
```

Public vars (non-secret), set in Cloudflare dashboard for each worker environment:

These names are preserved for deployment compatibility even though the app is no
longer a Next.js app.

- `NEXT_PUBLIC_DISCORD_URL`
- `NEXT_PUBLIC_TWITTER_URL`
- `NEXT_PUBLIC_POLAR_SPONSORED_JOB_URL`
- `NEXT_PUBLIC_POLAR_FEATURED_JOB_URL`
- `NEXT_PUBLIC_POLAR_JOB_BOARD_URL`
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- `SUBMISSIONS_REQUIRE_TURNSTILE`

Use separate production and development Turnstile widgets/secrets. The public
site key is non-secret, but the matching `TURNSTILE_SECRET_KEY` must be set as a
Worker secret for the same environment. If `SUBMISSIONS_REQUIRE_TURNSTILE=1`
and the secret is missing, submission creation deliberately returns a 503 with a
GitHub issue fallback URL rather than accepting unauthenticated writes.

The development Worker uses Cloudflare's official always-pass Turnstile test
site key in `wrangler.jsonc`, so it must be paired with the matching official
test secret in the dev Worker only:

```bash
printf '%s' '1x0000000000000000000000000000000AA' |
  pnpm --filter web exec wrangler secret put TURNSTILE_SECRET_KEY --env dev
```

Required secrets, per environment:

```bash
pnpm --filter web exec wrangler secret put TURNSTILE_SECRET_KEY
pnpm --filter web exec wrangler secret put GITHUB_SUBMISSIONS_TOKEN
pnpm --filter web exec wrangler secret put ADMIN_API_TOKEN
```

For local development, copy `.dev.vars.example` to `.dev.vars` and fill values.

React Email source templates live in `emails/src/`. Render static Resend
Broadcast artifacts with:

```bash
pnpm email:render
pnpm validate:emails
```

To sync rendered templates into the Resend Templates dashboard for visual review
and manual Broadcast use:

```bash
pnpm resend:sync-templates -- --dry-run
RESEND_API_KEY=... pnpm resend:sync-templates -- --apply
```

If a template already exists, set the matching ignored local env var before
running `--apply`: `RESEND_TEMPLATE_CURATED_DROP_ID`,
`RESEND_TEMPLATE_RELEASE_NOTES_ID`, or `RESEND_TEMPLATE_MAINTAINER_CALL_ID`.
The sync command creates or updates draft templates only. It does not publish
templates, create Broadcasts, schedule campaigns, or send email. Keep those
steps manual inside Resend.

## TanStack/Nitro Cloudflare notes used in this project

- `apps/web/vite.config.ts` enables TanStack Start with Nitro output.
- `apps/web/src/server.ts` wraps requests in Cloudflare runtime context so API
  helpers can read Worker bindings without importing framework-specific globals.
- `wrangler.jsonc` points at `dist/server/index.mjs` and `dist/client`.
- Nitro also writes generated deployment metadata under `dist/`; generated
  build output must not be committed.
- Static asset cache headers are set in `public/_headers`.

## Git-integrated Cloudflare worker settings

If configuring deployments from the Cloudflare dashboard (Workers + Git):

- Build command: `pnpm --filter web deploy`
- Root directory: repository root
- Build system Node.js version: `22`
- Package manager: `pnpm`
- Production branch: `main` (for `heyclaude-prod`)
- Dev worker (`heyclaude-dev`): map to dedicated development branch
- Environment vars/secrets: configure per worker environment in Cloudflare dashboard
