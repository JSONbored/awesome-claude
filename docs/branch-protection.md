# Branch Protection

`main` is the production promotion branch. Production deploys should remain
gated by the Cloudflare Worker and GitHub integration attached to `main`.

Required checks before merging:

- `required-pr-gate`
- `Superagent Security Scan`

`required-pr-gate` summarizes the routed `PR Validation` lanes. Only lanes
relevant to the changed files should run. Content submissions run the affected
content category validators plus `validate-content-policy`; web, MCP, Raycast,
package, registry, and CI lanes run only when their owned files change.

`Superagent Security Scan` is the installed Superagent GitHub App security
gate. It is required because it owns the current security/trust check surface.

Advisory checks before merging:

- `superagent-repo-scan`, when manually dispatched or scanner secrets are
  available for advisory runs.
- `pipelock-advisory-scan`.

Local Superagent repo scan, Pipelock, CodeRabbit, Gittensory, and other
assistant/advisory checks should stay non-required unless maintainers
deliberately promote them. Socket should apply only to dependency PRs.

Development deploys may target the Cloudflare dev Worker only:

```bash
pnpm --filter web run deploy:dev
```

The current PR artifact check uses that shared `heyclaude-dev` Worker when the
workflow has Cloudflare credentials. This is branch validation, not a permanent
per-PR environment. If Cloudflare Git previews publish a GitHub Deployment
environment URL, CI resolves and validates that URL instead.

Do not run production deploy commands from feature branches. Production updates
must flow through the protected `main` branch.
