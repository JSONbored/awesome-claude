# Submission Queue Operations

HeyClaude content submissions stay issue-first and review-gated. The queue
automation helps maintainers see which submissions are ready, blocked, or stale.
Fully valid, source-backed, non-artifact submissions can be approved for an
import PR after policy gates pass, but automation does not auto-merge or publish
content.

The issue body is the source of truth for validation and import eligibility.
Issue comments are discussion only. If maintainers ask for changes, authors must
edit the original issue fields; comment replies do not update the validation
snapshot, reset stale timers, or move a submission toward import-ready.

## Labels

- `content-submission`: canonical routing label for real directory
  submissions only. Do not apply it to growth, product, bug, docs, or design
  issues.
- `needs-review`: default state for newly-routed submissions.
- `needs-author-input`: validation is blocked on missing or malformed fields.
- `source-needs-verification`: the submitted source URL is missing, ambiguous,
  unavailable, or otherwise needs maintainer review.
- `stale-submission`: the issue has waited at least 7 days for author input.
- `auto-import-eligible`: deterministic gates passed and a maintainer-approved
  import PR may be opened. This is not approval to merge.
- `accepted` / `import-approved`: maintainer-reviewed approval labels that can
  open an import PR.
- `import-pr-open`: an import PR exists; stale automation must not close it.
- `risk-low` / `risk-medium` / `risk-high`: deterministic security/safety
  review labels. They are advisory except when the report tier is `critical`,
  which is produced by critical findings such as obvious malware, exposed
  secrets, unsafe executable install pipelines, or non-HTTPS executable sources;
  there is no separate `critical` label, and critical reports block the workflow
  until fixed.

## Policy Matrix

Risk labels are triage hints. The import decision uses a policy matrix:

- `schema`: required fields and category model.
- `source`: canonical source, docs, repository, or package URL.
- `package`: local download, archive, installer, and quarantine policy.
- `provenance`: original submitter and import attribution checks.
- `capability`: auth, local data, external write, payment, destructive, malware,
  or other capability signals.
- `quality`: category fit and generated-artifact hygiene.

Policy decisions:

- `auto_import_eligible`: schema passed, source/package/quality gates passed,
  no blocking gate, and risk is low or medium.
- `maintainer_review`: valid enough to review, but a warning gate or stronger
  risk signal needs human judgment.
- `blocked`: at least one policy gate blocks import.

Safety/privacy disclosure affects the `quality` gate. If deterministic risk
signals detect code execution, package install risk, destructive behavior,
background automation, external writes, credentials, local data, telemetry, or
third-party data handling, missing `safety_notes` / `privacy_notes` downgrades
auto-import eligibility to maintainer review.

## Queue States

- `import_ready`: schema-valid and ready for maintainer review/approval.
- `maintainer_review`: protected by `accepted`, `import-approved`, or
  `import-pr-open`.
- `needs_author_input`: missing required fields or invalid submission data.
- `source_needs_verification`: source/package URLs need review before import.
- `stale_reminder_due`: invalid submission has been waiting 7+ days.
- `close_eligible`: invalid submission has been waiting 14+ days and already
  received the stale reminder label.
- `skipped`: not a core submission category.

## Workbench Fields

The public `/submissions` page is a read-only maintainer workbench backed by
the same queue contract as CI. It can suggest actions, labels, and comments, but
it must not comment on issues, close issues, approve imports, or publish
content.

Each queue entry includes:

- `nextAction`: `import`, `review_risk`, `verify_source`,
  `request_author_input`, `update_issue_body_required`,
  `send_stale_reminder`, `close_stale`, or `skip`.
- `bodyFingerprint` / `bodyUpdatedAt`: normalized issue-body identity and the
  latest detected body edit timestamp used for stale windows.
- `authorCommentedAfterReview` / `authorCommentedWithoutBodyUpdate` /
  `lastAuthorCommentAt`: review-discussion signals used to catch cases where an
  author replied after maintainer feedback but did not edit the source fields.
- `missingLabels`: recommended queue labels not currently present on the
  GitHub issue.
- `reviewChecklist`: deterministic maintainer checks assembled from schema,
  source, stale, and security/safety signals.
- `commentDraft`: copyable maintainer reply text for author-input, source
  verification, stale-reminder, and stale-close cases.
- `policyMatrix`: explainable gate status for schema, source, package,
  provenance, capability, and quality.
- `policyDecision`: `auto_import_eligible`, `maintainer_review`, or `blocked`.
- `autoImportEligible`: whether deterministic gates passed and the submission is
  ready for maintainer-approved import.
- `sourceUrl`: the first submitted GitHub, docs, source, download, or website
  URL available for maintainer review.

