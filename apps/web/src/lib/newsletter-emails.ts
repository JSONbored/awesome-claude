// On-brand newsletter emails, built as inline strings (not React Email) so they
// render in the Worker without a runtime React dependency. Light theme matching
// the heyclau.de design system; no tracking pixels.
//
// Single source of truth for the email design tokens lives in THEME below — the
// hex values are the light-mode `styles.css` oklch tokens converted to sRGB
// (email clients don't support oklch). Confirm + welcome are transactional;
// the digest is a Resend broadcast.

import type { DigestItem } from "@/lib/newsletter-digest";

// Light-mode design tokens (oklch -> hex). Keep in sync with apps/web/src/styles.css.
const THEME = {
  canvas: "#f8f6ed", // --background (warm paper)
  card: "#fcfaf4", // --surface
  hairline: "#ece9e0", // inner dividers (between --surface-2 and --border)
  border: "#dad7cf", // --border
  ink: "#13110d", // --ink
  muted: "#58554e", // --ink-muted
  subtle: "#6d6a63", // --ink-subtle
  accent: "#e1f32a", // --accent (citron)
  onInk: "#f8f6ed", // text on the ink button
} as const;

const DISPLAY =
  "'Space Grotesk',-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif";
const BODY = "'DM Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif";

// Progressive web fonts for clients that honor them (Apple Mail, iOS Mail);
// everything else falls back to the system stacks above.
const FONT_FACE = [
  "@font-face{font-family:'Space Grotesk';font-style:normal;font-weight:600;font-display:swap;src:url(https://heyclau.de/fonts/space-grotesk-600-latin.woff2) format('woff2');}",
  "@font-face{font-family:'Space Grotesk';font-style:normal;font-weight:700;font-display:swap;src:url(https://heyclau.de/fonts/space-grotesk-700-latin.woff2) format('woff2');}",
  "@font-face{font-family:'DM Sans';font-style:normal;font-weight:400;font-display:swap;src:url(https://heyclau.de/fonts/dm-sans-400-latin.woff2) format('woff2');}",
  "@font-face{font-family:'DM Sans';font-style:normal;font-weight:500;font-display:swap;src:url(https://heyclau.de/fonts/dm-sans-500-latin.woff2) format('woff2');}",
].join("");

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function trimUrl(siteUrl: string): string {
  return siteUrl.replace(/\/$/, "");
}

function siteHostOf(siteUrl: string): string {
  return siteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

/** Shared light-theme document shell: forces light, embeds the brand fonts, centers the card. */
function emailShell(opts: { preheader: string; inner: string }): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <style>${FONT_FACE}</style>
  </head>
  <body style="margin:0;padding:0;background:${THEME.canvas};">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(opts.preheader)}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${THEME.canvas};padding:40px 16px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:${THEME.card};border:1px solid ${THEME.border};border-radius:14px;">
          ${opts.inner}
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}

function eyebrow(text: string): string {
  return `<div style="font-family:${DISPLAY};font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:${THEME.muted};font-weight:500;">${text}</div>`;
}

function primaryButton(href: string, label: string): string {
  return `<a href="${href}" style="display:inline-block;background:${THEME.ink};color:${THEME.onInk};text-decoration:none;font-family:${DISPLAY};font-weight:600;font-size:15px;padding:13px 22px;border-radius:10px;">${label}</a>`;
}

// Standing growth/revenue CTAs (submissions, paid jobs, sponsorship) for the
// welcome + digest footers — deliberately one quiet line.
function standingCtasHtml(siteUrl: string): string {
  const base = trimUrl(siteUrl);
  const link = (href: string, label: string) =>
    `<a href="${base}${href}" style="color:${THEME.muted};text-decoration:underline;">${label}</a>`;
  return `<tr><td style="padding:18px 30px 6px;border-top:1px solid ${THEME.hairline};">
            <div style="font-family:${BODY};font-size:13px;line-height:1.7;color:${THEME.subtle};">${link("/submit", "Built something? Submit it")} &middot; ${link("/jobs/post", "Hiring? Post a role")} &middot; ${link("/advertise", "Sponsor")}</div>
            <div style="font-family:${BODY};font-size:12px;line-height:1.6;color:${THEME.subtle};margin-top:8px;">Enjoying this? Forward it to a teammate.</div>
          </td></tr>`;
}

