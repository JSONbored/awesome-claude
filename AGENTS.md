# HeyClaude Agent Instructions

These instructions are for AI coding agents working in this repository. Keep them focused on the actual HeyClaude project, not general coding advice.

## Project Intent

HeyClaude is a curated, GitHub-native directory for Claude and AI workflow resources: agents, MCP servers, skills, hooks, commands, rules, guides, collections, statuslines, and related tools.

The growth path is useful community submissions, not low-quality promotion. Free, source-backed, practical resources belong in the content directory. Paid tools, commercial listings, jobs, sponsorships, and listing claims should go through the website lead flows unless a maintainer explicitly routes them into content.

## Source Of Truth

- Source content lives under `content/<category>/`.
- Registry schema, validation, submission intake, and risk policy live under `packages/registry/src/`.
- Website/API behavior lives under `apps/web/src/`.
- MCP package behavior lives under `packages/mcp/`.
- `README.md` is generated from `scripts/generate-readme.mjs`.
- Public content submissions are PR-first. The website submit form hands drafts to the private submission gate instead of creating GitHub issues.
- Public registry artifacts under `apps/web/public/data/**` and generated source under `apps/web/src/generated/**` are maintainer-owned outputs.

Do not hand-edit generated artifacts unless the task is explicitly maintainer/internal generation work.

## Contribution And Content Policy

- Prefer PR-first content submissions for community UGC.
- Direct content PRs should be focused on exactly one source content entry only.
- Preserve original submitter attribution when converting issues or PRs into real content.
- Reject or route away thin promo, paid listing attempts, affiliate-style submissions, and unsupported categories.
- Do not accept community-submitted ZIP/MCPB hosting requests.
- Local `/downloads/...` artifacts are maintainer-built convenience packages only, with checksums and package trust metadata after review.
- Do not mark `packageVerified: true` for community packages unless maintainers have verified the artifact and source path.

## Safety And Privacy Metadata

Use the fields for their intended purpose:

- `prerequisites`: setup requirements a user must satisfy first.
- `safetyNotes`: execution, install, permissions, destructive actions, background workers, network access, or account-write behavior.
- `privacyNotes`: local files, logs, credentials, telemetry, third-party data handling, retention, or user-data exposure.
- `disclosure`: commercial/tool listing disclosure, not runtime safety notes.

Risk-bearing hooks, MCP servers, skills, commands, and statuslines should disclose meaningful safety/privacy behavior.

## Automation Boundaries

- GitHub Actions may validate content PRs, but final gate decisions live in the private submission gate.
- Automation must never auto-merge.
- Public issue events must not trigger write-scoped import PR creation.
- Do not run, install, or execute untrusted submitted code in privileged workflows.
- `pull_request_target` workflows must read fork PR files through GitHub APIs and must not checkout or execute fork code.

## README And Generated Output

For README changes, edit `scripts/generate-readme.mjs`, regenerate `README.md`, and update `tests/readme-generation.test.ts` when expectations change.

Keep the awesome-list catalog entries intact unless the task explicitly changes content. The README opening, badges, link groups, and bottom embeds can be redesigned, but the generated category counts and content listings must stay complete.

## Validation

Run the narrowest relevant checks first, then broaden when a change touches shared behavior.

Common checks:

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

README changes:

```sh
pnpm generate:readme
pnpm validate:readme
pnpm exec vitest run tests/readme-generation.test.ts tests/submission-workflows.test.ts
pnpm build
git diff --check
```

Submission/API changes:

```sh
pnpm validate:openapi
pnpm exec vitest run tests/submission-api.test.ts tests/api-contracts.test.ts tests/api-router-security.test.ts
pnpm exec vitest run tests/submission-gate-worker.test.ts
pnpm test:submission-pr-first
pnpm build
git diff --check
```

## PR Hygiene

- Use Conventional Commit-style PR titles, for example `feat(submissions): add contributor preflight`.
- Link tracking issues with `Closes #...` when the PR fully resolves them; use `Refs #...` for umbrella issues.
- Keep generated artifact churn out of external contributor PRs.
- Keep platform/code changes separate from individual content imports.
- Do not overclaim Gittensor rewards. Say the repo is listed on Gittensor and that eligibility/rewards follow Gittensor's current rules.

## Communication

Be direct and specific. State what changed, what was validated, and what remains blocked. If a submission is not good enough for free content, say why plainly and route it to the right path instead of trying to force it into the directory.
