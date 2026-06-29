# @heyclaude/mcp Changelog

## [0.6.0](https://github.com/JSONbored/awesome-claude/compare/mcp-v0.5.3...mcp-v0.6.0) (2026-06-29)


### Features

* **mcp:** add compare_entry_trust read-only helper ([#4215](https://github.com/JSONbored/awesome-claude/issues/4215)) ([7f3c439](https://github.com/JSONbored/awesome-claude/commit/7f3c43960ac10e1c0cc093578873c1d34ee58fe0))
* **search:** share registry ranking across web and mcp ([#4242](https://github.com/JSONbored/awesome-claude/issues/4242)) ([c8cb601](https://github.com/JSONbored/awesome-claude/commit/c8cb601abf6ea75badaaa67a0bd9374398508270))

## [0.5.3](https://github.com/JSONbored/awesome-claude/compare/mcp-v0.5.2...mcp-v0.5.3) (2026-06-25)


### Bug Fixes

* **mcp:** rename prompts to dot-notation for Smithery naming 100/100 ([#4230](https://github.com/JSONbored/awesome-claude/issues/4230)) ([633ee17](https://github.com/JSONbored/awesome-claude/commit/633ee17aea08ff0117d9f53d378f9f1edaf40f35))

## [0.5.2](https://github.com/JSONbored/awesome-claude/compare/mcp-v0.5.1...mcp-v0.5.2) (2026-06-25)


### Bug Fixes

* **mcp:** merge singleton namespaces into registry.* for Smithery naming tree ([#4227](https://github.com/JSONbored/awesome-claude/issues/4227)) ([9af8a61](https://github.com/JSONbored/awesome-claude/commit/9af8a61fb3373807a46b1fec909c0eea11b4038d))

## [0.5.1](https://github.com/JSONbored/awesome-claude/compare/mcp-v0.5.0...mcp-v0.5.1) (2026-06-25)


### Bug Fixes

* **mcp:** rename plan_workflow_toolbox to workflow.plan for dot-notation naming ([#4225](https://github.com/JSONbored/awesome-claude/issues/4225)) ([930f343](https://github.com/JSONbored/awesome-claude/commit/930f343619548c5414c6b4f5697ac2067993db3d))

## [0.5.0](https://github.com/JSONbored/awesome-claude/compare/mcp-v0.4.0...mcp-v0.5.0) (2026-06-25)


### Features

* **mcp:** rename tools to dot-notation for Smithery 100/100 naming score ([#4223](https://github.com/JSONbored/awesome-claude/issues/4223)) ([343d993](https://github.com/JSONbored/awesome-claude/commit/343d9939c8f388ed8ce618b40290b6a1a11011fa))

## [0.4.0](https://github.com/JSONbored/awesome-claude/compare/mcp-v0.3.1...mcp-v0.4.0) (2026-06-25)


### Features

* **mcp:** cache parsed artifacts and add search_registry tag filter ([#4211](https://github.com/JSONbored/awesome-claude/issues/4211)) ([0446b40](https://github.com/JSONbored/awesome-claude/commit/0446b403163136b4729dcfdd4f5b4488550ef52e))
* **mcp:** list HeyClaude MCP server on MCP Registry + Smithery and automate releases ([#4216](https://github.com/JSONbored/awesome-claude/issues/4216)) ([0666547](https://github.com/JSONbored/awesome-claude/commit/0666547dc130ca44841cc7ab096ac327e4dbbb47))
* **mcp:** Smithery quality — parameter descriptions, naming, badge ([#4218](https://github.com/JSONbored/awesome-claude/issues/4218)) ([41aac15](https://github.com/JSONbored/awesome-claude/commit/41aac1514dfd7453868c41034721ffb9bb295e4d))
* **seo:** canonical platform taxonomy across registry, search, and MCP ([#4096](https://github.com/JSONbored/awesome-claude/issues/4096)) ([7a0cda0](https://github.com/JSONbored/awesome-claude/commit/7a0cda03830e59a2b5dd1187252ebdf393c2147b))


### Bug Fixes

* **mcp:** expose duplicate URL inputs ([5ad0f8c](https://github.com/JSONbored/awesome-claude/commit/5ad0f8c9a6a9638ac6776c761d26ba6c8b116452))

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
