# Read-Only Registry MCP

The MCP surface is implemented as `@heyclaude/mcp` under `packages/mcp`. The
published package defaults to a stdio bridge for the live read-only HTTP MCP
endpoint. Local artifact mode remains available for development and validation.

Run the remote-first stdio bridge:

```bash
pnpm --filter @heyclaude/mcp start
```

Run against local generated artifacts:

```bash
pnpm --filter @heyclaude/mcp start:local
```

Set `HEYCLAUDE_DATA_DIR=/absolute/path/to/data`, or pass
`--local --data-dir /absolute/path/to/data`, to read from another generated
artifact directory.

## Tools

Source of truth: `TOOL_DEFINITIONS` in `packages/mcp/src/registry-tools-lib.js`.

- `registry.search`
- `registry.plan`
- `registry.recommend`
- `registry.info`
- `registry.list`
- `registry.updates`
- `entry.related`
- `entry.detail`
- `entry.asset`
- `entry.compare`
- `registry.stats`
- `install.setup`
- `install.compatibility`
- `install.guidance`
- `install.adapter`
- `registry.feeds`
- `submission.schema`
- `submission.validate`
- `submission.duplicates`
- `submission.urls`
- `submission.guidance`
- `submission.prepare`
- `submission.examples`
- `submission.review`
- `submission.policy`
- `entry.trust`
- `entry.safety`
- `entry.coverage`

## Resources

Source of truth: `RESOURCE_TEMPLATES` and `DISCOVERY_RESOURCES` in
`packages/mcp/src/registry-resource-metadata-lib.js`.

Templates:

- `heyclaude://entry/{category}/{slug}`
- `heyclaude://category/{category}`

Fixed discovery URIs:

- `heyclaude://registry/recent`
- `heyclaude://registry/trending`
- `heyclaude://jobs/active`

## Prompts

Source of truth: `PROMPT_DEFINITIONS` in
`packages/mcp/src/registry-prompts-lib.js`.

- `asset.find`
- `submission.prepare`
- `submission.review`
- `install.asset`

## Access and rate limits

The public MCP endpoint does not require an API key. That is intentional: the
tool surface is read-only and all submission helpers generate local validation
reports, PR-first drafts, and submit URLs for maintainer review. They do not create
GitHub issues, open pull requests, publish registry content, or host package
artifacts.

Production uses the dedicated `API_MCP_RATE_LIMIT` Cloudflare binding at
`60 requests/minute/IP`, plus the route-level 64 KiB body limit and strict JSON
request validation. Local and preview runs keep an in-process limiter fallback
when Cloudflare's binding is unavailable.

## Exclusions

- No content publishing.
- No issue creation.
- No pull request creation.
- No package upload, mirroring, or public download hosting.
- No local project-file writes.
- No account, token, or GitHub OAuth handling.

Submissions are PR-first through the website GitHub App flow. Source-backed
single-entry content PRs may be merged directly by the private maintainer gate
after content validation, Superagent, and private review pass.
