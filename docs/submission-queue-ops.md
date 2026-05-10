# Submission Queue Operations

HeyClaude content submissions stay issue-first and maintainer-reviewed. The
queue automation helps maintainers see which submissions are ready, blocked, or
stale; it does not publish content directly.

## Labels

- `content-submission`: canonical routing label for directory submissions.
- `needs-review`: default state for newly-routed submissions.
- `needs-author-input`: validation is blocked on missing or malformed fields.
- `source-needs-verification`: the submitted source URL is missing, ambiguous,
  unavailable, or otherwise needs maintainer review.
- `stale-submission`: the issue has waited at least 7 days for author input.
- `accepted` / `import-approved`: maintainer-reviewed approval labels that can
  open an import PR.
- `import-pr-open`: an import PR exists; stale automation must not close it.
- `risk-low` / `risk-medium` / `risk-high`: deterministic security/safety
  review labels. They are advisory except when the report tier is `critical`,
  which is produced by critical findings such as obvious malware, exposed
  secrets, unsafe executable install pipelines, or non-HTTPS executable sources;
  there is no separate `critical` label, and critical reports block the workflow
  until fixed.

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

## Automation

- `Submission Queue` runs weekly and on demand. It writes a GitHub Actions
  summary from `pnpm submission:queue`, including deterministic security/safety
  tier and review flags for each submission-shaped issue.
- `Submission Stale Manager` runs weekly and on demand. Manual dispatch defaults
  to dry-run and does not accept runtime inputs. Scheduled runs can add labels,
  upsert one reminder comment, and close only eligible stale submissions.
- `Submission Issue Validation` posts both schema validation and
  security/safety review comments. The review is deterministic: it checks URLs,
  install commands, malware/abuse terms, suspicious executable paths, sensitive
  capability words, contributor metadata, and source signals without executing
  submitted code. Regulated-domain status, category fit, and promotional tone
  are not treated as security risk.
- `Submission PR Risk Review` runs on direct content PRs through
  `pull_request_target`, but only checks out trusted base-repo code. It reads PR
  content through the GitHub API as data and never executes fork code.
- Product-shaped tools, hosted apps, services, SaaS products, subscriptions, and
  sponsored/featured placement interest route through
  `https://heyclau.de/tools/submit` unless a maintainer explicitly approves a
  `content/tools` editorial entry.
- Stale automation never imports content, creates PRs, or touches issues with
  `accepted`, `import-approved`, or `import-pr-open`.

## Maintainer Flow

1. Review `/submissions` or the `Submission Queue` workflow summary.
2. For `needs_author_input`, wait for the author to update the issue.
3. For `source_needs_verification`, verify canonical source/package URLs before
   approving.
4. For `stale_reminder_due`, let the manager add `stale-submission` and post the
   reminder.
5. For `close_eligible`, close as not planned only after the stale reminder has
   already been applied.
6. Apply `accepted` or `import-approved` only after maintainer source review.

Direct content PRs are allowed for advanced contributors, but they must pass the
same content validation and deterministic security/safety review. A `risk-high`
label does not automatically reject a PR; it means maintainers need to verify
source, permissions, install safety, and user-consent boundaries before merge.
Direct product/app PRs belong under `content/tools/` and should include
`websiteUrl`, `documentationUrl`, `pricingModel`, `disclosure`,
`applicationCategory`, and `operatingSystem` before merge.

Authors can reopen or resubmit closed stale submissions when the missing fields
or source details are ready.
