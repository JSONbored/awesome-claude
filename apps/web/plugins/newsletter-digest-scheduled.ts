import { definePlugin } from "nitro";

import { getEnvString, runWithCloudflareRuntime } from "@/lib/cloudflare-env.server";
import { getDirectoryEntries } from "@/lib/content.server";
import { selectDigestEntries, type DigestCandidate } from "@/lib/newsletter-digest";
import { buildDigestEmail } from "@/lib/newsletter-emails";
import { recordUmamiEvent, sendResendBroadcast } from "@/lib/newsletter-send.server";
import { siteConfig } from "@/lib/site";

// Sundays 16:00 UTC. Must match the string in wrangler.jsonc triggers.crons
// exactly (Cloudflare passes it through as controller.cron). NB: Cloudflare's
// day-of-week is 1=Sunday..7=Saturday, so Sunday is SUN, not 0.
const WEEKLY_CRON = "0 16 * * SUN";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

type CloudflareScheduledPayload = {
  controller?: { cron?: string };
  env: unknown;
  context: unknown;
};

function formatDateLabel(ms: number): string {
  const date = new Date(ms);
  return `${MONTHS[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;
}

/**
 * Weekly "new & notable" newsletter digest. Fully automated: picks entries
 * added in the last 7 days, skips thin weeks (<5), and sends a Resend broadcast
 * to the audience. Inert until RESEND_* secrets are configured. The cron hook
 * fires for every trigger, so we gate on the weekly cron string.
 */
export default definePlugin((nitroApp) => {
  nitroApp.hooks?.hook(
    "cloudflare:scheduled",
    async ({ controller, env, context }: CloudflareScheduledPayload) => {
      if (controller?.cron !== WEEKLY_CRON) return;

      const request = new Request("https://heyclau.de/__scheduled/newsletter-digest");
      await runWithCloudflareRuntime(request, env, context, async () => {
        try {
          const apiKey = getEnvString("RESEND_API_KEY");
          const segmentId = getEnvString("RESEND_SEGMENT_ID");
          const from = getEnvString("RESEND_FROM");
          if (!apiKey || !segmentId || !from) {
            console.log("[newsletter-digest] skipped: not configured");
            return;
          }

          const now = Date.now();
          const entries = (await getDirectoryEntries()) as readonly DigestCandidate[];
          const items = selectDigestEntries(entries, now, { windowDays: 7, min: 5, max: 6 });
          if (!items) {
            console.log("[newsletter-digest] skipped: not enough new entries this week");
            return;
          }

          const dateLabel = formatDateLabel(now);
          const { subject, html, text } = buildDigestEmail({
            siteUrl: siteConfig.url,
            items,
            dateLabel,
          });
          const result = await sendResendBroadcast({
            apiKey,
            segmentId,
            from,
            subject,
            html,
            text,
            name: `Weekly digest — ${dateLabel}`,
          });
          console.log("[newsletter-digest] broadcast sent", {
            ok: result.ok,
            status: result.status,
            count: items.length,
          });
          await recordUmamiEvent("newsletter-digest-sent", {
            count: items.length,
            ok: result.ok,
          });
        } catch (error) {
          console.error("[newsletter-digest] scheduled send failed", error);
        }
      });
    },
  );
});
