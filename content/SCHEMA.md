# Content Schema

HeyClaude content is file-backed MDX under `content/<category>/`.

The canonical registry implementation lives in `packages/registry`. Content files remain the editorial source of truth, while the registry package owns category definitions, validation helpers, derived fields, copy text, submission parsing, and public artifact builders.

## Shared fields

Every entry should include:

- `title`
- `slug`
- `category`
- `description`
- `cardDescription`
- `author`
- `dateAdded`
- `tags`
- `seoTitle`
- `seoDescription`

Important:

- `description` is a concise summary, not a feature dump. Keep it short and truthful.
- `repoUrl` is optional. Use it when there is a real upstream repository.
- Do not use the directory repo as a placeholder `repoUrl` for unrelated assets.

## Brand fields

Use these when a resource has a clear provider, product, or service brand:

- `brandName`
- `brandDomain`
- `brandAssetSource`
- `brandIconUrl`
- `brandLogoUrl`
- `brandVerifiedAt`
- `brandColors`

Important:

- `brandDomain` is the canonical enrichment key. Use the provider domain such as `asana.com`, not GitHub, docs hosting, package registry, or redirect domains.
- `brandAssetSource` should be `brandfetch` for Brandfetch CDN assets, `manual` for reviewed local/manual assets, or omitted when no brand asset is known.
- `brandIconUrl` and `brandLogoUrl` must be HTTPS Brandfetch URLs, HeyClaude/local asset URLs, or omitted. Do not hotlink arbitrary favicons.
- Brand fields are optional for submissions. Maintainers can add or correct them during review.

## Shared install/usage fields

Use these when applicable:

- `installable`
- `installCommand`
- `usageSnippet`
- `copySnippet`
- `scriptLanguage`
- `trigger`
- `prerequisites`
- `safetyNotes`
- `privacyNotes`

Use the three note-style fields for different jobs:

- `prerequisites`: setup requirements a user should complete first, such as installed runtimes, accounts, environment variables, or Claude client support.
- `safetyNotes`: execution, permission, destructive-action, background-worker, network-access, package/install, account-write, or automation risks.
- `privacyNotes`: local files, logs, credentials, telemetry, third-party data handling, retained data, or user data exposure.

`safetyNotes` and `privacyNotes` are optional arrays of short strings. They are expected when a hook, MCP server, skill, command, or statusline handles sensitive behavior. Do not use `disclosure` for these warnings; `disclosure` is reserved for tool/commercial listing status.

## Category notes

- `mcp`: prefer `installCommand`, `usageSnippet`
- `tools`: use `websiteUrl`, `pricingModel`, and `disclosure`; products and services should go through `/tools/submit`
- `skills`: prefer source-backed `installCommand`, `usageSnippet`, `copySnippet`, `retrievalSources`, and capability metadata
- `hooks`: prefer `trigger`, `usageSnippet`, `copySnippet`
- `statuslines`: prefer `scriptLanguage`, `copySnippet`
- `commands`: prefer `usageSnippet`, `copySnippet`
- `agents` and `rules`: prefer `copySnippet`
- `guides`: avoid treating guides as copy-first assets; prioritize structured walkthrough content
- `collections`: prefer `items`, `installationOrder`, and bundle guidance over `copySnippet`

## Submission paths

- Free Claude resources should start with `/submit` or the generated GitHub issue forms.
- Pull requests are for advanced contributors who can add MDX directly and run the full gate.
- Fully valid, source-backed, non-artifact issues may be approved for an import PR after gates pass. Maintainer review still gates merge.
- Tools, apps, services, sponsorships, claims, and jobs use the website lead forms, not content issue templates.
- Contributor links must be official source/docs/release URLs. Affiliate, referral, tracking, or local package-hosting requests are rejected.
- Community ZIP/MCPB artifacts are not published as HeyClaude-hosted downloads. Maintainer-built packages require package trust metadata.
- Risk-bearing submissions may be blocked or sent back when execution, permission, credential, local-data, background-worker, external-write, or package behavior is not disclosed with `safetyNotes` / `privacyNotes`.

## Workflow

1. Run `pnpm validate:content:strict`
2. Run `pnpm validate:issue-templates`
3. Run `pnpm validate:packages`
4. Run `pnpm scan:packages`
5. Run `pnpm audit:content`
6. Run `pnpm validate:clean`
7. Run `pnpm --filter web run prebuild` to regenerate registry artifacts
8. Run `pnpm test:registry-artifacts`
9. Fix missing fields and semantic audit issues
10. Regenerate issue templates and README when category/content counts change
