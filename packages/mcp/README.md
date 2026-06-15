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
  <a href="https://github.com/JSONbored/awesome-claude/releases/tag/mcp-v0.3.1">v0.3.1 release</a>
</p>

Read-only Model Context Protocol server for the HeyClaude registry.

It exposes the same public registry surface used by the website and Raycast:
search, entry details, platform compatibility, install guidance, generated
adapters, feed discovery, and safe submission-draft helpers. It does not create
GitHub issues, open pull requests, write local files, publish content, host
packages, or manage accounts.

No API key is required for the public endpoint. Abuse controls are handled with
strict request validation, a 64 KiB body limit, and a dedicated Cloudflare
`API_MCP_RATE_LIMIT` binding capped at 60 requests/minute/IP in production.

## Tools

- `search_registry` - search public registry entries by query, category, and
  platform.
- `recommend_for_task` - answer "what should I use to do X" in one call: returns
  the best-match entries for a plain-language task, each with why it fits, a
  trust summary, safety/privacy notes, and an inline install block, plus a
  `topPick` and consolidated `installPlan`.
- `server_info` - fetch package version, registry generation, tool list, public
  access policy, and rate-limit metadata.
- `list_category_entries` - browse entries with bounded pagination and optional
  category, platform, tag, and query filters.
- `get_recent_updates` - list recently added or upstream-updated entries from
  generated registry metadata, optionally filtered with `since`.
- `get_related_entries` - find related entries based on category, tags,
  platforms, keywords, and source metadata.
- `get_entry_detail` - fetch an entry detail payload by category and slug.
  Defaults to a token-efficient body excerpt (reporting `bodyChars`,
  `bodyTruncated`, and any `omittedFields`); pass `bodyMode: "full"` for the
  complete content or `"none"` to drop the body. Omitted copyable fields are
  available via `get_copyable_asset`.
- `get_copyable_asset` - fetch the category-aware copy/install asset for an
  entry, such as full prompt text, config snippets, commands, scripts, or
  collection items. Pass `assetType` (e.g. `install_command`) to return only
  that asset and skip the large `full_content`/`script` payloads.
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
- `get_submission_schema` - fetch category submission fields for PR-first
  intake.
- `validate_submission_draft` - validate a content submission draft locally.
- `search_duplicate_entries` - check generated registry artifacts for likely
  duplicates before opening a submission.
- `build_submission_urls` - build prefilled HeyClaude submit and review URLs for human
  review.
- `get_category_submission_guidance` - fetch category-specific contribution
  guidance and required fields.
- `prepare_submission_draft` - normalize and validate fields, then return a
  canonical PR draft plus prefilled submit URL.
- `get_submission_examples` - fetch category-specific example fields and
  templates for more complete submissions.
- `review_submission_draft` - review schema errors, duplicate risk, and
  maintainer checklist items before a submission PR is opened.
- `get_submission_policy` - fetch the read-only submission, artifact, import,
  and maintainer-review policy.
- `explain_entry_trust` - explain source, package, safety, privacy, and review
  metadata signals for one entry. This is a metadata review only and does not
  provide malware scanning, automatic safety guarantees, or installation approval.
- `review_entry_safety` - compare 1-5 entries for source, package, safety, and
  privacy metadata fit before install or recommendation. This is a metadata review
  only and does not provide malware scanning, automatic safety guarantees, or
  installation approval.

## Resources and Prompts

The server also exposes read-only MCP resources:

- `heyclaude://feeds/directory`
- `heyclaude://category/{category}`
- `heyclaude://entry/{category}/{slug}`

Workflow prompts are available for common client flows:

- `find_best_asset`
- `prepare_submission`
- `review_submission_before_pr`
- `install_asset_safely`

## Local Stdio

The published package defaults to the live HeyClaude MCP endpoint. In this
remote-bridge mode, draft-content helpers that accept private submission fields
(`validate_submission_draft`, `build_submission_urls`, `prepare_submission_draft`,
and `review_submission_draft`) are intentionally not exposed or forwarded; use
local artifact mode for those helpers before entering private draft content.

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
- Submission tools prepare review drafts only; the MCP server does not perform
  GitHub writes or publish submitted content.
- The npm stdio remote bridge does not forward local draft-helper calls that
  carry submission fields; run local artifact mode before entering private draft
  content.
- Source-backed, content-only PRs may be merged automatically after content
  validation, Superagent, and private maintainer-agent review pass. Platform,
  workflow, package, and generated-artifact changes are never auto-merged by
  this path.
- Community ZIP/MCPB artifacts are review/quarantine material only. Public
  HeyClaude-hosted downloads are maintainer-built package artifacts.

## npm Release Prep

MCP releases are package-scoped. Website/catalog changes do not create repo-wide
semver releases. The initial public package version is `0.1.0`, and GitHub
release tags use `mcp-vX.Y.Z`.

The npm package artifact is hosted on npmjs.com. GitHub Releases track the
matching package-scoped source tag and release notes, such as `mcp-v0.1.2`.

Do not publish until the web branch has shipped, the production endpoint has
been verified, and the package smoke test passes. The release checklist is:

```bash
MCP_ENDPOINT_REQUIRE_SAFETY_METADATA=1 pnpm validate:mcp-endpoint -- --url https://heyclau.de/api/mcp --strict-tools
pnpm --filter @heyclaude/mcp test
pnpm --filter @heyclaude/mcp pack --dry-run
MCP_PACKAGE_REQUIRE_SAFETY_METADATA=1 MCP_PACKAGE_REMOTE_SMOKE_URL=https://heyclau.de/api/mcp pnpm validate:mcp-package
```

Publishing should happen through the manual `Publish MCP Package` GitHub
workflow with npm trusted publishing/provenance enabled for `@heyclaude/mcp`.
