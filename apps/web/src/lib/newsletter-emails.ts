// Minimal, on-brand confirmation email for double opt-in. Built as an inline
// string (not React Email) so it renders in the Worker without a runtime React
// dependency. Light theme to match heyclau.de; no tracking pixel.

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
