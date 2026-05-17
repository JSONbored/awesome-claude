# HeyClaude MCP Server

<p align="center">
  <a href="https://heyclau.de">
    <img src="https://heyclau.de/heyclaude-wordmark.svg" alt="HeyClaude" width="300">
  </a>
</p>

<p align="center">
  <a href="https://heyclau.de">Website</a> •
  <a href="https://github.com/JSONbored/awesome-claude">GitHub</a> •
  <a href="https://www.npmjs.com/package/@heyclaude/mcp">npm</a> •
  <a href="https://heyclau.de/api/mcp">MCP endpoint</a> •
  <a href="https://github.com/JSONbored/awesome-claude/releases/tag/mcp-v0.2.0">v0.2.0 release</a>
</p>

Read-only Model Context Protocol server for the HeyClaude registry.

It exposes the same public registry surface used by the website and Raycast:
search, entry details, platform compatibility, install guidance, generated
adapters, feed discovery, and safe submission-draft helpers. It does not create
GitHub issues, open pull requests, write local files, publish content, or manage
accounts.

No API key is required for the public endpoint. Abuse controls are handled with
strict request validation, a 64 KiB body limit, and a dedicated Cloudflare
`API_MCP_RATE_LIMIT` binding capped at 60 requests/minute/IP in production.

## Tools

- `search_registry` - search public registry entries by query, category, and
  platform.
- `server_info` - fetch package version, registry generation, tool list, public
  access policy, and rate-limit metadata.
- `list_category_entries` - browse entries with bounded pagination and optional
  category, platform, tag, and query filters.
- `get_recent_updates` - list recently added or upstream-updated entries from
  generated registry metadata, optionally filtered with `since`.
- `get_related_entries` - find related entries based on category, tags,
  platforms, keywords, and source metadata.
- `get_entry_detail` - fetch an entry detail payload by category and slug.
- `get_copyable_asset` - fetch the category-aware copy/install asset for an
  entry, such as full prompt text, config snippets, commands, scripts, or
  collection items.
- `compare_entries` - compare 2-5 entries by fit, category, platform support,
  install complexity, and source metadata.
- `get_registry_stats` - fetch aggregate counts, freshness metadata, and real
  source-signal coverage without implying popularity when stats are absent.
- `get_client_setup` - fetch tested setup snippets for Codex, Claude Desktop,
  Cursor, Windsurf, and raw Streamable HTTP clients.
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
- `prepare_submission_draft` - normalize and validate fields, then return a
  canonical issue title/body plus prefilled URLs.
- `get_submission_examples` - fetch category-specific example fields and
  templates for more complete submissions.
- `review_submission_draft` - review schema errors, duplicate risk, and
  maintainer checklist items before a submission issue is opened.

## Resources and Prompts

The server also exposes read-only MCP resources:

- `heyclaude://feeds/directory`
- `heyclaude://category/{category}`
- `heyclaude://entry/{category}/{slug}`

Workflow prompts are available for common client flows:

- `find_best_asset`
- `prepare_submission`
- `review_submission_before_issue`
- `install_asset_safely`

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
- Remote endpoint requires JSON POST bodies, rejects payloads above 64 KiB, and
  uses the dedicated `API_MCP_RATE_LIMIT` Cloudflare binding at
  60 requests/minute/IP in production.
- Submission tools prepare review drafts only; HeyClaude does not auto-publish
  MCP-submitted content.

## npm Release Prep

MCP releases are package-scoped. Website/catalog changes do not create repo-wide
semver releases. The initial public package version is `0.1.0`, and GitHub
release tags use `mcp-vX.Y.Z`.

The npm package artifact is hosted on npmjs.com. GitHub Releases track the
matching package-scoped source tag and release notes, such as `mcp-v0.1.2`.

Do not publish until the web branch has shipped, the production endpoint has
been verified, and the package smoke test passes. The release checklist is:

```bash
pnpm validate:mcp-endpoint -- --url https://heyclau.de/api/mcp --strict-tools
pnpm --filter @heyclaude/mcp test
pnpm --filter @heyclaude/mcp pack --dry-run
MCP_PACKAGE_REMOTE_SMOKE_URL=https://heyclau.de/api/mcp pnpm validate:mcp-package
```

Publishing should happen through the manual `Publish MCP Package` GitHub
workflow with npm trusted publishing/provenance enabled for `@heyclaude/mcp`.
