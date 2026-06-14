# @heyclaude/mcp Changelog

## 0.3.1 - Stdio Proxy and Planner Type Fixes

- Keep submission draft helper tools local to the stdio proxy instead of
  forwarding them to the remote MCP endpoint.
- Export the workflow planner toolbox schema from the package runtime and type
  declarations so TypeScript consumers can import the planner API without
  missing-export errors.

## 0.3.0 - Safety Metadata and Submission Policy

- Expose registry `safetyNotes` and `privacyNotes` in MCP search, detail,
  copyable asset, comparison, and install guidance responses.
- Accept `safety_notes` and `privacy_notes` in submission draft helpers with
  the same short-note limits used by HeyClaude intake.
- Support source-backed and copyable-content skill submissions without requiring
  community ZIP/MCPB package hosting.
- Reflect the review-gated import policy: submission helpers can prepare issues
  and local checks, but never create issues, open PRs, merge, publish, or mirror
  package artifacts.

## 0.2.0 - Discovery and Submission Drafting

- Add read-only discovery tools for server metadata, paginated category
  browsing, recent updates, and related entries.
- Add copyable asset, entry comparison, registry stats, and client setup tools
  for richer MCP client workflows.
- Add read-only MCP resources and workflow prompts for discovery, submission
  drafting, pre-issue review, and safe install guidance.
- Add submission helper tools for examples, canonical issue drafts, duplicate
  review, and maintainer checklist guidance.
- Document the public no-key access model and the dedicated MCP rate-limit
  policy.

## 0.1.2 - Repository Rename

- Update package metadata, README links, and release provenance for the
  `JSONbored/awesome-claude` GitHub repository.
- Keep published package behavior unchanged.

## 0.1.1 - Package Page Polish

- Add npm-facing package README branding, repository links, npm links, and
  release provenance notes.
- Keep published package behavior unchanged.

## 0.1.0 - Initial Public Package

- Add remote-first stdio bridge for the public HeyClaude MCP endpoint.
- Keep explicit local artifact mode for development and release validation.
- Expose read-only registry search, detail, compatibility, install guidance,
  feed discovery, and submission-draft helper tools.
- Add package smoke validation for packed npm installs.
