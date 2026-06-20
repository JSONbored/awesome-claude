# IndexNow

HeyClaude serves the public IndexNow key file at:

```text
https://heyclau.de/48486ebc7ddc47af875118345161ae70.txt
```

The key is intentionally public. It proves site ownership for IndexNow
submissions and is not treated as a secret.

IndexNow notifies **Bing, Yandex, Seznam, and Naver** (Bing shares onward).
**Google ignores IndexNow** — it uses `sitemap.xml` `lastmod` + crawl, which the
site already emits. So this is purely the Bing/everyone-else accelerator.

## Automated daily submission (changed URLs only)

A Cloudflare cron (`apps/web/plugins/indexnow-scheduled.ts`, daily 05:00 UTC —
see `wrangler.jsonc` `triggers.crons`) submits **only the entry URLs added or
updated in the last 48h**, derived from each entry's `contentUpdatedAt` /
`dateAdded`. It deliberately does **not** resubmit the whole sitemap —
resubmitting unchanged URLs gives no benefit and reads as spam.

- Runs on the production host (`heyclau.de`) only; dev/preview never submit.
- No secret required (the key is public). Set `INDEXNOW_DISABLED=1` to turn it
  off without a deploy.
- The manual script below remains for a one-off full-sitemap (re)submission.

## Local Dry Run

```bash
pnpm indexnow:submit -- --dry-run --url https://heyclau.de/skills
```

Without explicit `--url` or `--urls-file`, the script reads
`https://heyclau.de/sitemap.xml`, filters to same-host HTTPS URLs, and submits
valid URLs in batches.

## Production Submission

Production submission is guarded by environment:

```bash
INDEXNOW_SUBMIT=1 pnpm indexnow:submit
```

Optional overrides:

- `INDEXNOW_BASE_URL`: defaults to `https://heyclau.de`
- `INDEXNOW_KEY`: defaults to the committed public key
- `INDEXNOW_KEY_LOCATION`: defaults to the root key file URL
- `INDEXNOW_ALLOW_NON_PRODUCTION=1`: only for deliberate non-production testing

CI should run this only after the production deployment is live. Preview and
development URLs should not be submitted.