function standingCtasText(siteUrl: string): string {
  const base = trimUrl(siteUrl);
  return [
    "—",
    `Built something? Submit it: ${base}/submit`,
    `Hiring? Post a role: ${base}/jobs/post`,
    `Sponsor: ${base}/advertise`,
    "Enjoying this? Forward it to a teammate.",
  ].join("\n");
}

/** Double opt-in confirmation email (transactional). Minimal by design to maximize confirm rate. */
export function buildNewsletterConfirmEmail(opts: { confirmUrl: string; siteUrl: string }): {
  subject: string;
  html: string;
  text: string;
} {
  const confirmUrl = escapeHtml(opts.confirmUrl);
  const host = escapeHtml(siteHostOf(opts.siteUrl));
  const subject = "Confirm your HeyClaude subscription";

  const inner = `<tr><td style="padding:32px 30px 8px;">
            ${eyebrow("HeyClaude")}
            <h1 style="margin:14px 0 0;font-family:${DISPLAY};font-weight:600;font-size:25px;letter-spacing:-0.02em;line-height:1.1;color:${THEME.ink};">Confirm your subscription</h1>
            <p style="margin:14px 0 0;font-family:${BODY};font-size:15px;line-height:1.6;color:${THEME.muted};">One calm read on Claude workflows, every Sunday. Confirm your email and you're in &mdash; unsubscribe any time.</p>
          </td></tr>
          <tr><td style="padding:24px 30px 8px;">${primaryButton(confirmUrl, "Confirm subscription")}</td></tr>
          <tr><td style="padding:8px 30px 32px;">
            <p style="margin:0;font-family:${BODY};font-size:12px;line-height:1.6;color:${THEME.subtle};">If the button doesn't work, paste this link into your browser:<br><a href="${confirmUrl}" style="color:${THEME.subtle};word-break:break-all;">${confirmUrl}</a></p>
            <p style="margin:16px 0 0;font-family:${BODY};font-size:12px;line-height:1.6;color:${THEME.subtle};">Didn't request this? Ignore this email &mdash; nothing was added. &middot; ${host}</p>
          </td></tr>`;

  const text = [
    "Confirm your HeyClaude subscription",
    "",
    "One calm read on Claude workflows, every Sunday. Confirm your email and you're in — unsubscribe any time.",
    "",
    `Confirm: ${opts.confirmUrl}`,
    "",
    "Didn't request this? Ignore this email — nothing was added.",
    host,
  ].join("\n");

  return { subject, html: emailShell({ preheader: "Confirm your subscription to the HeyClaude weekly brief.", inner }), text };
}

