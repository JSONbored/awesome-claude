# Releasing

How HeyClaude ships. The website/Worker and registry data are continuous. The
only human step in the MCP release path is merging one Release PR — everything
else is automated.

## Automatic — no action needed

| Surface                      | Trigger        | Mechanism                                    |
| ---------------------------- | -------------- | -------------------------------------------- |
| Worker code + bundled assets | push to `main` | Cloudflare Workers Builds (`heyclaude-prod`) |
| Generated catalog / README   | push to `main` | `readme-refresh-pr.yml` (opens a PR)         |
| Search/discovery pings       | push to `main` | `indexnow-on-publish.yml`                    |

## Versioned package + registry listings — one merge, fully automated

The full MCP release chain is driven by **release-please**:

1. Conventional-commit merges to `main` that touch `packages/mcp/**` accumulate
   into a **Release PR** that bumps the SemVer in `packages/mcp/package.json`,
   `server.json` (`version` + `packages[0].version`), and regenerates
   `packages/mcp/CHANGELOG.md`.
2. **Merge the Release PR.** That's the only human step.
3. release-please creates the `mcp-v<semver>` tag + GitHub Release, then
   dispatches **`publish-mcp-npm.yml`** (`released_by_release_please=true`).
4. `publish-mcp-npm.yml` validates, builds, and publishes `@heyclaude/mcp` to npm
   via **OIDC trusted publishing + provenance** — no `NPM_TOKEN` needed.
5. After a successful npm publish, it automatically dispatches:
   - **`publish-mcp-registry.yml`** → canonical MCP Registry
     (`registry.modelcontextprotocol.io`, OIDC, no secret)
   - **`smithery-publish.yml`** → Smithery listing update (requires
     `SMITHERY_API_KEY` in the `smithery` environment)

A bare manual dispatch of **Publish MCP Package** (`publish-mcp-npm.yml`) is the
override path for out-of-band releases; it self-tags, self-releases, and also
triggers the registry + Smithery dispatches.

> One-time GitHub setting: **Settings → Actions → General → Allow GitHub Actions
> to create and approve pull requests** must be enabled so release-please can
> open the Release PR with the default `GITHUB_TOKEN`.

The daily **MCP Release Watch** (`mcp-release-watch.yml`) still files a reminder
issue when a release looks due — it is now a secondary signal; release-please is
the primary driver. (Raycast shares the same release-watch core.)

## MCP registry listings — manual re-publish only

Manual republishing is only needed when you change `server.json` metadata (title,
description, websiteUrl, repository) without a version bump, or need to force a
Smithery re-scan after a Worker-only change that didn't involve an npm release.

- **Canonical** — Actions → **Publish MCP Registry** (`publish-mcp-registry.yml`)
- **Smithery** — Actions → **Publish to Smithery** (`smithery-publish.yml`)

The canonical endpoint stays `https://heyclau.de/api/mcp` everywhere — registries
are distribution mirrors, not the source of truth. The discovery pointer at
`/.well-known/mcp.json` and the card at `/.well-known/mcp/server-card.json` are
served by the Worker and update with each deploy.

### One-time setup for the registry listings

- **MCP Registry:** nothing — OIDC + the `io.github.JSONbored` namespace works
  from this repo automatically.
- **Smithery:** create the HeyClaude namespace on smithery.ai, generate an API key
  (account → API keys), add it as the `SMITHERY_API_KEY` secret on a `smithery`
  deployment environment (Settings → Environments → smithery), and set
  `SMITHERY_NAMESPACE` in `smithery-publish.yml` to the created `owner/server`
  namespace.
