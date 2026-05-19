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

- `search_registry`
- `server_info`
- `list_category_entries`
- `get_recent_updates`
- `get_related_entries`
- `get_entry_detail`
- `get_copyable_asset`
- `compare_entries`
- `get_registry_stats`
- `get_client_setup`
- `get_compatibility`
- `get_install_guidance`
- `get_platform_adapter`
- `list_distribution_feeds`
- `get_submission_schema`
- `validate_submission_draft`
- `search_duplicate_entries`
- `build_submission_urls`
- `get_category_submission_guidance`
- `prepare_submission_draft`
- `get_submission_examples`
- `review_submission_draft`

## Resources

- `heyclaude://feeds/directory`
- `heyclaude://category/{category}`
- `heyclaude://entry/{category}/{slug}`

## Prompts

- `find_best_asset`
- `prepare_submission`
- `review_submission_before_issue`
- `install_asset_safely`

## Access and rate limits

The public MCP endpoint does not require an API key. That is intentional: the
tool surface is read-only and all submission helpers generate local validation
reports, issue drafts, and URLs for maintainer review. They do not create
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

Submissions remain issue-first through the website and GitHub issue templates.
Source-backed issues may auto-open review PRs after repository gates pass, but
maintainers still review before merge.
