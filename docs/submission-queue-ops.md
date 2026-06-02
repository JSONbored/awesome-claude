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
review, post one stable marker comment, then `merge`, `close`,
`request_changes`, `manual`, or `ignore`. For single-file content PRs, the gate
is intentionally one-shot and slightly aggressive: ambiguity usually closes the
PR with a public reason so the contributor can resubmit cleanly.

## Labels

- `submission-gate-pilot`: legacy manual escape hatch for explicitly
  pilot-labeled PRs; normal submission-gate scope is now `main`.
- `submission-under-review`: the private worker accepted the webhook and queued
  a serialized review job.
- `submission-needs-changes`: fixable issues were found and the stable marker
  comment explains the public reason.
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
- Webhook review starts when a PR targets the configured base ref, currently
  `main`, or carries the `submission-gate-pilot` label.
- The Worker applies `submission-under-review` immediately, enqueues one job per
  PR, and updates one stable marker comment.
- The review job waits for configured required validation, currently
  `validate-content` and Superagent. Pending validation keeps the PR in
  `validation_pending`; failed validation gets one terminal comment and closes
  or requests changes depending on the failure class. Green source validation
  is the only path into private corpus review.
- Accepted one-file content PRs are merged directly. Generated artifacts are
  build-time outputs and are not committed in contributor PRs.
- `close` is for spam, promo/listing attempts, duplicates, unsupported
  categories, generated-artifact tampering, unsafe package/install patterns,
  missing source of truth, protected-field edits, or non-content PRs.
- `request_changes` is for clearly fixable missing fields or shape problems
  where preserving the current PR is better than resubmission.
- `manual` is rare and reserved for Superagent/private-review outages, merge
  failures after retries, or genuinely close high-risk calls.

## Legacy Issue Intake

Issue-based content intake is retired. If an old submission issue is still open,
close it with the PR-first resubmission route or convert it manually into a
normal one-file content PR. Do not reintroduce public issue import, stale issue
management, or queue mutation workflows.

## Promotion Criteria

- Zero actions outside pilot scope.
- No false auto-closes in regression fixtures or live pilot batches.
- Stable marker comments, labels, branches, and PRs across repeated events.
- Successful direct merge for accepted one-file content PRs.
- Clean validation before private review and merge.
- `main` remains protected; only passing single-file content PRs can be merged by
  the maintainer gate.
