# awesome-claude (HeyClaude) contribution — deep reference

Exhaustive tables and detail behind `SKILL.md`. Read the section you need. All commands run
from the repo root unless noted. Bootstrap:

```sh
git clone https://github.com/<you>/awesome-claude && cd awesome-claude   # fork first if external
corepack enable
corepack prepare pnpm@11.1.3 --activate
pnpm install --frozen-lockfile
```

---

## 1. The two kinds of contribution — and why they're really different systems

| | Community content | Platform/code |
|---|---|---|
| What it touches | Exactly one `content/<category>/<slug>.mdx` | `apps/web/src/`, `packages/registry/src/`, `packages/mcp/`, `scripts/`, `.github/workflows/`, tests |
| Who decides merge/close | The **private HeyClaude submission gate** (a Cloudflare Worker, `heyclaude-submission-gate`) | Standard required CI (`validate-content`, `validate-web`, etc.) + maintainer review |
| Is it one-shot? | Yes — intentionally "one-shot and slightly aggressive": ambiguity usually closes the PR with a public reason so the contributor can resubmit cleanly (`docs/submission-queue-ops.md`) | No — normal iterate/fix/re-push |
| Where gittensory-orb fits | **Advisory context only** — linked-issue/no-issue rationale, duplicate/overlap clusters, review burden, Gittensor contributor context. It does **not** replace the HeyClaude gate verdict and does not itself decide content-PR merge/close. | Posts its own advisory readiness/coverage/linked-issue comment on the PR; does not auto-merge. |
| Required validation source-of-truth | `content/SCHEMA.md`, `examples/content/SUBMISSION_EXAMPLES.md`, `pnpm validate:content:strict` | AGENTS.md's command lists (§3 below) |

This split is documented almost entirely in **`docs/submission-queue-ops.md`** — it does not
appear in AGENTS.md or CONTRIBUTING.md, so it's easy to miss if you only skim the top-level
docs. Read that file if anything below is unclear.

---

## 2. The two-gate architecture in detail

### 2a. The private HeyClaude submission gate (content PRs)

- Hosted as a Cloudflare Worker (`heyclaude-submission-gate`, production domain
  `submission-gate.heyclau.de`), **not** part of this public repo's code.
- Governs **single-file content PRs only** — either opened via the website `/submit` flow
  (which authenticates through GitHub App user auth and creates/updates a user-fork PR) or
  a direct single-entry PR opened manually.
- Labels immediately (`submission-under-review`), waits for **required public validation**
  (`validate-content` + Superagent) before running private corpus review, then posts one
  stable marker comment and takes a terminal action:

  | Label | Meaning |
  |---|---|
  | `submission-under-review` | Private worker accepted the webhook, queued a serialized review job |
  | `submission-manual-review` | Source/provenance/package/credentials/safety/category-fit risk needs maintainer judgment |
  | `submission-closed-by-gate` | Worker closed a hard failure or route-away submission |
  | `submission-merged-by-gate` | Worker approved and merged a passing one-file content PR |

- Failed required validation → one terminal comment, PR closed. Green validation is the
  **only** path into private corpus review (category fit, source truth, duplicates,
  package/provenance risk, capability/safety, quality).
- `close` covers: spam, promo/listing attempts, duplicates, unsupported categories,
  generated-artifact tampering, unsafe package/install patterns, missing source of truth,
  protected-field edits, non-content PRs.
- `manual` is rare — reserved for Superagent/private-review outages, merge failures after
  retries, or genuinely close high-risk calls.
- A scheduled sweeper re-queues stale `validation_pending` / `merge_pending` /
  `error_retryable` rows every minute so a missed GitHub check webhook never leaves a PR
  stuck silently.

### 2b. The shared gittensory-orb bot (platform/code PRs)

- The same review bot used across the JSONbored gittensory-gate family
  (gittensory, metagraphed, awesome-claude).
- Posts a PR comment with a readiness score, CI-status summary, linked-issue /
  no-issue-rationale check, duplicate/overlap detection, and (for code changes) a
  coverage-evidence note.
- **Advisory only for this repo's content PRs** — per `docs/submission-queue-ops.md`'s
  Review Fallback Checklist: "Gittensory does not replace the HeyClaude content gate
  verdict." Use it as supporting context (e.g. no-issue rationale, overlap clusters), never
  as the deciding signal for whether a content PR merges or closes.
