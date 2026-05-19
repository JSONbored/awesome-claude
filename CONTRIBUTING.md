# Contributing to HeyClaude

HeyClaude is a curated directory for Claude agents, MCP servers, skills, commands, hooks, rules, guides, collections, statuslines, and related AI workflow resources.

The fastest path for most contributions is issue-first. The repository can turn well-formed, source-backed submissions into reviewable PRs, but maintainers still review before anything is merged.

## Contribution paths

### 1. Submit a free resource

Use the website form:

- [heyclau.de/submit](https://heyclau.de/submit)

This creates a structured GitHub issue with the right fields for the selected category. Fully valid, source-backed, non-artifact submissions may auto-open an import PR after policy gates pass. Auto-import does not auto-merge.

### 2. Open a GitHub submission issue

Use GitHub issue templates when the website is not convenient:

- [New submission issue](https://github.com/JSONbored/awesome-claude/issues/new/choose)

Keep submissions concrete. Include canonical source URLs, docs, install/config details, and enough context for someone else to verify the entry.

### 3. Open a direct PR

Direct PRs are the advanced path. Edit source content under `content/<category>/` and keep the PR focused. External contributor PRs should not include generated files.

Do not edit these in external content PRs:

- `README.md`
- `apps/web/public/data/**`
- `apps/web/src/generated/**`
- `apps/web/public/downloads/**`

Maintainer automation regenerates those outputs.

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
- source-only resubmission instead of uploaded artifacts

Submissions may be closed when they are incomplete, promotional without enough utility, unsafe to list, off-topic, duplicated, or abandoned.

## Conduct

Participation is covered by [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
