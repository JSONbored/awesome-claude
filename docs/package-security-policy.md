# Package Security Policy (Skills + MCP)

This project distinguishes between:

- first-party packages maintained by the HeyClaude maintainer
- external/community packages linked from third-party sources

## Trust model

- Local `downloadUrl` paths under `/downloads/...` require `packageVerified: true`.
- Community submissions should be source-backed: canonical repository, docs, install command, retrieval sources, or full copyable content.
- Community submissions may not request HeyClaude-hosted `/downloads/...` URLs.
- Community-submitted ZIP/MCPB archives are intake/review material only. They are not copied into public downloads or mirrored as published artifacts.
- Maintainer-built packages are convenience artifacts produced after review, with checksums and package trust metadata.

## Skills packages (`.zip`)

- First-party skills packages may be hosted locally at `/downloads/skills/<slug>.zip`.
- Source archives must exist in `content/skills/<slug>.zip`.
- Entry frontmatter must include `packageVerified: true`.
- External/community skill submissions can use `installCommand`, canonical source URLs, retrieval sources, or full copyable source content instead of a downloadable ZIP.
- Validation enforces:
  - `.zip` extension
  - maintainer-only local hosting
  - size limits
  - archive-path safety checks
  - expected skills archive shape

## MCP packages (`.mcpb`)

- First-party MCP packages may be hosted locally at `/downloads/mcp/<slug>.mcpb`.
- Source archives must exist in `content/mcp/<slug>.mcpb`.
- Entry frontmatter must include `packageVerified: true`.
- External/community MCP submissions should link to source/package metadata rather than ask HeyClaude to host a contributed package.
- Validation enforces:
  - `.mcpb` extension
  - maintainer-only local hosting
  - size limits
  - archive-path safety checks
  - required files (`manifest.json`, `package.json`, `README.md`, `server/index.js`)

## Scanner and quarantine posture

Package scans are defense-in-depth checks, not a guarantee that an artifact is safe.

- `pnpm validate:packages` verifies package metadata, local-hosting policy, size limits, and expected package shape.
- `pnpm scan:packages` performs archive path checks, file-count and zip-bomb limits, nested archive detection, executable/binary detection, and optional local scanner calls.
- Optional scanner integrations:
  - ClamAV for one-time malware scanning.
  - Trivy filesystem scans for vulnerabilities, secrets, misconfigurations, and license findings.
  - OSV-Scanner for dependency lockfiles when archives contain supported manifests.
- CI must not execute or install code from contributor-submitted archives.
- If a contributed archive is worth accepting, maintainers should unpack it in quarantine, review it, scan it, normalize the source tree, and rebuild any public package from trusted maintainer automation.

## Generated public mirrors

`apps/web/public/downloads/**` is generated from reviewed first-party package sources during the web prebuild. External contributor PRs should not edit these mirrors. Maintainer automation owns regeneration.

## User-facing disclosure

Detail pages display package trust context:

- `Maintainer-verified package` + SHA256 for first-party local downloads
- `External package (unverified)` warning for non-local links

## Liability posture

- The site does not guarantee security of external packages.
- Users should audit source and permissions before running downloadable artifacts.
- Verified package metadata means the artifact followed the HeyClaude review/build path; it is not a warranty that the artifact is harmless.
