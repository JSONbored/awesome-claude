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

## V1 Tools

- `search_registry`
- `get_entry_detail`
- `get_compatibility`
- `get_install_guidance`
- `get_platform_adapter`
- `list_distribution_feeds`

## Exclusions

- No content publishing.
- No issue creation.
- No pull request creation.
- No local project-file writes.
- No account, token, or GitHub OAuth handling.

Submissions remain issue-first and maintainer-reviewed through the website and
GitHub issue templates.
