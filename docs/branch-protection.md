# Branch Protection

`main` is the production promotion branch. Production deploys should remain
gated by the Cloudflare Worker and GitHub integration attached to `main`.

Required check before merging:

- `required-pr-gate`

`required-pr-gate` summarizes the routed `PR Validation` lanes. Only lanes
relevant to the changed files should run. Content submissions run the affected
content category validators plus `validate-content-policy`; web, MCP, Raycast,
package, registry, and CI lanes run only when their owned files change.

Advisory checks before merging:

- Superagent Marketplace `Contributor trust` and `Security scan`.
- `superagent-repo-scan`, when scanner secrets are available.
- `pipelock-advisory-scan`.

The advisory checks should stay non-required until they have passed cleanly on
several normal HeyClaude PRs. Socket should apply only to dependency PRs.

Development deploys may target the OpenNext Cloudflare dev Worker only:

```bash
pnpm --filter web run deploy:dev
```

The current PR artifact check uses that shared `heyclaude-dev` Worker when the
workflow has Cloudflare credentials. This is branch validation, not a permanent
per-PR environment. If Cloudflare Git previews publish a GitHub Deployment
environment URL, CI resolves and validates that URL instead.

Do not run production deploy commands from feature branches. Production updates
must flow through the protected `main` branch.
