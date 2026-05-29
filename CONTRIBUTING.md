# Contributing to HeyClaude

HeyClaude is a curated directory for Claude agents, MCP servers, skills, commands, hooks, rules, guides, collections, statuslines, and related AI workflow resources.

The fastest path for most contributions is issue-first. The repository can turn well-formed, source-backed submissions into reviewable PRs, but maintainers still review before anything is merged.

## Contribution paths

### 1. Submit a free resource

Use the website form:

- [heyclau.de/submit](https://heyclau.de/submit)

This creates a structured GitHub issue with the right fields for the selected category. Fully valid, source-backed, non-artifact submissions may be approved for an import PR after policy gates pass. Automation does not auto-merge.

Maintainers trigger a submission import by applying `import-approved` or `accepted` after review. `needs-author-input`, `source-needs-verification`, `stale-submission`, and `import-pr-open` block or defer import until the issue is fixed, verified, reopened for review, or already represented by an import PR.

No CLA signature is required. Repo checks focus on submission quality, source verification, contributor trust, and security review.

### 2. Open a GitHub submission issue

Use GitHub issue templates when the website is not convenient:

- [New submission issue](https://github.com/JSONbored/awesome-claude/issues/new/choose)

Keep submissions concrete. Include canonical source URLs, docs, install/config details, and enough context for someone else to verify the entry.

For accepted, rejected, and rerouted examples across agents, MCP servers, skills, hooks, commands, collections, and paid/tool listings, see [`examples/content/SUBMISSION_EXAMPLES.md`](examples/content/SUBMISSION_EXAMPLES.md).

For hooks, MCP servers, skills, commands, and statuslines, disclose meaningful safety/privacy behavior in the submission fields:

- `safety_notes`: code execution, package install risk, write/delete actions, background workers, network access, account writes, or destructive behavior.
- `privacy_notes`: local file access, logs, credentials, telemetry, third-party API calls, retained data, or user data exposure.

Use `prerequisites` only for setup requirements. Use `disclosure` only for commercial/tool listing status.

### 3. Open a direct PR

Direct PRs are the advanced path. Edit source content under `content/<category>/` and keep the PR focused. External contributor PRs should not include generated files.

Do not edit these in external content PRs:

- `README.md`
- `apps/web/public/data/**`
- `apps/web/src/generated/**`
- `apps/web/public/downloads/**`

Maintainer automation regenerates those outputs.

For frontend, page, product, API, MCP, Raycast, or other feature work, include enough review evidence for maintainers to understand the behavior without guessing:

- Frontend/page/UI changes: attach desktop and mobile screenshots in the PR, or clearly write `No visual impact` when the change is non-visual.
- New features: list changed routes, pages, components, commands, tools, or endpoints, plus the expected behavior and important edge cases.
- Backend/API/MCP/Raycast changes: list the invariants that must remain true, validation commands, and any backward-compatibility notes.
- Accessibility-sensitive UI changes: mention keyboard, focus, label, and mobile behavior where relevant.
- Content-only changes that do not alter rendering may skip screenshots, but should say so explicitly.

Screenshots are manual-review evidence, not a separate CI gate. Maintainers may request changes when UI or feature PRs omit screenshots, invariants, or meaningful validation.

## Development environment

Use the local environment you prefer, or open the repo in the included minimal devcontainer/Codespaces setup. The devcontainer standardizes Node and pnpm but intentionally avoids heavy browser installs by default.

Inside a fresh environment:

```sh
corepack enable
corepack prepare pnpm@11.1.3 --activate
pnpm install --frozen-lockfile
```

Normal PR validation does not require Playwright. For user-facing page changes,
include desktop and mobile screenshots or a clear `No visual impact` note in the
PR, then run the focused checks listed below.

CI remains the source of truth for merge readiness.

## Package and artifact policy

Community submissions should be source-backed, not artifact-hosting requests.

- Do not ask HeyClaude to host a community-submitted ZIP/MCPB at `/downloads/...`.
- For skills, use an install command, canonical source URL, retrieval sources, or full copyable source content.
- Maintainer-built package downloads are convenience artifacts created after review.
- Package validation/scanning is defense in depth, not a guarantee that anything is safe to run.

If you are submitting a package-like resource, include the source repository and explain how the package was built. Maintainers may use quarantined review and scanner tooling before deciding whether to publish any rebuilt package.

## Local validation

From the repo root:

```sh
pnpm install --frozen-lockfile
pnpm validate:content:strict
pnpm validate:issue-templates
pnpm validate:packages
pnpm scan:packages
pnpm test:submission-intake
pnpm test:registry-artifacts
pnpm validate:raycast-feed
MCP_ENDPOINT_URL=http://localhost:3000/api/mcp pnpm --filter @heyclaude/mcp validate:endpoint
pnpm build
```

If you changed categories or submission fields, also run:

```sh
pnpm generate:issue-templates
pnpm generate:readme
```

Direct contributors should usually leave generated output out of the PR unless a maintainer asks for it.

## Gittensor-listed repository

HeyClaude is listed on Gittensor as an incentivized repository. Contribution eligibility, scoring, and rewards are governed by Gittensor's current rules, not by this repository.

Please do not spam issues or PRs for scoring. High-quality contributions are easier to review, more likely to merge, and better for the directory.

## Review expectations

Maintainers may ask for:

- canonical source or docs
- clearer install/use instructions
- category changes
- removal of generated files
- security or provenance clarification
- safety/privacy notes for sensitive behavior
- source-only resubmission instead of uploaded artifacts

Submissions may be closed when they are incomplete, promotional without enough utility, unsafe to list, off-topic, duplicated, or abandoned.

## Conduct

Participation is covered by [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
