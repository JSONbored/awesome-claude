# PR-First Submission Gate Operations

HeyClaude content submissions are PR-first. Public contributors submit exactly
one raw `content/<category>/<slug>.mdx` entry through the website GitHub App flow
or by opening a direct single-entry PR. They should not edit README, generated
registry artifacts, public data, workflows, scripts, package metadata, or
multiple entries.

Public GitHub issue creation is disabled for content intake. Existing legacy
submission issues can still be drained with the private operator kit, but new
website submissions must go through the private submission gate and GitHub PRs.

The private maintainer gate owns final submission decisions: label immediately,
review, post one stable marker comment, then `close`, `request_changes`,
`manual`, `import`, or `ignore`. Automation never auto-merges or publishes
content directly to `main`.

## Labels

- `submission-gate-pilot`: legacy manual escape hatch for explicitly
  pilot-labeled PRs; normal submission-gate scope is now `main`.
- `submission-under-review`: the private worker accepted the webhook and queued
  a serialized review job.
- `submission-needs-changes`: fixable issues were found and the stable marker
  comment explains the public reason.
- `submission-manual-review`: potentially useful, but source, provenance,
  package, credentials, safety, or category-fit risk needs maintainer judgment.
- `submission-closed-by-gate`: the worker closed a pilot-scoped hard failure or
  route-away submission.
- `import-pr-open`: a maintainer-owned import PR exists.
- `superseded-by-import-pr`: the contributor PR was copied into a trusted import
  PR and should not be merged directly.

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
  webhooks, and internal import callbacks.
- D1 tables for drafts, PR state, verdict summaries, audit rows, and short-lived
  encrypted user-token handoff.
- R2 for raw webhook payload snapshots, draft payloads, reports, and container
  logs.
- Queues for review jobs and import jobs, with dead-letter queues.
- Durable Objects for per-draft or per-PR locks.
- Cloudflare Containers for trusted git, Node, pnpm, validation, generation,
  branch push, and maintainer-owned import PR creation.

Provision queues before deploying the Worker. The production environment needs
`heyclaude-submission-review`, `heyclaude-submission-review-dlq`,
`heyclaude-submission-import`, and `heyclaude-submission-import-dlq`.
The review consumer retries three times before the DLQ; the import consumer
retries twice before the DLQ.

The Worker can label and comment quickly. Import generation happens in the
Container because it needs a filesystem, git, pnpm, and the repo validation
toolchain.

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
  `validate-content` and `validate-content-policy`. Pending validation keeps the
  PR in `validation_pending`; failed validation gets one request-changes
  comment; green source validation is the only path into private corpus review.
  Generated artifacts are validated on the maintainer-owned import PR, not on
  the contributor's raw single-entry PR.
- `close` is for spam, promo/listing attempts, duplicates, unsupported
  categories, generated-artifact tampering, unsafe package/install patterns,
  missing source of truth, or non-content PRs.
- `request_changes` is for fixable missing fields, weak provenance, category
  mismatch, or content/frontmatter shape problems.
- `manual` is for high-risk but potentially useful entries, credential-heavy
  tools, ambiguous package provenance, or commercial edge cases.
- `import` is limited to deterministic low-risk passes. The Container creates a
  maintainer-owned import PR from a trusted checkout, and the contributor PR is
  closed as superseded after that import PR exists.

## Backlog Drain

Existing content-submission issues should be handled before deleting the private
legacy scripts:

1. Run the private operator kit in report-only mode against the open queue.
2. Close deterministic stale, promo, duplicate, unsupported, and invalid issues.
3. Request changes only where the author can realistically fix the submission.
4. Route high-risk but possibly useful entries to manual review.
5. Import accepted entries through a maintainer-owned branch.
6. Rerun the queue after each batch and verify counts dropped.

## Promotion Criteria

- Zero actions outside pilot scope.
- No false auto-closes in regression fixtures or live pilot batches.
- Stable marker comments, labels, branches, and PRs across repeated events.
- Successful maintainer-owned import PR creation.
- Clean validation before import PR creation.
- `main` remains protected and manual-merge only.