/** Welcome email sent (transactional) right after a subscriber confirms. */
export function buildWelcomeEmail(opts: { siteUrl: string }): {
  subject: string;
  html: string;
  text: string;
} {
  const base = trimUrl(opts.siteUrl);
  const host = escapeHtml(siteHostOf(opts.siteUrl));
  const subject = "You're in — welcome to HeyClaude";

  const inner = `<tr><td style="padding:32px 30px 8px;">
            ${eyebrow("HeyClaude")}
            <h1 style="margin:14px 0 0;font-family:${DISPLAY};font-weight:600;font-size:26px;letter-spacing:-0.02em;line-height:1.1;color:${THEME.ink};">You're <span style="background:${THEME.accent};padding:0 6px;border-radius:2px;">in</span>.</h1>
            <p style="margin:14px 0 0;font-family:${BODY};font-size:15px;line-height:1.6;color:${THEME.muted};">Thanks for confirming. Every Sunday you'll get one calm read: the best new Claude Code agents, MCP servers, skills, and workflows reviewed that week. No hype, no tracking pixels.</p>
          </td></tr>
          <tr><td style="padding:20px 30px 4px;">${primaryButton(`${base}/best`, "Start with the best of HeyClaude")}</td></tr>
          <tr><td style="padding:12px 30px 4px;">
            <p style="margin:0;font-family:${BODY};font-size:14px;line-height:1.7;color:${THEME.muted};">While you wait for Sunday:<br>&bull; <a href="${base}/state-of-claude-tooling" style="color:${THEME.ink};">The state of Claude tooling</a><br>&bull; <a href="${base}/browse" style="color:${THEME.ink};">Browse the full directory</a></p>
          </td></tr>
          ${standingCtasHtml(opts.siteUrl)}
          <tr><td style="padding:2px 30px 28px;">
            <p style="margin:8px 0 0;font-family:${BODY};font-size:12px;line-height:1.6;color:${THEME.subtle};">Manage your subscription at <a href="${base}/subscriptions" style="color:${THEME.subtle};">${host}/subscriptions</a>.</p>
          </td></tr>`;

  const text = [
    "You're in — welcome to HeyClaude",
    "",
    "Thanks for confirming. Every Sunday: one calm read on the best new Claude tools reviewed that week. No hype, no tracking pixels.",
    "",
    `Start with the best of HeyClaude: ${base}/best`,
    `The state of Claude tooling: ${base}/state-of-claude-tooling`,
    `Browse the directory: ${base}/browse`,
    "",
    standingCtasText(opts.siteUrl),
    "",
    `Manage your subscription: ${base}/subscriptions`,
  ].join("\n");

  return { subject, html: emailShell({ preheader: "Welcome — your weekly Claude brief lands Sundays.", inner }), text };
}

/**
 * Acknowledgment email (transactional) sent to someone who submits a commercial
 * listing / job / sponsorship inquiry, confirming we received it and what happens
 * next. Low volume, expected by the recipient — not marketing.
 */
export function buildListingLeadAckEmail(opts: {
  siteUrl: string;
  contactName: string;
  listingTitle: string;
  kind: string;
}): { subject: string; html: string; text: string } {
  const base = trimUrl(opts.siteUrl);
  const host = escapeHtml(siteHostOf(opts.siteUrl));
  const name = escapeHtml(opts.contactName.trim().split(/\s+/)[0] || "there");
  const title = escapeHtml(opts.listingTitle.trim() || "your submission");
  const kindLabel =
    opts.kind === "job"
      ? "job listing"
      : opts.kind === "claim"
        ? "listing claim"
        : opts.kind === "tool"
          ? "tool listing"
          : "listing";
  const ctaHref = opts.kind === "job" ? `${base}/jobs/post` : `${base}/advertise`;
  const ctaLabel = opts.kind === "job" ? "See job listing options" : "See listing options";
  const subject = "We got your HeyClaude inquiry";

  const inner = `<tr><td style="padding:32px 30px 8px;">
            ${eyebrow("HeyClaude")}
            <h1 style="margin:14px 0 0;font-family:${DISPLAY};font-weight:600;font-size:26px;letter-spacing:-0.02em;line-height:1.1;color:${THEME.ink};">Thanks, ${name} &mdash; we've <span style="background:${THEME.accent};padding:0 6px;border-radius:2px;">got it</span>.</h1>
            <p style="margin:14px 0 0;font-family:${BODY};font-size:15px;line-height:1.6;color:${THEME.muted};">We received your ${kindLabel} inquiry for <strong style="color:${THEME.ink};">${title}</strong>. A maintainer reviews every submission by hand &mdash; usually within a couple of days &mdash; and we'll reply straight to this email with next steps.</p>
          </td></tr>
          <tr><td style="padding:20px 30px 4px;">${primaryButton(ctaHref, ctaLabel)}</td></tr>
          <tr><td style="padding:12px 30px 28px;">
            <p style="margin:0;font-family:${BODY};font-size:13px;line-height:1.7;color:${THEME.subtle};">In the meantime, browse the directory at <a href="${base}/browse" style="color:${THEME.ink};">${host}/browse</a>.</p>
            <p style="margin:14px 0 0;font-family:${BODY};font-size:12px;line-height:1.6;color:${THEME.subtle};">Didn't submit this? You can ignore this email. &middot; ${host}</p>
          </td></tr>`;

  const text = [
    "Thanks — we got your HeyClaude inquiry",
    "",
    `We received your ${kindLabel} inquiry for ${opts.listingTitle.trim() || "your submission"}. A maintainer reviews every submission by hand — usually within a couple of days — and we'll reply straight to this email with next steps.`,
    "",
    `${ctaLabel}: ${ctaHref}`,
    `Browse the directory: ${base}/browse`,
    "",
    "Didn't submit this? You can ignore this email.",
    host,
  ].join("\n");

  return {
    subject,
    html: emailShell({ preheader: "We received your inquiry — a maintainer will be in touch.", inner }),
    text,
  };
}

