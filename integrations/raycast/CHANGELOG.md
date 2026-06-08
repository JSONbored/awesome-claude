# HeyClaude Changelog

## [Search and Claude Code MCP Install] - {PR_MERGE_DATE}

- Add a confirmed `Install in Claude Code` action for MCP entries with
  machine-readable config metadata.
- Improve server-backed search with installable/source/platform/trust filters
  and token-aware matching.
- Show compact visual signals for installability, source backing, trust, and
  safety/privacy notes.
- Use richer detail metadata and sectioned search results for easier scanning.
- Improve icon fallback coverage for entries without explicit brand icons.

## [Initial Store Release] - {PR_MERGE_DATE}

- Add the `Search HeyClaude` command.
- Browse the public HeyClaude directory by category.
- Copy or paste full Claude assets, install commands, and config snippets.
- Add structured detail metadata, share actions, Quicklink creation, and
  opt-in Snippet creation for install/config payloads.
- Save local favorites using Raycast LocalStorage.
- Rank frequently used entries and jobs locally with Raycast frecency sorting.
- Cache the public feed and per-entry details for resilient read-only search.
- Add dedicated `Submit New Content` and `Get Involved with HeyClaude`
  commands while keeping contribution paths browser/PR-first.
