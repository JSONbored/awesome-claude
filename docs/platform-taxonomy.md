# Platform taxonomy

Platform IDs are canonical kebab slugs (`claude-code`, `cursor`, `codex`, …),
defined once in `packages/registry/src/platforms.js` (`PLATFORM_IDS`,
`PLATFORM_LABELS`, `normalizePlatform`, `normalizePlatforms`) and mirrored by the
`Platform` type in `apps/web/src/types/registry.ts`.

Generated search facets, platform hubs, the directory/search indexes, and the
read-only MCP tools all use these canonical IDs, so the same platform is never
split across a display label and a slug. Free-form skill compatibility labels
("Cursor", "Generic AGENTS") are still shown verbatim in visible compatibility
tables — only the facet/ID surface is normalized.

## Migration (API value change)

Platform values in `directory-index.json` / `search-index.json` and in MCP tool
responses are now canonical IDs (e.g. `"cursor"`, not `"Cursor"`; `"cli"`, not
`"Generic AGENTS"`). MCP/search platform **filters** accept a canonical ID or a
display alias (both `"cursor"` and `"Cursor"` resolve to `cursor`). There is no
backwards-compatibility shim for raw label values in the generated artifacts.
