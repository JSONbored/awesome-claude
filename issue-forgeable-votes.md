# fix(security): registry trending and votes are forgeable — server never mints the uniqueness identity

**Labels:** `security`, `help wanted`

---

## Goal

Replace the client-supplied `clientId` string that currently gates vote idempotency with a server-minted, HMAC-signed identity token so that the `votes_by_client` uniqueness constraint cannot be bypassed by rotating arbitrary UUIDs. Propagate the same fix to the community-signals and intent-events handlers that share the same trust-boundary flaw, and update the trending read path that aggregates all three.

---

## Why this matters

The trending feed at `/api/registry/trending` — and the Raycast and MCP discovery surfaces that consume it — is the primary algorithmic signal HeyClaude exposes for "community-validated" entries. AGENTS.md explicitly names useful community submissions (not low-quality promotion) as the growth path. That contract is currently broken: any actor can push any entry to the top of trending with a shell one-liner because the server trusts the caller to supply its own uniqueness key.

The flaw is structural, not a rate-limit gap:

- **`apps/web/src/app/api/votes/toggle/route.ts:14-29`** — `clientId` is read from the JSON body and only checked for length (8–128 chars). No server-issued cookie, no HMAC, no proof-of-work, no Turnstile.
- **`apps/web/src/lib/votes.ts:118-123`** — that attacker-supplied string is bound directly as the SQL uniqueness column: `INSERT OR IGNORE INTO votes_by_client (entry_key, client_id) VALUES (?, ?)`. A new UUID = a new row = a new upvote.
- **`apps/web/src/app/api/community-signals/route.ts`** and **`apps/web/src/app/api/intent-events/route.ts`** — `session_id` / event counters are also client-supplied and feed the same trending aggregation.
- **`apps/web/src/lib/api-security.ts:78-82`** — the Origin check returns `true` when no `Origin` header is present, so plain `curl` skips it entirely.
- The per-IP rate limit (~45 req/min for votes-toggle, `apps/web/src/lib/api/contracts.ts:886-893`) is the only throttle, and it operates on the wrong dimension. Rotating IPs removes even that constraint.

**Repro sketch (public, unauthenticated):**

```sh
for i in $(seq 1 45); do
  curl -s -X POST https://heyclau.de/api/votes/toggle \
       -H 'content-type: application/json' \
       -d '{"key":"agents:target-entry","clientId":"'$(uuidgen)'","vote":true}'
done
# → 45 distinct upvotes in one minute from one IP
# → ~64,800 synthetic upvotes/day per IP; unbounded across IPs
```

`votes_by_client` does not deduplicate because every row carries a unique `(key, attacker-uuid)` pair. The entry rises in `/api/registry/trending`, which propagates to the Raycast feed and MCP trending resource.

The asymmetry that confirms this is a known-risk surface: `apps/web/src/lib/api/contracts.ts` applies HMAC signing to submissions (line ~259) but not to the vote toggle. The signing infrastructure exists; it was not applied to the trust-gating path.

---

## Current behavior

**`apps/web/src/app/api/votes/toggle/route.ts`:**
- Accepts `{ key, clientId, vote }` from the request body.
- Validates only that `clientId` is a string of length 8–128.
- Passes `clientId` directly to `votes.ts` as the deduplication identity.

**`apps/web/src/lib/votes.ts`:**
- Inserts `(entry_key, client_id)` with `INSERT OR IGNORE` — idempotent per `(key, clientId)` pair, but since `clientId` is caller-chosen, uniqueness is trivially defeated by supplying a fresh value each request.

**`apps/web/src/app/api/community-signals/route.ts`** and **`apps/web/src/app/api/intent-events/route.ts`:**
- Same pattern: client-supplied session/event identifiers gate counter increments.

**`apps/web/src/app/api/registry/trending/route.ts`:**
- Aggregates `safeVoteCounts`, `safeCommunitySignalCounts`, and `safeIntentEventCounts` — all sourced from the tables written by the above handlers.

**`apps/web/src/lib/api-security.ts`:**
- Origin check short-circuits to `true` when `Origin` is absent, allowing CLI clients to bypass it.

---

## Desired behavior

After this fix lands:

1. **Server-minted identity** — On a user's first interaction (or first page load), the server sets an HMAC-signed, HttpOnly cookie (e.g., `hc_vid`) containing a server-generated opaque token. The HMAC key lives in an environment secret (`HC_VID_SECRET`). The token is the only accepted value for the `client_id` column in `votes_by_client`.

2. **Vote toggle validation** — `apps/web/src/app/api/votes/toggle/route.ts` reads the `hc_vid` cookie, verifies its HMAC, and rejects requests whose cookie is absent or tampered. The caller-supplied `clientId` field is removed from the accepted request body; the server derives identity from the verified cookie instead.

3. **Schema migration** — `votes_by_client.client_id` is migrated to store only server-issued tokens. Existing rows without a valid token are treated as anonymous legacy votes and excluded from the trending score (or migrated to a `legacy_votes` table for audit, at maintainer discretion).

4. **Community signals and intent events** — `apps/web/src/app/api/community-signals/route.ts` and `apps/web/src/app/api/intent-events/route.ts` adopt the same server-cookie identity for their session/event deduplication. Client-supplied `session_id` values are no longer accepted as the uniqueness key.

