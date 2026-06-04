# PR-First Submission Gate Operations

HeyClaude content submissions are PR-first. Public contributors submit exactly
one raw `content/<category>/<slug>.mdx` entry through the website GitHub App flow
or by opening a direct single-entry PR. They should not edit README, generated
registry artifacts, public data, workflows, scripts, package metadata, or
multiple entries.

Public GitHub issue creation is disabled for content intake. The old public
issue queue/import/stale-management scripts are not part of the supported
submission path; website submissions must go through the private submission gate
and GitHub PRs.

The private maintainer gate owns final submission decisions: label immediately,
review, post one stable marker comment, then `merge`, `close`, `manual`, or
`ignore`. For single-file content PRs, the gate
is intentionally one-shot and slightly aggressive: ambiguity usually closes the
PR with a public reason so the contributor can resubmit cleanly.

## Labels

- `submission-under-review`: the private worker accepted the webhook and queued
  a serialized review job.
- `submission-manual-review`: potentially useful, but source, provenance,
  package, credentials, safety, or category-fit risk needs maintainer judgment.
- `submission-closed-by-gate`: the worker closed a hard failure or
  route-away submission.
- `submission-merged-by-gate`: the worker approved and merged a passing
  one-file content PR after public checks and private review.

## Policy Matrix

Schema validity is only the first gate. Final decisions also consider:

- `category`: whether the entry belongs in the selected registry category.
- `source`: canonical source, docs, repository, package, or project truth.
- `duplicates`: existing registry entries, prior rejected submissions, and open
  queue state.
- `package`: installer, archive, local download, and package verification risk.
- `provenance`: original submitter attribution and import ownership.
- `capability`: auth, local data, external writes, destructive behavior,
  payments, malware, or background automation.
- `quality`: public copy hygiene, useful detail, non-promo tone, and generated
  artifact scope.

Public preflight only returns broad hints: `submit_pr`, `fix_required`,
`route_away`, or `manual_review`. Private corpus scoring and acceptance
thresholds stay outside the public repo.

## Cloudflare Gate

The private gate is hosted as a Cloudflare Worker with supporting bindings:

- Production Worker: `heyclaude-submission-gate`.
- Production domain: `submission-gate.heyclau.de`.
- Production D1, R2, Queue, and dead-letter Queue resources are the only
  supported submission-gate runtime moving forward.
- Worker endpoints for GitHub App auth, draft creation, draft status, GitHub
  webhooks, and review processing.
- D1 tables for drafts, PR state, verdict summaries, audit rows, and short-lived
  encrypted user-token handoff.
- R2 for raw webhook payload snapshots, draft payloads, and review reports.
- Queues for review jobs, with dead-letter queues.
- Durable Objects for per-draft or per-PR locks.
- D1 `submission_prs` is the durable maintainer review queue. Valid states are
  `queued`, `validation_pending`, `reviewing`, `merge_pending`, `merged`,
  `closed`, `manual`, `ignored`, and `error_retryable`.
- A scheduled Worker sweeper runs every minute and requeues stale
  `validation_pending`, `merge_pending`, and `error_retryable` rows so missed
  GitHub check webhooks do not leave PRs stuck.

Provision queues before deploying the Worker. The production environment needs
`heyclaude-submission-review` and `heyclaude-submission-review-dlq`.
The review consumer retries three times before the DLQ.

Do not deploy the submission gate from unrelated feature branches. It owns the
production custom domain.

The GitHub App needs read-only access to Checks and commit statuses so the gate
can wait for repo-owned source validation before running private review. It
should subscribe to `pull_request`, `check_run`,
`check_suite`, and `status` events. Checks write access is not required unless
the gate later creates its own formal GitHub check run.

## Automation

- Website `/submit` runs public preflight, then posts a draft to the private
  Worker. If the Worker is configured, the contributor continues through GitHub
  App user auth and the gate creates or updates a user-fork branch and PR.
- Webhook review starts when a PR targets the configured content gate base ref,
  currently `main`.
- The Worker applies `submission-under-review` immediately, enqueues one job per
  PR, and updates one stable marker comment.
- The review job waits for configured required validation, currently
  `validate-content` and Superagent. Pending validation keeps the PR in
  `validation_pending`, updates the marker comment, and sets a retry time.
  Failed validation gets one terminal comment and closes. Green source
  validation is the only path into private corpus review.
- Accepted one-file content PRs are merged directly. Generated artifacts are
  build-time outputs and are not committed in contributor PRs.
- `close` is for spam, promo/listing attempts, duplicates, unsupported
  categories, generated-artifact tampering, unsafe package/install patterns,
  missing source of truth, protected-field edits, or non-content PRs.
- `manual` is rare and reserved for Superagent/private-review outages, merge
  failures after retries, or genuinely close high-risk calls.

## Queue Debugging

Maintainers can inspect non-secret queue state through `GET /queue` with the
internal bearer secret. The endpoint returns status counts and recent PR queue
rows, including retry time, attempt count, last public-check summary, and last
retryable error. Do not expose this endpoint publicly.

## Legacy Issue Intake

Issue-based content intake is retired. If an old submission issue is still open,
close it with the PR-first resubmission route or convert it manually into a
normal one-file content PR. Do not reintroduce public issue import, stale issue
management, or queue mutation workflows.

## Promotion Criteria

- Zero actions outside content-gate scope.
- No false auto-closes in regression fixtures or live batches.
- Stable marker comments, labels, branches, and PRs across repeated events.
- Successful direct merge for accepted one-file content PRs.
- Clean validation before private review and merge.
- `main` remains protected; only passing single-file content PRs can be merged by
  the maintainer gate.
