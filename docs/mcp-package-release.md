# HeyClaude MCP Package Release

The website and catalog deploy from `main`; they do not use repo-wide semver
releases. The MCP package is the versioned distributable artifact.

## Versioning

- npm package: `@heyclaude/mcp`
- initial public version: `0.1.0`
- Git tag format: `mcp-vX.Y.Z`
- GitHub release title: `@heyclaude/mcp vX.Y.Z`

Patch releases cover packaging, CLI, validation, and bug fixes. Minor releases
cover new MCP tools, new CLI flags, or meaningful protocol behavior changes.
Catalog content updates do not require MCP package releases unless package code
or protocol behavior changes.

## npm Trusted Publishing

The publish workflow uses npm trusted publishing/provenance and should run only
from `main` with the `npm-production` environment approval.
The steady-state workflow intentionally does not pass `NODE_AUTH_TOKEN`; npm
should authenticate the approved GitHub Actions run through OIDC trusted
publishing.

Configure npm trusted publishing for:

- package: `@heyclaude/mcp`
- repository: `JSONbored/awesome-claude`
- workflow file: `publish-mcp-npm.yml`

If npm requires a first package publish before trusted publishing can be
configured, use a temporary granular npm automation token for the first GitHub
Actions publish, then revoke the token and switch the package to trusted
publishing.

## Release Checklist

1. Update `packages/mcp/package.json` and `packages/mcp/CHANGELOG.md`.
2. Merge the release PR to `main` after CI passes.
3. Run the `Publish MCP Package` workflow manually from `main`.
4. Approve the `npm-production` environment.
5. Confirm npm and GitHub release outputs:
   - `npm view @heyclaude/mcp@<version>`
   - `npm exec -y @heyclaude/mcp@<version> -- --version`
   - GitHub release `mcp-v<version>`

For release publishing, endpoint validation should use `--strict-tools` after
the matching Worker code has shipped. Pull-request checks intentionally allow a
lagging dev Worker as long as the deployed endpoint still exposes the baseline
read-only MCP tools.

## Local Auth Check

Local npm auth is only needed for npm scope/package bootstrap work. Check with:

```bash
npm login --registry=https://registry.npmjs.org/
npm whoami
```

## Troubleshooting

If `npm publish --provenance` signs provenance successfully and then fails with
`E404 Not Found - PUT https://registry.npmjs.org/@heyclaude%2fmcp`, the GitHub
workflow is reaching npm but the package or scope is rejecting publish access.
Check the npm package access and trusted publisher settings for:

- package: `@heyclaude/mcp`
- repository: `JSONbored/awesome-claude`
- workflow file: `publish-mcp-npm.yml`
- environment: `npm-production`

Do not create a GitHub release tag manually unless the matching npm package
version is visible on npm.