5. **Origin check** — `apps/web/src/lib/api-security.ts` should require a valid `Origin` or `Referer` for state-mutating endpoints, or accept only requests bearing a valid `hc_vid` cookie. Requests with neither are rejected.

6. **Rate limit** — After the above, per-IP rate limiting becomes a defense-in-depth measure rather than the primary control. Its thresholds may be tightened, but they are not the primary fix.

7. **Trending read path** — `apps/web/src/app/api/registry/trending/route.ts` requires no logic change once the write-path identity is fixed, but the migration must ensure the score recalculation excludes legacy synthetic rows.

---

## Scope

- `apps/web/src/app/api/votes/toggle/route.ts` — replace body-supplied `clientId` with cookie verification
- `apps/web/src/lib/votes.ts` — update insert/read logic for server-issued identity
- `apps/web/src/app/api/community-signals/route.ts` — adopt server cookie identity for deduplication
- `apps/web/src/app/api/intent-events/route.ts` — adopt server cookie identity for deduplication
- `apps/web/src/lib/api-security.ts` — tighten origin/cookie requirements for state-mutating endpoints
- `apps/web/src/lib/api/contracts.ts` — update vote-toggle contract to remove `clientId` from request schema
- D1 migration script for `votes_by_client.client_id` column semantics
- `apps/web/src/` utility for server-side HMAC cookie minting and verification
- Tests covering: valid cookie upvote (idempotent), missing cookie rejection, tampered HMAC rejection, repeated-UUID no longer inflates count

---

## Out of scope

- GitHub OAuth or account-level authentication (a larger scope change; the cookie approach is sufficient for anonymous deduplication)
- Raycast or MCP read-path changes (they consume `/api/registry/trending`; fixing the write path is sufficient)
- README generation pipeline (separate structural issue)
- Content imports or generated registry artifacts
- UI redesign of the vote button component beyond the minimal change needed to drop the `clientId` field from the request

---

## Acceptance criteria

- Sending `POST /api/votes/toggle` 100 times with 100 distinct `clientId` values but the same `hc_vid` cookie results in exactly 1 upvote row in `votes_by_client`.
- Sending `POST /api/votes/toggle` without an `hc_vid` cookie returns HTTP 401 or 403.
- Sending `POST /api/votes/toggle` with a tampered HMAC in the `hc_vid` cookie returns HTTP 401 or 403.
- The trending score for an entry that received 100 synthetic requests in the old scheme does not increase after the migration.
- `apps/web/src/lib/api/contracts.ts` no longer includes `clientId` in the vote-toggle request schema.
- `apps/web/src/lib/api-security.ts` origin check does not short-circuit to `true` for absent `Origin` on state-mutating routes.
- All existing vote and trending tests pass (or are updated to use the cookie-based flow).
- PR includes `Closes #<this issue>` and a D1 migration script.
- No generated artifact churn in the PR diff.

---

## Quality evidence required in the PR

- Show a before/after curl session: before the fix, 3 requests with 3 different `clientId` values each increment the count; after the fix, only the first request with a valid cookie does.
- Show that `POST /api/votes/toggle` with no cookie returns a 4xx response.
- List the D1 migration statement and explain how existing rows are handled (excluded, migrated, or zeroed).
- List every changed route, handler, and library file.
- Note API backward-compatibility: if any Raycast extension or MCP client currently sends `clientId` in the request body, describe the migration path.

---

## Validation

```sh
pnpm validate:openapi
pnpm exec vitest run tests/api-contracts.test.ts tests/api-router-security.test.ts
pnpm exec vitest run tests/submission-api.test.ts 2>/dev/null || true
pnpm build
git diff --check
```

Manual smoke test against a staging/preview deployment:

```sh
# Should return 4xx with no cookie
curl -s -o /dev/null -w "%{http_code}" -X POST https://<staging>/api/votes/toggle \
     -H 'content-type: application/json' \
     -d '{"key":"agents:test","vote":true}'

# Should return 2xx exactly once regardless of how many times called
for i in 1 2 3; do
  curl -s -X POST https://<staging>/api/votes/toggle \
       -H 'content-type: application/json' \
       --cookie "hc_vid=<valid-server-issued-token>" \
       -d '{"key":"agents:test","vote":true}'
done
```

---

## Contributor guardrails

- [ ] Generated artifacts stay out of scope unless this issue explicitly asks for them.
- [ ] PRs should use a Conventional Commit-style title and include `Closes #<issue>`.
- [ ] UI or page changes must include screenshots in the PR, or explain `No visual impact`.

---

## Non-duplication confirmation

Verified against all open issues (pages 1–2) and closed issues (pages 1–4) as of 2026-05-28. **#564** ("fix(d1-votes): vote sync never prunes orphaned D1 rows; verify ignores surplus keys") is a data-hygiene bug in the D1 sync verifier — it does not touch vote authentication, the `client_id` uniqueness key, or trending forgeability. Even after #564 lands, identity remains client-supplied and trending remains forgeable. **#501** (closed, "feat(mcp): expose jobs and trending resources") added trending as an MCP resource but did not address write-path authentication. No open or closed issue touches `votes/toggle/route.ts` identity validation, `votes_by_client.client_id` trust, or community-signal/intent-event deduplication authentication.
