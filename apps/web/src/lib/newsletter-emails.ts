// On-brand (light) newsletter emails, built as inline strings (not React Email)
// so they render in the Worker without a runtime React dependency. No tracking
// pixels. Confirm + welcome are transactional; the digest is a Resend broadcast.

import type { DigestItem } from "@/lib/newsletter-digest";

const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildNewsletterConfirmEmail(opts: { confirmUrl: string; siteUrl: string }): {
  subject: string;
  html: string;
  text: string;
} {
  const confirmUrl = escapeHtml(opts.confirmUrl);
  const siteHost = escapeHtml(opts.siteUrl.replace(/^https?:\/\//, "").replace(/\/$/, ""));
  const subject = "Confirm your HeyClaude subscription";

  const html = `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:#f7f5ef;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">Tap the button to confirm your subscription to the HeyClaude weekly brief.</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f5ef;padding:40px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border:1px solid #e7e3d8;border-radius:14px;">
            <tr>
              <td style="padding:32px 32px 8px;">
                <div style="font:600 13px/1.4 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;letter-spacing:1.5px;text-transform:uppercase;color:#6b6a64;">HeyClaude</div>
                <h1 style="margin:14px 0 0;font:700 24px/1.25 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#171614;">Confirm your subscription</h1>
                <p style="margin:14px 0 0;font:400 15px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#4d4c47;">One calm read on Claude workflows. Confirm your email and you're in &mdash; you can unsubscribe any time.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px 8px;">
                <a href="${confirmUrl}" style="display:inline-block;background:#171614;color:#ffffff;text-decoration:none;font:600 15px/1 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;padding:14px 22px;border-radius:10px;">Confirm subscription</a>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 32px 32px;">
                <p style="margin:0;font:400 12px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#8a8980;">If the button doesn't work, paste this link into your browser:<br><a href="${confirmUrl}" style="color:#6b6a64;word-break:break-all;">${confirmUrl}</a></p>
                <p style="margin:16px 0 0;font:400 12px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#8a8980;">Didn't request this? Ignore this email &mdash; nothing was added. &middot; ${siteHost}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text = [
    "Confirm your HeyClaude subscription",
    "",
    "One calm read on Claude workflows. Confirm your email and you're in — unsubscribe any time.",
    "",
    `Confirm: ${opts.confirmUrl}`,
    "",
    "Didn't request this? Ignore this email — nothing was added.",
    siteHost,
  ].join("\n");

  return { subject, html, text };
}

function trimUrl(siteUrl: string): string {
  return siteUrl.replace(/\/$/, "");
}

function siteHostOf(siteUrl: string): string {
  return siteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

function emailShell(opts: { preheader: string; inner: string }): string {
  return `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:#f7f5ef;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(opts.preheader)}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f5ef;padding:40px 16px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border:1px solid #e7e3d8;border-radius:14px;">
          ${opts.inner}
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}

// Standing growth/revenue CTAs (submissions, paid jobs, sponsorship) shown in
// the welcome + digest footers. Deliberately subtle — one quiet line.
function standingCtasHtml(siteUrl: string): string {
  const base = trimUrl(siteUrl);
  const link = (href: string, label: string) =>
    `<a href="${base}${href}" style="color:#4d4c47;text-decoration:underline;">${label}</a>`;
  return `<tr><td style="padding:18px 32px 6px;border-top:1px solid #efece3;">
            <p style="margin:0;font:400 13px/1.7 ${FONT};color:#6b6a64;">${link("/submit", "Built something? Submit it")} &middot; ${link("/jobs/post", "Hiring? Post a role")} &middot; ${link("/advertise", "List or sponsor your tool")}</p>
            <p style="margin:8px 0 0;font:400 12px/1.6 ${FONT};color:#8a8980;">Enjoying this? Forward it to a teammate.</p>
          </td></tr>`;
}

function standingCtasText(siteUrl: string): string {
  const base = trimUrl(siteUrl);
  return [
    "—",
    `Built something? Submit it: ${base}/submit`,
    `Hiring? Post a role: ${base}/jobs/post`,
    `List or sponsor your tool: ${base}/advertise`,
    "Enjoying this? Forward it to a teammate.",
  ].join("\n");
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
  const inner = `<tr><td style="padding:32px 32px 8px;">
            <div style="font:600 13px/1.4 ${FONT};letter-spacing:1.5px;text-transform:uppercase;color:#6b6a64;">HeyClaude</div>
            <h1 style="margin:14px 0 0;font:700 24px/1.25 ${FONT};color:#171614;">You're in.</h1>
            <p style="margin:14px 0 0;font:400 15px/1.6 ${FONT};color:#4d4c47;">Thanks for confirming. Every Sunday you'll get one calm read: the best new Claude Code agents, MCP servers, skills, and workflows reviewed that week. No hype, no tracking pixels.</p>
          </td></tr>
          <tr><td style="padding:18px 32px 4px;">
            <a href="${base}/best" style="display:inline-block;background:#171614;color:#ffffff;text-decoration:none;font:600 15px/1 ${FONT};padding:13px 20px;border-radius:10px;">Start with the best of HeyClaude</a>
          </td></tr>
          <tr><td style="padding:12px 32px 4px;">
            <p style="margin:0;font:400 14px/1.7 ${FONT};color:#4d4c47;">While you wait for Sunday:<br>&bull; <a href="${base}/state-of-claude-tooling" style="color:#171614;">The state of Claude tooling</a><br>&bull; <a href="${base}/browse" style="color:#171614;">Browse the full directory</a></p>
          </td></tr>
          ${standingCtasHtml(opts.siteUrl)}
          <tr><td style="padding:2px 32px 28px;">
            <p style="margin:8px 0 0;font:400 12px/1.6 ${FONT};color:#8a8980;">Manage your subscription at <a href="${base}/subscriptions" style="color:#6b6a64;">${host}/subscriptions</a>.</p>
          </td></tr>`;
  const html = emailShell({ preheader: "Welcome — your weekly Claude brief lands Sundays.", inner });
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
  return { subject, html, text };
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
        ? `<p style="margin:4px 0 0;font:400 14px/1.6 ${FONT};color:#4d4c47;">${escapeHtml(item.summary)}</p>`
        : "";
      return `<tr><td style="padding:14px 32px;border-top:1px solid #efece3;">
            <div style="font:600 11px/1.4 ${FONT};letter-spacing:1px;text-transform:uppercase;color:#8a8980;">${escapeHtml(item.category)}</div>
            <a href="${url}" style="display:block;margin:4px 0 0;font:700 17px/1.35 ${FONT};color:#171614;text-decoration:none;">${escapeHtml(item.title)}</a>
            ${summary}
          </td></tr>`;
    })
    .join("");

  const inner = `<tr><td style="padding:32px 32px 4px;">
            <div style="font:600 13px/1.4 ${FONT};letter-spacing:1.5px;text-transform:uppercase;color:#6b6a64;">HeyClaude &middot; ${escapeHtml(opts.dateLabel)}</div>
            <h1 style="margin:12px 0 0;font:700 23px/1.25 ${FONT};color:#171614;">New &amp; notable this week</h1>
            <p style="margin:10px 0 0;font:400 14px/1.6 ${FONT};color:#4d4c47;">Reviewed Claude tools that landed in the directory this week.</p>
          </td></tr>
          ${itemsHtml}
          <tr><td style="padding:20px 32px 4px;border-top:1px solid #efece3;">
            <a href="${base}/browse" style="display:inline-block;background:#171614;color:#ffffff;text-decoration:none;font:600 15px/1 ${FONT};padding:13px 20px;border-radius:10px;">Browse all on HeyClaude</a>
          </td></tr>
          ${standingCtasHtml(opts.siteUrl)}
          <tr><td style="padding:2px 32px 28px;">
            <p style="margin:8px 0 0;font:400 12px/1.6 ${FONT};color:#8a8980;"><a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color:#8a8980;">Unsubscribe</a></p>
          </td></tr>`;
  const html = emailShell({
    preheader: `${opts.items.length} new Claude tools worth a look.`,
    inner,
  });

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

  return { subject, html, text };
}
