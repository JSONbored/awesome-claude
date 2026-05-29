# CI Security Apps

HeyClaude CI should validate content correctness and deterministic UGC policy.
Contributor trust, AI-agent security review, and dependency reputation are
handled by external security apps where possible.

## Superagent

Superagent Marketplace is the primary low-noise contributor security layer for
pull requests.

- Required check: `Superagent Security Scan`.
- Expected labels: `contributor:verified`, `contributor:flagged`,
  `pr:verified`, and `pr:flagged`.
- Keep CLA signatures and agreement checks disabled; HeyClaude does not require
  contributor license agreement signatures.
- Do not add `.github/superagent.yml` unless the app produces noise that needs
  repository-specific tuning.

The separate `Superagent Repo Scan` workflow is advisory/manual. It runs the
locked `safety-agent-cli` dev dependency from the trusted base branch only when
`SUPERAGENT_API_KEY` and `DAYTONA_API_KEY` are available. Fork pull requests do
not receive those secrets and should be covered by the Marketplace app check
instead.

## Socket

Socket should be used for dependency PRs only. It should not block normal
content submissions unless a dependency update is part of the PR.

The root `socket.yml` limits app reports to dependency manifest and lockfile
changes.

## Pipelock

`Pipelock Advisory Scan` runs in advisory mode for PR diffs. It is pinned to a
full action commit SHA and is not a content gate.

## HeyClaude Policy Gate

`validate-content-policy` remains custom because external scanners do not know
HeyClaude's schema, source-backed content model, generated-artifact ownership,
package-hosting policy, or safety/privacy metadata requirements.
