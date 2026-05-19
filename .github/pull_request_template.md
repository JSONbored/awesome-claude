# Pull Request

## Summary

- Briefly describe what changed.

## Submission Source

- [ ] New content file(s) added under `content/<category>/`
- [ ] Existing content updated
- [ ] Submission issue resolved (link it here): #
- [ ] Direct content submissions include `submittedBy` and `submittedByUrl` frontmatter matching the PR author.
- [ ] I did not modify `README.md`, generated registry outputs, or `apps/web/public/downloads/**` unless this is a maintainer/internal automation branch.
- [ ] I did not request HeyClaude-hosted `/downloads/...` package hosting for community-submitted ZIP/MCPB artifacts.

## Schema and Quality Checks

- [ ] `pnpm validate:content` passed
- [ ] `pnpm validate:packages` passed
- [ ] `pnpm scan:packages` passed when package artifacts changed
- [ ] `pnpm audit:content` ran and I reviewed findings
- [ ] No forbidden fields were added (`viewCount`, `copyCount`, `popularityScore`)
- [ ] Install/use/copy paths are practical and complete
- [ ] Skill submissions include capability metadata when applicable (`skillType`, `skillLevel`, `verificationStatus`, `verifiedAt`, `retrievalSources`, `testedPlatforms`)

## Validation

- [ ] Local build passed (`pnpm build`)
- [ ] I spot-checked the affected detail page(s)

## Notes

- Any caveats, follow-ups, or reviewer context.
