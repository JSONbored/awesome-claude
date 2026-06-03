# Pull Request

## Summary

- Briefly describe what changed.

## Submission Source

For direct content PRs:

- [ ] This PR changes exactly one `content/<category>/<slug>.mdx` file.
- [ ] The entry includes source/provenance URLs and practical install/use details.
- [ ] `submittedBy` and `submittedByUrl` match the PR author.
- [ ] I did not modify `README.md`, generated registry outputs, downloads, workflows, packages, scripts, or multiple content entries.
- [ ] I did not request HeyClaude-hosted `/downloads/...` package hosting for community-submitted ZIP/MCPB artifacts.

For platform/code/docs PRs:

- [ ] This is not a direct content submission.
- [ ] Changed routes/components/endpoints/tools are listed below.
- [ ] Screenshots or `No visual impact` are included when relevant.

## Schema and Quality Checks

- [ ] Content PR: `pnpm validate:content:strict` passed, or I am relying on CI.
- [ ] Platform/code PR: focused validation is listed below.
- [ ] Package artifact PR: `pnpm validate:packages` and `pnpm scan:packages` passed.
- [ ] No forbidden fields were added (`viewCount`, `copyCount`, `popularityScore`)
- [ ] Install/use/copy paths are practical and complete.
- [ ] Skill submissions include capability metadata when applicable (`skillType`, `skillLevel`, `verificationStatus`, `verifiedAt`, `retrievalSources`, `testedPlatforms`).

## Quality Evidence

- Changed routes/components/endpoints/tools:
- Expected behavior:
- Important edge cases or invariants:
- Backward compatibility notes:
- Screenshots for frontend/page/UI changes:
  - Desktop:
  - Mobile:
- If screenshots do not apply, write `No visual impact` and explain why.
- Accessibility notes for UI changes:
- Focused tests or reason tests are not practical:

## Validation

- [ ] Direct content PR: I did not run generation or commit generated output.
- [ ] Platform/code PR: `pnpm build` passed, or the reason it was not run is listed below.
- [ ] I ran the focused checks listed above.
- [ ] I spot-checked the affected detail page(s), route(s), or integration surface(s), if applicable.

## Notes

- Any caveats, follow-ups, or reviewer context.
