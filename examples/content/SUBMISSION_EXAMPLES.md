# Submission Examples

Use these examples to decide whether a submission belongs in the free
HeyClaude content review flow.

Start with the [Submit page](https://heyclau.de/submit) or the
[GitHub issue forms](https://github.com/JSONbored/awesome-claude/issues/new/choose).
Use [SCHEMA.md](SCHEMA.md) for field requirements and
[package-security-policy.md](../../docs/package-security-policy.md) for ZIP and
MCPB handling.

## Accepted Examples

| Category | Example | Why it passes |
| --- | --- | --- |
| Agent | A source-backed agent with a canonical GitHub repo, docs URL, focused task description, `copySnippet`, and clear author/license provenance. | Maintainers can verify the source and understand when the agent should be used. |
| MCP server | An MCP server with `installCommand`, repo URL, docs URL, config snippet, and notes saying it only reads a configured workspace path and makes no third-party calls. | The entry is installable, source-backed, and includes safety/privacy behavior. |
| Skill | A general or capability-pack skill that provides source/docs, retrieval sources, tested platforms, and an install command or copyable source instead of asking HeyClaude to host a ZIP. | Community skills should be source-backed; maintainer-built ZIPs are separate reviewed artifacts. |
| Hook | A `UserPromptSubmit` or `PostToolUse` hook with trigger, script body, config snippet, and notes for file writes, network calls, logs, credentials, or retained data. | Hooks can run automatically, so safety and privacy notes must be explicit. |
| Command | A slash command with `commandSyntax`, usage snippet, copyable command content, and warnings for package installs, external writes, or destructive actions. | The command is reproducible and does not hide risky behavior. |
| Collection | A collection that groups existing reviewed entries, such as related skills and hooks already present under `content/`, with setup order and difficulty. | Collections should curate known entries, not bypass review for new resources. |

## Rejected Or Rerouted Examples

| Submission | Decision | Why |
| --- | --- | --- |
| A paid SaaS or affiliate listing submitted as an agent, with marketing copy and no reusable source. | Reject or reroute to the [tools/app listing flow](https://heyclau.de/tools/submit). | Free content issues are not paid placements, product promos, sponsorships, claims, or jobs. |
| A request to publish `my-skill.zip` or `my-server.mcpb` at `/downloads/...`. | Reject the hosting request. | Community ZIP/MCPB archives are review material only; public downloads are maintainer-built after review. |
| A skill or MCP submission that has only an uploaded artifact and no source repo, docs, install command, retrieval sources, or copyable content. | Reject until source-backed details are provided. | Maintainers need a verifiable source and build path before listing package-like resources. |
| A PR that edits `README.md`, `apps/web/public/data/**`, `apps/web/src/generated/**`, or `apps/web/public/downloads/**` for a community entry. | Request removal of generated files. | Generated registry artifacts and public mirrors are owned by maintainer automation. |
| A hook or MCP server that reads home directories, sends prompts to a third-party API, writes files, or runs background workers without notes. | Reject until safety and privacy notes are added. | Users need to know what the resource can access, change, send, log, or retain. |
| A job, consulting service, hosted app, claim/update request, or commercial tool submitted through a category issue template. | Reroute to the relevant website lead form. | These are not free registry content submissions and use separate review flows. |
| A collection containing unreleased or unreviewed resources that are not included as separate entries. | Reject or split into separate submissions. | Collection entries must reference existing reviewed content or companion entries that can be reviewed independently. |

## Quick Checks Before Submitting

- Use official source, docs, release, or website URLs. Do not use affiliate,
  referral, tracking, or unverifiable URLs.
- Explain generated-artifact ownership: community PRs should not edit generated
  README, public data, adapters, or download mirrors unless a maintainer asks.
- For skills and MCP servers, do not request HeyClaude-hosted ZIP/MCPB files.
  Link source or provide install/copyable content instead.
- For hooks, MCP servers, skills, commands, and statuslines, include
  `safety_notes` and `privacy_notes` when the resource executes code, reads
  local files, handles credentials, logs data, calls external services, writes
  or deletes data, or runs in the background.
- Use the category schema in [SCHEMA.md](SCHEMA.md). If the category is wrong,
  reroute before submitting rather than forcing the closest template.