/** Weekly "new & notable" digest, sent as a Resend broadcast. */
export function buildDigestEmail(opts: {
  siteUrl: string;
  items: DigestItem[];
  dateLabel: string;
}): { subject: string; html: string; text: string } {
  const base = trimUrl(opts.siteUrl);
  const subject = `New on HeyClaude — ${opts.dateLabel}`;

  const itemsHtml = opts.items
    .map((item) => {
      const url = `${base}/entry/${encodeURIComponent(item.category)}/${encodeURIComponent(item.slug)}`;
      const summary = item.summary
        ? `<div style="margin:3px 0 0;font-family:${BODY};font-size:14px;line-height:1.55;color:${THEME.muted};">${escapeHtml(item.summary)}</div>`
        : "";
      return `<tr><td style="padding:14px 30px 0;">
            <div style="border-top:1px solid ${THEME.hairline};padding-top:14px;">
              <div style="font-family:${DISPLAY};font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:${THEME.subtle};">${escapeHtml(item.category)}</div>
              <a href="${url}" style="display:block;margin:3px 0 0;font-family:${DISPLAY};font-weight:600;font-size:16px;line-height:1.3;color:${THEME.ink};text-decoration:none;">${escapeHtml(item.title)}</a>
              ${summary}
            </div>
          </td></tr>`;
    })
    .join("");

  const inner = `<tr><td style="padding:30px 30px 0;">
            ${eyebrow(`HeyClaude &middot; ${escapeHtml(opts.dateLabel)}`)}
            <h1 style="margin:12px 0 0;font-family:${DISPLAY};font-weight:600;font-size:24px;letter-spacing:-0.02em;line-height:1.1;color:${THEME.ink};">New &amp; <span style="background:${THEME.accent};padding:0 5px;border-radius:2px;">notable</span> this week</h1>
            <p style="margin:10px 0 0;font-family:${BODY};font-size:14px;line-height:1.6;color:${THEME.muted};">Reviewed Claude tools that landed in the directory this week.</p>
          </td></tr>
          ${itemsHtml}
          <tr><td style="padding:20px 30px 4px;">
            <div style="border-top:1px solid ${THEME.hairline};padding-top:18px;">${primaryButton(`${base}/browse`, "Browse all on HeyClaude")}</div>
          </td></tr>
          ${standingCtasHtml(opts.siteUrl)}
          <tr><td style="padding:2px 30px 28px;">
            <p style="margin:8px 0 0;font-family:${BODY};font-size:12px;line-height:1.6;color:${THEME.subtle};"><a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color:${THEME.subtle};">Unsubscribe</a></p>
          </td></tr>`;

  const text = [
    `New on HeyClaude — ${opts.dateLabel}`,
    "",
    ...opts.items.map(
      (item) =>
        `• [${item.category}] ${item.title}\n  ${base}/entry/${item.category}/${item.slug}${item.summary ? `\n  ${item.summary}` : ""}`,
    ),
    "",
    `Browse all: ${base}/browse`,
    "",
    standingCtasText(opts.siteUrl),
    "",
    "Unsubscribe: {{{RESEND_UNSUBSCRIBE_URL}}}",
  ].join("\n");

  return {
    subject,
    html: emailShell({ preheader: `${opts.items.length} new Claude tools worth a look.`, inner }),
    text,
  };
}
