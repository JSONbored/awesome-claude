import { createApiFileRoute } from "@/lib/api/file-route";

import { getEnvString } from "@/lib/cloudflare-env.server";
import { verifyConfirmToken } from "@/lib/newsletter-token.server";
import { addNewsletterContact } from "@/routes/api/newsletter/subscribe";
import { buildWelcomeEmail } from "@/lib/newsletter-emails";
import { sendResendEmail } from "@/lib/newsletter-send.server";
import { siteConfig } from "@/lib/site";

// Minimal, on-brand confirmation landing page (light theme, matches the site).
function resultPage(opts: { ok: boolean; heading: string; body: string }): Response {
  const accent = opts.ok ? "#2f8f5b" : "#b4541f";
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex" />
    <title>${opts.heading} — HeyClaude</title>
  </head>
  <body style="margin:0;background:#f7f5ef;font:400 16px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#171614;">
    <main style="max-width:480px;margin:0 auto;padding:80px 20px;text-align:center;">
      <div style="font:600 13px/1.4 sans-serif;letter-spacing:1.5px;text-transform:uppercase;color:#6b6a64;">HeyClaude</div>
      <div style="margin-top:20px;font-size:40px;color:${accent};">${opts.ok ? "✓" : "—"}</div>
      <h1 style="margin:12px 0 0;font-size:26px;font-weight:700;">${opts.heading}</h1>
      <p style="margin:14px 0 0;color:#4d4c47;">${opts.body}</p>
      <a href="${siteConfig.url}/browse" style="display:inline-block;margin-top:28px;background:#171614;color:#fff;text-decoration:none;font-weight:600;padding:12px 20px;border-radius:10px;">Browse the directory</a>
    </main>
  </body>
</html>`;
  return new Response(html, {
    status: opts.ok ? 200 : 400,
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" },
  });
}

export const Route = createApiFileRoute("/api/public/newsletter/confirm")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const token = new URL(request.url).searchParams.get("token") ?? "";
        const confirmSecret = getEnvString("NEWSLETTER_CONFIRM_SECRET");
        const resendApiKey = getEnvString("RESEND_API_KEY");
        const resendSegmentId = getEnvString("RESEND_SEGMENT_ID");

        if (!confirmSecret || !resendApiKey || !resendSegmentId) {
          return resultPage({
            ok: false,
            heading: "Not available",
            body: "Newsletter confirmation isn't configured right now.",
          });
        }

        const payload = await verifyConfirmToken(confirmSecret, token, Date.now());
        if (!payload) {
          return resultPage({
            ok: false,
            heading: "Link expired",
            body: "This confirmation link is invalid or has expired. Please subscribe again.",
          });
        }

        const result = await addNewsletterContact({
          email: payload.email,
          segments: payload.segments,
          source: payload.source,
          resendApiKey,
          resendSegmentId,
        });
        if (result === "error") {
          return resultPage({
            ok: false,
            heading: "Something went wrong",
            body: "We couldn't confirm your subscription just now. Please try again shortly.",
          });
        }

        // Send the welcome email on first-time confirm (best-effort; never block
        // or fail the confirmation on a welcome-send hiccup). Skip duplicates.
        if (result === "ok") {
          const from = getEnvString("RESEND_FROM");
          if (from) {
            const welcome = buildWelcomeEmail({ siteUrl: siteConfig.url });
            await sendResendEmail({
              apiKey: resendApiKey,
              from,
              to: payload.email,
              subject: welcome.subject,
              html: welcome.html,
              text: welcome.text,
            }).catch(() => false);
          }
        }

        return resultPage({
          ok: true,
          heading: "You're subscribed",
          body: "Thanks for confirming. The weekly brief lands on Sundays — unsubscribe any time.",
        });
      },
    },
  },
});
