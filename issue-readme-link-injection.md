# fix(security): README catalog is open to markdown link-injection via submitter-controlled title/description

**Labels:** `security`, `help wanted`

---

## Goal

Harden the README generation pipeline so that a merged content entry whose `title` or `description` contains markdown metacharacters cannot redirect catalog links to an attacker-controlled URL. Fix must close the gap in all three places that share the trust boundary: the schema validator, the generator, and the post-generation validator.

---

## Why this matters

The README catalog is HeyClaude's flagship trust artifact — it is the primary surface linked from awesome-lists, Gittensor eligibility listings, and search. A single injected entry can silently reroute an entire catalog row to an attacker-controlled domain. GitHub-Flavored Markdown renders the first `](…)` it encounters as the link target, so a title like `Cool tool](https://evil.example "x")[hijack` causes the visible entry to link to `evil.example` while the canonical `https://heyclau.de/…` URL appears as dead trailing text. The existing `pnpm validate:readme` check cannot detect this because it uses `String.includes()` — both the canonical URL and the raw description substring are still present in the output, so the validator reports a clean pass. This meets the bar for a high-severity structural security bug because:

- It is reachable today from a public, unauthenticated submission position.
- The maintainer merge workflow provides no automated signal of the injection.
- The same file (`scripts/generate-readme.mjs`) already calls `escapeHtml()` for the category-grid path (lines 99, 101), demonstrating the author understood the risk for one render path and missed the other.
- A single entry is enough to compromise visitor trust in the entire catalog.

---

## Current behavior

**`scripts/generate-readme.mjs:66-68`** — raw interpolation without escaping:

```js
function readmeEntryLine(category, entry) {
  return `- **[${entry.title}](https://heyclau.de/${category}/${entry.slug})** - ${entry.description}`;
}
```

**`scripts/generate-readme.mjs:339-348`** — `validateReadmeCatalog` uses substring matching only:

```js
// passes even after injection because the canonical URL is still present as trailing text
readmeContent.includes(url)
readmeContent.includes(entry.description)
```

**`packages/registry/src/submission.js:1384-1386`** — `validateSubmission` only length-checks `description`; no character-class rules for markdown metacharacters in `name` or `description`.

**`scripts/import-submission-issue.mjs:321,324`** — writes `title: fields.name` and `description: fields.description` directly into frontmatter without sanitisation.

**Repro sketch:**

Submit an entry with `name = Cool tool](https://evil.example "x")[hijack`. After a maintainer approves and `pnpm generate:readme` runs, the catalog row becomes:

```markdown
- **[Cool tool](https://evil.example "x")[hijack](https://heyclau.de/agents/cool-tool)** - ...
```

GFM closes the link at the first `](…)` — the visible link now points at `evil.example`. `pnpm validate:readme` still passes.

---

## Desired behavior

After this fix lands:

1. **Schema layer** — `content-schema.js` and `packages/registry/src/submission.js` reject `name` and `description` values that contain unescaped markdown link metacharacters (`]`, `[`, `(`, `)` in link-forming positions, or bare `](` sequences). The rejection message names the disallowed pattern so submitters know what to fix.

2. **Generator layer** — `readmeEntryLine` in `scripts/generate-readme.mjs` escapes `title` and `description` before interpolation, consistent with the `escapeHtml()` calls already present on lines 99 and 101 for the category-grid path. At minimum: escape `[`, `]`, `(`, `)` in the title field used inside `[…](…)` and in the description field used as trailing text.

3. **Validator layer** — `validateReadmeCatalog` replaces substring matching with line-by-line parsing that extracts the actual link target from each catalog entry and asserts it equals `https://heyclau.de/<category>/<slug>`. A line whose parsed href does not match the canonical pattern fails validation and blocks the README from being committed.

---

## Scope

- `scripts/generate-readme.mjs` — `readmeEntryLine` escaping + `validateReadmeCatalog` structural rewrite
- `packages/registry/src/content-schema.js` — add character-class rules for `name` / `description`
- `packages/registry/src/submission.js` — enforce same rules in `validateSubmission`
- `scripts/import-submission-issue.mjs` — sanitise `fields.name` / `fields.description` before writing frontmatter
- `tests/readme-generation.test.ts` — add injection fixtures and assert they are caught at each layer
- `packages/registry/src/` test fixtures if submission validation tests exist

---

## Out of scope

- Generated registry artifacts under `apps/web/public/data/**` and `apps/web/src/generated/**`
- Content imports (no content changes)
- CI or automation behavior beyond what is required to run the validation commands
- Vote/trending API (separate structural issue)
- HTML escaping in the web UI (separate from the README pipeline)

---

## Acceptance criteria

- `pnpm validate:content:strict` rejects a test entry whose `name` contains `](https://evil.example)`.
- `pnpm generate:readme && pnpm validate:readme` fails (non-zero exit) for any generated README line whose parsed link target is not `https://heyclau.de/<category>/<slug>`.
- `readmeEntryLine` output for a title containing `]` and `(` does not parse as a link to any domain other than `heyclau.de`.
- `validateReadmeCatalog` does not use `String.includes` for link-target verification; it parses each catalog line.
- All existing README generation tests continue to pass.
- New tests cover: injection in `title`, injection in `description`, clean entry (must pass), and entry rejected at schema layer.
- PR includes `Closes #<this issue>`.
- No generated artifact churn in the PR diff.

---

## Quality evidence required in the PR

- Paste the output of `pnpm validate:readme` run against a README generated from a canary entry with `](https://evil.example)` in its title — it must exit non-zero and print the offending line.
- Paste the output of `pnpm validate:content:strict` rejecting the same canary entry.
- List every function/export changed in `generate-readme.mjs` and `submission.js`.
- Note backward-compatibility: if the schema rule would reject any currently-valid entry in `content/`, list those entries and how they were updated.

---

## Validation

```sh
pnpm validate:content:strict
pnpm generate:readme
pnpm validate:readme
pnpm exec vitest run tests/readme-generation.test.ts
pnpm exec vitest run tests/submission-intake.test.ts 2>/dev/null || pnpm test:submission-intake
pnpm build
git diff --check
```

---

## Contributor guardrails

- [ ] Generated artifacts stay out of scope unless this issue explicitly asks for them.
- [ ] PRs should use a Conventional Commit-style title and include `Closes #<issue>`.
- [ ] UI or page changes must include screenshots in the PR, or explain `No visual impact`.

---

## Non-duplication confirmation

Verified against all open issues (pages 1–2) and closed issues (pages 1–4) as of 2026-05-28. The closest open issue is **#552** ("Improve safety, privacy, provenance, and package trust for top registry entries"), which concerns adding `safetyNotes`/`privacyNotes` metadata to high-traffic entries — not README link-target integrity. **#435** ("add security regression fixtures for hook script bodies") is about hook script content, not README generation. No open or closed issue touches `readmeEntryLine`, `validateReadmeCatalog` link-target parsing, or submission-layer markdown metacharacter validation.
