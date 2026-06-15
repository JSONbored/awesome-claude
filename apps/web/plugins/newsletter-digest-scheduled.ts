import { definePlugin } from "nitro";

import { buildWeeklyBrief } from "@heyclaude/registry/weekly-brief";
import { getEnvString, runWithCloudflareRuntime } from "@/lib/cloudflare-env.server";
import { getDirectoryEntries } from "@/lib/content.server";
import {
  upsertBriefDraft,
  getLatestDraft,
  getDueApprovedBriefs,
  markBriefSent,
} from "@/lib/brief-issues.server";
import { signBriefApproveToken } from "@/lib/brief-token.server";
import { buildBriefEmail } from "@/lib/brief-email";
import { selectDigestEntries, type DigestCandidate } from "@/lib/newsletter-digest";
import { buildDigestEmail } from "@/lib/newsletter-emails";
import {
  recordUmamiEvent,
  sendResendBroadcast,
  sendResendEmail,
} from "@/lib/newsletter-send.server";
import { siteConfig } from "@/lib/site";

// Sundays 16:00 UTC. Must match the string in wrangler.jsonc triggers.crons
// exactly (Cloudflare passes it through as controller.cron). NB: Cloudflare's
// day-of-week is 1=Sunday..7=Saturday, so Sunday is SUN, not 0.
const WEEKLY_CRON = "0 16 * * SUN";

// Fridays 14:00 UTC. Generates the next Weekly Brief draft + emails the
// maintainer a preview with an approve link.
const GENERATE_CRON = "0 14 * * FRI";

// 6-hourly (the existing source-signals trigger). We piggyback to send any
// approved brief whose scheduled send time has arrived — no new cron needed.
const SEND_CRON = "17 */6 * * *";

const APPROVE_TOKEN_TTL_MS = 14 * 24 * 60 * 60 * 1000; // 14 days

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
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
      // Friday: generate + persist the next brief draft for maintainer review.
      if (controller?.cron === GENERATE_CRON) {
        const generateRequest = new Request("https://heyclau.de/__scheduled/brief-generate");
        await runWithCloudflareRuntime(generateRequest, env, context, async () => {
          try {
            const generatedAt = new Date().toISOString();
            const entries = await getDirectoryEntries();
            const brief = buildWeeklyBrief(entries as Parameters<typeof buildWeeklyBrief>[0], {
              generatedAt,
              days: 7,
              siteUrl: siteConfig.url,
            });
            const periodThrough = brief.period?.through ?? generatedAt.slice(0, 10);
            const wrote = await upsertBriefDraft({
              slug: `weekly-brief-${periodThrough}`,
              periodThrough,
              payload: brief,
              generatedAt,
            });
            console.log(
              wrote
                ? "[brief-generate] draft persisted"
                : "[brief-generate] draft skipped (already exists or D1 unavailable)",
              { periodThrough, newEntries: brief.summary?.newEntryCount },
            );

            // Email the maintainer a preview + signed approve link. Inert unless
            // the review address, signing secret, and Resend send creds exist.
            const reviewEmail = getEnvString("BRIEF_REVIEW_EMAIL");
            const secret = getEnvString("NEWSLETTER_CONFIRM_SECRET");
            const apiKey = getEnvString("RESEND_API_KEY");
            const from = getEnvString("RESEND_FROM");
            const draft = await getLatestDraft();
            if (wrote && draft && reviewEmail && secret && apiKey && from) {
              const token = await signBriefApproveToken(secret, {
                n: draft.number,
                p: draft.period_through,
                exp: Date.now() + APPROVE_TOKEN_TTL_MS,
              });
              const approveUrl = `${siteConfig.url}/brief/approve?token=${encodeURIComponent(token)}`;
              const { subject, html, text } = buildBriefEmail({
                brief: draft.payload,
                siteUrl: siteConfig.url,
                dateLabel: periodThrough,
                approveUrl,
              });
              await sendResendEmail({ apiKey, from, to: reviewEmail, subject, html, text });
              console.log("[brief-generate] preview sent", { number: draft.number });
            }
          } catch (error) {
            console.error("[brief-generate] generation failed", error);
          }
        });
        return;
      }

      // 6-hourly: send any approved brief whose scheduled time has arrived.
      if (controller?.cron === SEND_CRON) {
        const sendRequest = new Request("https://heyclau.de/__scheduled/brief-send");
        await runWithCloudflareRuntime(sendRequest, env, context, async () => {
          try {
            const apiKey = getEnvString("RESEND_API_KEY");
            const segmentId = getEnvString("RESEND_SEGMENT_ID");
            const from = getEnvString("RESEND_FROM");
            if (!apiKey || !segmentId || !from) return;
            const due = await getDueApprovedBriefs(new Date().toISOString());
            for (const issue of due) {
              const { subject, html, text } = buildBriefEmail({
                brief: issue.payload,
                siteUrl: siteConfig.url,
                dateLabel: issue.period_through,
              });
              const result = await sendResendBroadcast({
                apiKey,
                segmentId,
                from,
                subject,
                html,
                text,
                name: `Weekly Brief #${issue.number} — ${issue.period_through}`,
              });
              if (result.ok) {
                await markBriefSent(issue.number);
                console.log("[brief-send] sent", { number: issue.number });
                await recordUmamiEvent("brief-sent", { number: issue.number });
              } else {
                console.error("[brief-send] send failed", {
                  number: issue.number,
                  status: result.status,
                });
              }
            }
          } catch (error) {
            console.error("[brief-send] scheduled send failed", error);
          }
        });
        return;
      }

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