- For platform/code PRs it is likewise advisory — the merge decision runs through normal
  required CI + maintainer review, not an autonomous gittensory-orb merge/close action (this
  repo does **not** run gittensory's auto-merge/auto-close disposition model; see
  `.gittensory.yml`'s `gate.linkedIssue: advisory` / `duplicates: block` / `readiness:
  advisory` — even the "block" mode here is a duplicate-submission check, not an
  auto-close-on-any-red-CI policy like gittensory/metagraphed run).
- **Automation must never auto-merge** — an explicit boundary from AGENTS.md's Automation
  Boundaries section. Don't design or expect a flow where gittensory-orb merges anything on
  its own in this repo.

---

## 3. Validation commands — pulled verbatim from AGENTS.md

**Common checks** (general platform/code change):

```sh
pnpm validate:content:strict
pnpm validate:packages
pnpm scan:packages
pnpm test:submission-pr-first
pnpm test:registry-artifacts
pnpm validate:raycast-feed
pnpm validate:openapi
pnpm test:mcp
pnpm build
git diff --check
```

**README changes** (`scripts/generate-readme.mjs` or anything affecting generated counts/
listings):

```sh
pnpm generate:readme
pnpm validate:readme
pnpm exec vitest run tests/readme-generation.test.ts tests/submission-workflows.test.ts
pnpm build
git diff --check
```

**Submission/API changes:**

```sh
pnpm validate:openapi
pnpm exec vitest run tests/submission-api.test.ts tests/api-contracts.test.ts tests/api-router-security.test.ts
pnpm exec vitest run tests/submission-gate-worker.test.ts
pnpm test:submission-pr-first
pnpm build
git diff --check
```

**A direct content PR** (CONTRIBUTING.md's narrower path — you do not need the platform
suite above):

```sh
pnpm install --frozen-lockfile
pnpm validate:content:strict
```

Do not run `generate:readme` / `generate:openapi` or commit build output for a one-file
content submission — the website/API/Raycast/LLM/MCP/route artifacts are generated during
CI/build/deploy from the accepted source content.

If you changed categories or submission fields as a maintainer/platform contributor, also
run:

```sh
pnpm generate:readme
pnpm generate:openapi
```

---

## 4. Codecov — the real (enforcing) coverage gate

Confirmed live in `codecov.yml`:

```yaml
coverage:
  status:
    project:
      default:
        target: auto
        threshold: 1%
        informational: false
        if_ci_failed: ignore
        only_pulls: false
    patch:
      default:
        target: 70%
        threshold: 5%
        informational: false
        if_ci_failed: ignore
        only_pulls: true
```

- **`codecov/patch`: `target: 70%`, `threshold: 5%`, `informational: false`.** A PR whose
  changed lines fall below 70% coverage posts a **FAILING** status (not report-only).
- **`codecov/project`: `target: auto`, `threshold: 1%`, `informational: false`.** Compares
  each PR against its own base commit — merging one PR never moves the bar under other
  open PRs (this replaced an older global vitest-threshold ratchet that caused cross-PR
  churn). A real coverage regression beyond 1% posts a FAILING status.
- Coverage is uploaded by `.github/workflows/coverage.yml`, which runs on **code changes
  only** — never on content-only PRs/pushes.
- **Ignored paths** (`codecov.yml`'s own `ignore:` list): `tests`, `**/*.test.ts`,
  `**/*.config.ts`, `apps/web/src/generated`, `apps/web/public/data`, `integrations`.
- The `coverage` workflow is deliberately kept off the required `validate-web` lane
  (v8 instrumentation is slow); `validate-web` runs the plain `pnpm test` instead. Branch
  protection should require the GitHub Actions `coverage` check, not Codecov's
  provider-specific status names directly.
- **Measure locally with `pnpm test:coverage`** (full Vitest suite, v8 coverage,
  `coverage/lcov.info`). Coverage is scoped to what the node suite actually exercises —
  the `registry`/`mcp` packages, web `lib`/`data`/`types`, the submission gate, and build
  scripts. React components/routes are out of scope (not run under the node environment).

This is a real, live-verified change from an earlier "informational (report-only)" posture
— if you find older notes or memory claiming Codecov here is report-only, they are stale;
trust the `codecov.yml` values above.

---

## 5. Linked-issue policy — OPTIONAL here, unlike gittensory/metagraphed

This is the detail most likely to get imported wrong by an agent working across the whole
JSONbored gittensory-gate family. Contrast:

| Repo | `linkedIssuePolicy` | Gate mode | Practical effect |
|---|---|---|---|
| **JSONbored/awesome-claude** (this repo) | `optional` (`.gittensory.yml`) | `gate.linkedIssue: advisory` | A PR with no linked issue is **fine** — CONTRIBUTING.md says so explicitly. No auto-close for a missing/ineligible linked issue. |
| JSONbored/gittensory | `preferred`/required depending on repo scoring | Deterministic **hard rule** | Linking an owner-assigned / maintainer-only / ineligible issue **auto-closes** the contributor PR. |
| JSONbored/metagraphed | Similar hard-rule posture to gittensory | Deterministic **hard rule** | Same auto-close behavior on an ineligible linked issue. |

CONTRIBUTING.md's exact language for this repo: *"Filing your own issue and then opening a
PR that resolves it is welcome, and a PR with no linked issue is fine — neither is
farming."* The only thing that **is** against policy is multi-account farming (one account
opens an issue, a different account you also control "resolves" it to inflate credit) —
that's a conduct violation with cross-repo enforcement, not a linked-issue technicality.

**Do not** carry gittensory/metagraphed's stricter mandatory-linked-issue rule into
awesome-claude — it is not this repo's policy and is not documented anywhere in this repo
as a requirement.

---

## 6. Content-PR-specific pitfalls (from CONTRIBUTING.md, SCHEMA.md, SUBMISSION_EXAMPLES.md)

- **Scope:** one `content/<category>/<slug>.mdx` file per PR. Multiple entries, or content
  bundled with platform changes, is out of scope for the automated content path.
- **Do not edit** (external content PRs): `README.md`, `apps/web/public/data/**`,
  `apps/web/src/generated/**`, `apps/web/src/routeTree.gen.ts`,
  `apps/web/public/downloads/**`. Maintainer automation regenerates all of these.
- **Source-backing:** canonical source/docs/repo/package URLs; no affiliate, referral, or
  tracking links. Don't use the awesome-claude repo itself as a placeholder `repoUrl` for
  an unrelated resource.
- **`description` vs `cardDescription`:** `description` is a concise, truthful summary —
  not a feature dump.
- **Safety/privacy metadata is field-typed, not generic:**
  - `prerequisites` — setup requirements only.
  - `safetyNotes` — execution, install risk, permissions, destructive actions, background
    workers, network access, account-write behavior.
  - `privacyNotes` — local files, logs, credentials, telemetry, third-party data handling,
    retention, user-data exposure.
  - `disclosure` — commercial/tool-listing disclosure only, not a runtime safety note.
  - Generic boilerplate here (e.g. "uses OAuth, handle tokens carefully" with no specifics
    about *which* tools/scopes actually write) is a common non-blocking review nit — be
    concrete about what the specific resource does.
- **No community ZIP/MCPB hosting requests.** Don't ask HeyClaude to host an uploaded
  archive at `/downloads/...`; link source, an install command, or copyable content
  instead. Maintainer-built download artifacts (with checksums/package-trust metadata) are
  a separate, post-review, maintainer-only path. Never mark `packageVerified: true` for a
  community package — only maintainers set that after verifying the artifact and source.
- **Collections must curate existing, already-reviewed entries** — not bundle brand-new,
  unreviewed resources as if they were companions.
- **Category fit:** if the closest category template doesn't actually fit, reroute before
  submitting rather than forcing it in (per `SUBMISSION_EXAMPLES.md`'s Quick Checks).
- **Don't chase reviews.** Pinging, @-mentioning, or commenting to ask about status
  *deprioritizes* the submission (CONTRIBUTING.md: expect at least 5 days added to the
  manual-queue position) and repeated pestering is itself a conduct violation.
- **Paid/commercial/jobs/claims do not belong in a content PR** — route to the relevant
  website lead flow (`heyclau.de/tools/submit`, jobs board, claim/update) instead.

---

## 7. What this repo does NOT accept (from AGENTS.md / CONTRIBUTING.md)

- Hand-edited generated artifacts outside explicit maintainer/internal generation work.
- Production mock/fallback data or UI claims not backed by the live API (implicit house
  standard mirrored from the sibling repos; keep entries and platform claims accurate to
  what's actually live).
- Public issue-based content intake — it's retired; use the PR-first flow.
- `pull_request_target` workflows that check out or execute fork code, or that run
  untrusted submitted code in privileged workflows.
- Auto-merge by any automation, including gittensory-orb, for either contribution type.
- Overclaiming Gittensor rewards — state only that the repo is listed on Gittensor and that
  eligibility/rewards follow Gittensor's current rules.
- Multi-account issue/PR farming — permanently blocked across all JSONbored repos on
  confirmation, per `CODE_OF_CONDUCT.md`.

When in doubt: identify which of the two contribution types you're doing first (Step 0 in
`SKILL.md`), keep the PR narrow to that type's actual scope, and validate with the command
list that matches what you changed.
