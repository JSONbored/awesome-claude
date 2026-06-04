# Contributing to HeyClaude

HeyClaude is a curated directory for Claude agents, MCP servers, skills, commands, hooks, rules, guides, collections, statuslines, and related AI workflow resources.

The fastest path for most contributions is PR-first. The website can turn a well-formed, source-backed submission into a single-entry PR for review, but maintainers still review before anything is merged.

## Contribution paths

### 1. Submit a free resource

Use the website form:

- [heyclau.de/submit](https://heyclau.de/submit)

This runs public preflight checks, asks you to continue with GitHub, then opens a focused PR with exactly one raw `content/<category>/<slug>.mdx` file targeting `main`. Fully valid, source-backed, non-artifact submissions may be merged directly after content validation, Superagent, and private maintainer-agent review pass.

The private gate can close hard failures, request changes for fixable gaps, route rare high-risk or inconclusive entries to manual review, or merge deterministic low-risk passes. This automation is limited to single-entry content PRs; platform, workflow, package, and product PRs remain maintainer-reviewed.

No CLA signature is required. Repo checks focus on submission quality, source verification, contributor trust, and security review.

### 2. Open a direct PR

Direct PRs are the advanced path. Edit source content under `content/<category>/`, keep the PR focused on one entry, and target `main`.

Keep submissions concrete. Include canonical source URLs, docs, install/config details, and enough context for someone else to verify the entry.

For accepted, rejected, and rerouted examples across agents, MCP servers, skills, hooks, commands, collections, and paid/tool listings, see [`examples/content/SUBMISSION_EXAMPLES.md`](examples/content/SUBMISSION_EXAMPLES.md).

For hooks, MCP servers, skills, commands, and statuslines, disclose meaningful safety/privacy behavior in the submission fields:

- `safety_notes`: code execution, package install risk, write/delete actions, background workers, network access, account writes, or destructive behavior.
- `privacy_notes`: local file access, logs, credentials, telemetry, third-party API calls, retained data, or user data exposure.

Use `prerequisites` only for setup requirements. Use `disclosure` only for commercial/tool listing status.

External contributor PRs should not include generated files.

Do not edit these in external content PRs:

- `README.md`
- `apps/web/public/data/**`
- `apps/web/src/generated/**`
- `apps/web/src/routeTree.gen.ts`
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

For a direct content PR, keep validation narrow:

```sh
pnpm install --frozen-lockfile
pnpm validate:content:strict
```

Do not run generation or commit build output for one-file content submissions.
The website, API, Raycast, LLM, MCP, and route artifacts are generated during
CI/build/deploy from the accepted source content.

For platform, package, API, MCP, Raycast, or maintainer artifact work, run the
focused checks that match the changed surface:

```sh
pnpm install --frozen-lockfile
pnpm validate:packages
pnpm scan:packages
pnpm test:submission-pr-first
pnpm test:registry-artifacts
pnpm validate:raycast-feed
MCP_ENDPOINT_URL=http://localhost:3000/api/mcp pnpm --filter @heyclaude/mcp validate:endpoint
pnpm build
```

If you changed categories or submission fields, also run:

```sh
pnpm generate:readme
pnpm generate:openapi
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
