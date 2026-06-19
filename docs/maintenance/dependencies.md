# Dependency hygiene

How we keep dependencies current without destabilizing the build. Tracks the
Renovate **Dependency Dashboard** (issue #300).

## Current posture (snapshot)

The standing backlog is almost entirely **patch-level** bumps:

- ~25 `@radix-ui/react-*` packages, each one patch behind (e.g. `1.1.15 → 1.1.16`).
- `@commitlint/cli` + `@commitlint/config-conventional` (`21.0.1 → 21.0.2`).

These are safe to batch. There are no known-vulnerable advisories outstanding; run
`pnpm -r outdated` for the live list and `pnpm audit` for advisories.

## Triage cadence

1. **Monthly** — review the Renovate Dependency Dashboard (#300). Batch-merge the
   grouped **patch + minor** updates once CI is green (do not merge red bumps).
2. **Per-PR** — every dependency bump must pass the full required gate
   (`required-pr-gate` → `validate-web` build + the vitest suite) before merge.
   A green type-check alone is not sufficient — the build and tests must pass.
3. **Majors** — review individually; read the changelog/migration notes, run
   `pnpm --filter web build` + the suite locally, and prefer the Cloudflare
   preview build as a runtime check before merging.

## Priorities

- **Security/runtime-sensitive first:** `wrangler`, `vite`, `@cloudflare/*`,
  `workers-og` (WASM), `sanitize-html`, `marked`, auth/crypto deps.
- **TanStack (`@tanstack/react-router`, `@tanstack/react-start`)** — keep current
  and **watch releases for CSP `nonce` support**, which is the upstream blocker for
  the deferred nonce-based CSP (issue #2207). Bump promptly when nonce support lands.
- **Radix UI / lucide / UI libs** — low risk, batch on the monthly cadence.

## Cautions

- The Vite build is wrapped by `@lovable.dev/vite-tanstack-config`. Do **not** bump
  Vite or that wrapper blindly — verify the SSR build (`pnpm --filter web build`)
  and a Cloudflare preview build before merging.
- `pnpm-lock.yaml` is the source of truth; CI runs `pnpm install --frozen-lockfile`,
  so commit the updated lockfile with every dependency change.
- Keep dependency bumps **separate from feature/content PRs** so a bad bump is easy
  to revert.
