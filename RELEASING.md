# Releasing

How HeyClaude ships. The website/Worker and registry data are continuous; the only
steps that need a manual trigger are the npm package release and the MCP registry
listings. This is the operational runbook, not a per-change checklist.

## Automatic — no action needed

| Surface                      | Trigger        | Mechanism                                    |
| ---------------------------- | -------------- | -------------------------------------------- |
| Worker code + bundled assets | push to `main` | Cloudflare Workers Builds (`heyclaude-prod`) |
| Generated catalog / README   | push to `main` | `readme-refresh-pr.yml` (opens a PR)         |
| Search/discovery pings       | push to `main` | `indexnow-on-publish.yml`                    |

## Versioned package — `@heyclaude/mcp` (release-please)

The npm package is cut by **release-please** (`release-please-config.json` +
`.release-please-manifest.json` + `release-please.yml`):

1. Conventional-commit merges to `main` that touch `packages/mcp/**` accumulate into
   a **Release PR** that bumps the SemVer and regenerates `packages/mcp/CHANGELOG.md`.
2. Merging the Release PR tags `mcp-v<semver>`, creates the GitHub Release, and
   dispatches **`publish-mcp-npm.yml`** (`released_by_release_please=true`), which
   publishes to npm via **OIDC trusted publishing + provenance** — no `NPM_TOKEN`.

A bare manual dispatch of **Publish MCP Package** (`publish-mcp-npm.yml`) is the
override path; it self-tags and self-releases.

> One-time GitHub setting: **Settings → Actions → General → Allow GitHub Actions to
> create and approve pull requests** must be enabled so release-please can open the
> Release PR with the default `GITHUB_TOKEN`.

The daily **MCP Release Watch** (`mcp-release-watch.yml`) still files a reminder
issue when a release looks due — it is now a secondary signal; release-please is the
primary driver. (Raycast shares the same release-watch core.)

## MCP registry listings — manual

The hosted MCP server (`https://heyclau.de/api/mcp`, declared in `server.json`) is
listed in two registries. **Run these after changing MCP tools / prompts / resources
or `server.json` metadata** so the listings reflect the live server.

`server.json` lists both the remote (`streamable-http` → `https://heyclau.de/api/mcp`)
and the npm package (`@heyclaude/mcp`). The registry validates npm ownership through
the **`mcpName`** field in `packages/mcp/package.json`, so the npm version referenced
by `server.json` **must already be published to npm (carrying `mcpName`)** before
publishing the listing.

Order:

1. **Publish the package first.** Merge the release-please Release PR (or run Publish
   MCP Package). This pushes the `mcpName`-carrying version to npm.
2. **Reconcile `server.json`.** Set `version` and `packages[].version` to the version
   just published to npm. (The registry rejects re-publishing an existing `version`,
   so this bump is also what makes a re-publish accepted.)
3. **Publish the listings** (run both together so they stay in sync):
   - **Canonical** — `registry.modelcontextprotocol.io`: Actions → **Publish MCP
     Registry** (`publish-mcp-registry.yml`). GitHub OIDC, no secret.
   - **Smithery** — `smithery.ai`: Actions → **Publish to Smithery**
     (`smithery-publish.yml`). Uses `SMITHERY_API_KEY` scoped to the `smithery`
     deployment environment.

The canonical endpoint stays `https://heyclau.de/api/mcp` everywhere — registries are
distribution mirrors, not the source of truth. The discovery pointer at
`/.well-known/mcp.json` and the card at `/.well-known/mcp/server-card.json` are served
by the Worker and update with each deploy.

### One-time setup for the registry listings

- **MCP Registry:** nothing — OIDC + the `io.github.JSONbored` namespace works from
  this repo automatically.
- **Smithery:** create the HeyClaude namespace on smithery.ai, generate an API key
  (account → API keys), add it as the `SMITHERY_API_KEY` secret on a `smithery`
  deployment environment (Settings → Environments → smithery), and set
  `SMITHERY_NAMESPACE` in `smithery-publish.yml` to the created `owner/server`
  namespace.