`nextAction=import` is not automatic merge approval. It means deterministic
gates passed and a maintainer can explicitly approve the import PR path.
Maintainers still review the generated PR before merge.

## Automation

- `Submission Queue` runs weekly and on demand. It writes a GitHub Actions
  summary from `pnpm submission:queue`, including deterministic security/safety
  tier and review flags for each submission-shaped issue.
- `pnpm submission:queue` is the CI/offline builder. It requires
  `--issues-json` and `--output`.
- `pnpm submission:queue:live` is the maintainer command. It uses the
  authenticated GitHub CLI to fetch open issues, comments, and body-edit
  timeline events, then writes `reports/submission-queue.json` and prints a
  concise table.
- `Submission Stale Manager` runs weekly and on demand. Manual dispatch defaults
  to dry-run and does not accept runtime inputs. Scheduled runs can add labels,
  upsert one reminder comment, and close only eligible stale submissions.
- `Submission Issue Validation` posts one stable HeyClaude submission check
  comment covering schema, dry-run import preview, and deterministic
  security/safety review. The review checks URLs, install commands,
  malware/abuse terms, suspicious executable paths, sensitive capability words,
  contributor metadata, and source signals without executing submitted code. It
  does not create branches, open PRs, or dispatch validation workflows from
  public issue events. Regulated-domain status, category fit, and promotional
  tone are not treated as security risk.
- `HeyClaude Submission Bot` may label issues, keep the stable submission check
  comment updated, and open import PRs only after a maintainer applies
  `accepted` or `import-approved` and deterministic gates pass. It never
  auto-approves, auto-merges, or publishes content.
- `Package Artifact Scan` validates reviewed package archives with archive
  safety limits and optional ClamAV, Trivy, and OSV-Scanner checks. Scans are
  quarantine signals, not a warranty.
- `validate-content-policy` runs inside `PR Validation` and enforces only
  deterministic HeyClaude UGC blockers: category/path/frontmatter consistency,
  generated-artifact churn from external contributors, community ZIP/MCPB or
  `/downloads/**` hosting requests, unsafe `packageVerified: true`, provenance
  failure, and missing required safety/privacy notes for sensitive behavior.
  It emits concise annotations only when it fails.
- Installed external security apps provide contributor and repo trust signals.
  The Superagent Marketplace `Superagent Security Scan` is the required
  contributor security layer. The local Superagent CLI workflow and Pipelock
  remain advisory/manual unless maintainers deliberately promote them in branch
  protection.
- Product-shaped tools, hosted apps, services, SaaS products, subscriptions, and
  sponsored/featured placement interest route through
  `https://heyclau.de/tools/submit` unless a maintainer explicitly approves a
  `content/tools` editorial entry.
- Stale automation never imports content, creates PRs, or touches issues with
  `accepted`, `import-approved`, or `import-pr-open`.
- Stale automation uses validation-relevant issue-body edits for age. Generic
  comments do not reset stale state.
- External contributor PRs cannot change `README.md`,
  `apps/web/public/data/**`, `apps/web/src/generated/**`, or
  `apps/web/public/downloads/**`.

## Maintainer Flow

1. Review `/submissions` or the `Submission Queue` workflow summary.
2. Use the filter tabs to focus on import-ready, author-input,
   source-verification, stale, close-eligible, or high-risk submissions.
3. Apply missing labels only when they match the current maintainer decision.
4. For `needs_author_input`, use the copyable draft as a starting point and wait
   for the author to edit the original issue body. If the author replies only in
   comments, use the `update_issue_body_required` draft.
5. For `source_needs_verification`, verify canonical source/package URLs before
   approving.
6. For `stale_reminder_due`, let the manager add `stale-submission` and post the
   reminder.
7. For `close_eligible`, close as not planned only after the stale reminder has
   already been applied.
8. Apply `accepted` or `import-approved` only after maintainer source review and
   when the deterministic gates indicate the issue is import-ready.

Direct content PRs are allowed for advanced contributors, but they must pass the
same content validation and deterministic content policy gate. External scanner
findings are maintainer review signals unless branch protection is updated to
require a specific app check.
Direct product/app PRs belong under `content/tools/` and should include
`websiteUrl`, `documentationUrl`, `pricingModel`, `disclosure`,
`applicationCategory`, and `operatingSystem` before merge.

Authors can reopen or resubmit closed stale submissions when the missing fields
or source details are ready in the issue body.

The Raycast integration intentionally keeps its npm/package-lock island because
Raycast extension tooling expects npm workflows. Do not migrate it to pnpm as
part of submission queue or root monorepo cleanup work.
