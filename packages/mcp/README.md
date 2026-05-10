# HeyClaude MCP Server

Read-only Model Context Protocol server for the HeyClaude registry.

It exposes the same public registry surface used by the website and Raycast:
search, entry details, platform compatibility, install guidance, generated
adapters, feed discovery, and safe submission-draft helpers. It does not create
GitHub issues, open pull requests, write local files, publish content, or manage
accounts.

## Tools

- `search_registry` - search public registry entries by query, category, and
  platform.
- `get_entry_detail` - fetch an entry detail payload by category and slug.
- `get_compatibility` - fetch skill platform compatibility metadata.
- `get_install_guidance` - fetch install commands, config, package, and platform
  guidance.
- `get_platform_adapter` - fetch generated adapter content, currently Cursor
  rule adapters for skill packages.
- `list_distribution_feeds` - discover public JSON, RSS, Atom, and platform
  feeds.
- `get_submission_schema` - fetch category submission fields and issue template
  metadata.
- `validate_submission_draft` - validate a content submission draft locally.
- `search_duplicate_entries` - check generated registry artifacts for likely
  duplicates before opening a submission.
- `build_submission_urls` - build prefilled HeyClaude submit and GitHub issue
  URLs for human review.
- `get_category_submission_guidance` - fetch category-specific contribution
  guidance and required fields.

## Local Stdio

The published package defaults to the live HeyClaude MCP endpoint:

```json
{
  "mcpServers": {
    "heyclaude": {
      "command": "npx",
      "args": ["-y", "@heyclaude/mcp"]
    }
  }
}
```

Use a custom endpoint when testing a preview/dev deployment:

```json
{
  "mcpServers": {
    "heyclaude": {
      "command": "npx",
      "args": [
        "-y",
        "@heyclaude/mcp",
        "--url",
        "https://heyclaude-dev.zeronode.workers.dev/api/mcp"
      ]
    }
  }
}
```

Local artifact mode is explicit and intended for development:

```bash
pnpm --filter @heyclaude/mcp start:local
```

Set `HEYCLAUDE_DATA_DIR=/absolute/path/to/data`, or pass
`--local --data-dir /absolute/path/to/data`, to point at a generated data
directory.

Example local MCP client config:

```json
{
  "mcpServers": {
    "heyclaude": {
      "command": "pnpm",
      "args": ["--filter", "@heyclaude/mcp", "start:local"]
    }
  }
}
```

## Remote HTTP

The web app also exposes a Streamable HTTP endpoint:

- production: `https://heyclau.de/api/mcp`
- dev: `https://heyclaude-dev.zeronode.workers.dev/api/mcp`

Validate a deployed endpoint with the SDK-level contract check:

```bash
MCP_ENDPOINT_URL=https://heyclaude-dev.zeronode.workers.dev/api/mcp pnpm validate:mcp-endpoint
```

This check connects with an MCP client, lists tools, calls representative
registry and submission-helper tools, verifies strict argument validation, and
checks the HTTP guards used by the remote route.

## Security Boundary

- Read-only registry artifacts only.
- Submission helpers generate URLs and validation reports only.
- No GitHub OAuth, tokens, issue creation, PR creation, or repo writes.
- No local project-file writes or config mutations.
- Remote endpoint uses route-level rate limits and Cloudflare rate-limit bindings
  when available.

## npm Release Prep

MCP releases are package-scoped. Website/catalog changes do not create repo-wide
semver releases. The initial public package version is `0.1.0`, and GitHub
release tags use `mcp-vX.Y.Z`.

Do not publish until the web branch has shipped, the production endpoint has
been verified, and the package smoke test passes. The release checklist is:

```bash
pnpm validate:mcp-endpoint -- --url https://heyclau.de/api/mcp
pnpm --filter @heyclaude/mcp test
pnpm --filter @heyclaude/mcp pack --dry-run
MCP_PACKAGE_REMOTE_SMOKE_URL=https://heyclau.de/api/mcp pnpm validate:mcp-package
```

Publishing should happen through the manual `Publish MCP Package` GitHub
workflow with npm trusted publishing/provenance enabled for `@heyclaude/mcp`.
