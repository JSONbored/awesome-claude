#!/usr/bin/env bash
set -euo pipefail

if [ "${GITHUB_REF:-}" != "refs/heads/main" ]; then
  echo "::error::MCP package releases must run from main."
  exit 1
fi

if [ -z "${GITHUB_OUTPUT:-}" ]; then
  echo "::error::GITHUB_OUTPUT is required."
  exit 1
fi

release_version="$(node -p "require('./packages/mcp/package.json').version")"
if ! printf '%s' "$release_version" | grep -Eq '^[0-9]+\.[0-9]+\.[0-9]+$'; then
  echo "::error::packages/mcp/package.json version must be strict semver without a v prefix."
  exit 1
fi

release_tag="mcp-v$release_version"
if git rev-parse "$release_tag" >/dev/null 2>&1; then
  echo "::error::Release tag already exists: $release_tag"
  exit 1
fi

if npm view "@heyclaude/mcp@$release_version" version >/dev/null 2>&1; then
  echo "::error::npm package version already exists: @heyclaude/mcp@$release_version"
  exit 1
fi

{
  echo "version=$release_version"
  echo "tag=$release_tag"
} >> "$GITHUB_OUTPUT"
