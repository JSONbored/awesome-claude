# Resend Newsletter Playbook

The newsletter is **fully automated** through the site Worker + Resend. There is
no manual React Email render/sync step and no dashboard-broadcast workflow — all
emails are generated in-worker and sent programmatically.

## Architecture

- **Templates:** `apps/web/src/lib/newsletter-emails.ts` — a single design-system
  token source (light-mode `styles.css` palette, Space Grotesk + DM Sans, citron
  accent). Builders: `buildNewsletterConfirmEmail`, `buildWelcomeEmail`,
  `buildDigestEmail`. No tracking pixels.
- **Confirm (double opt-in):** `api/newsletter/subscribe` emails a signed
  (HMAC) confirm link; `api/public/newsletter/confirm` verifies it (POST, rate
  limited, single-use, 8 KB body cap) and adds the contact to the Resend audience.
- **Welcome:** sent transactionally on first-time confirm.
- **Weekly digest:** `plugins/newsletter-digest-scheduled.ts`, Cloudflare cron
  `0 16 * * SUN` (Sundays 16:00 UTC). Selects entries added in the last 7 days,
  **skips the week if fewer than 5**, and sends a Resend broadcast to the segment.
- **Insights:** client `umami.track('newsletter-subscribe')`; server
  `newsletter-digest-sent`; optional Resend webhook (`api/newsletter/webhook`,
  svix-verified) → Discord and/or umami for delivered/click/bounce. Open tracking
  stays **off** (honors the "no tracking pixels" promise); clicks via Resend's
  click subdomain.

## Required Worker secrets

`RESEND_API_KEY`, `RESEND_SEGMENT_ID` (the audience/segment), `RESEND_FROM` (a
Resend-**verified** sender, e.g. `HeyClaude <newsletter@mail.heyclau.de>` — the
apex `heyclau.de` is not verified), `NEWSLETTER_CONFIRM_SECRET` (random 32+
chars). Optional: `RESEND_WEBHOOK_SECRET` + `DISCORD_WEBHOOK_URL` for the
subscriber webhook; `UMAMI_UPSTREAM_URL` for the analytics proxy origin.

## Policy

- Cadence: one digest per week, automatically, only when there is enough new
  content (the ≥5 skip rule). Never send thin/empty.
- Keep preference + unsubscribe handling inside Resend (the broadcast injects
  `{{{RESEND_UNSUBSCRIBE_URL}}}`).
- No PII in analytics event data.
- A WAF custom rule exempts `/api/public/newsletter/confirm` from the
  non-JSON-POST block (the confirm page is an HTML form post).

## Attribution

- Add UTM params when linking to HeyClaude from a send:
  `utm_source=newsletter&utm_medium=email&utm_campaign=<slug>`.
- Prefer canonical entry URLs and feed/API-docs links.

## Future (not built)

- Resend Email Workers for inbound flows (claim/update routing) — Resend stays
  the subscriber/sending/deliverability system of record.
