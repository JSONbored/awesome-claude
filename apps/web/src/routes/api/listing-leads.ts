import { createApiFileRoute } from "@/lib/api/file-route";

import { validateListingLeadPayload } from "@heyclaude/registry/commercial";

import { listingLeadBodySchema } from "@/lib/api/contracts";
import { apiError, apiJson, createApiHandler, type InferApiBody } from "@/lib/api/router";
import { logApiError, logApiInfo, logApiWarn, redactEmail } from "@/lib/api-logs";
import { getSiteDb } from "@/lib/db";
import { getEnvString } from "@/lib/cloudflare-env.server";
import { buildListingLeadAckEmail } from "@/lib/newsletter-emails";
import { sendResendEmail } from "@/lib/newsletter-send.server";
import { escapeDiscordMarkdown, sendDiscordMessage } from "@/lib/notify.server";
import { siteConfig } from "@/lib/site";

const DEFAULT_FROM = "HeyClaude <newsletter@heyclau.de>";

export const POST = createApiHandler(
  "listingLeads.create",
  async ({ request, body, requestId }) => {
    const payload = body as InferApiBody<typeof listingLeadBodySchema>;
    const report = validateListingLeadPayload(payload);
    if (!report.ok) {
      logApiWarn(request, "listing_leads.invalid_payload", {
        errors: report.errors,
      });
      return apiError("invalid_payload", 400, {
        requestId,
        details: { errors: report.errors },
      });
    }

    const db = getSiteDb();
    if (!db) {
      logApiError(request, "listing_leads.db_not_configured");
      return apiError("site_db_not_configured", 503, { requestId });
    }

    const data = report.data;
    const payloadJson = JSON.stringify({
      websiteUrl: data.websiteUrl,
      applyUrl: data.applyUrl,
      message: data.message,
    });

    try {
      await db
        .prepare(
          `INSERT INTO listing_leads (
          kind,
          status,
          tier_interest,
          contact_name,
          contact_email,
          company_name,
          listing_title,
          website_url,
          apply_url,
          message,
          payload_json,
          created_at,
          updated_at
        ) VALUES (?, 'new', ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        )
        .bind(
          data.kind,
          data.tierInterest,
          data.contactName,
          data.contactEmail,
          data.companyName,
          data.listingTitle,
          data.websiteUrl,
          data.applyUrl,
          data.message,
          payloadJson,
        )
        .run();

      logApiInfo(request, "listing_leads.created", {
        kind: data.kind,
        tier: data.tierInterest,
        email: redactEmail(data.contactEmail),
      });

      // Best-effort notifications: the lead is already stored, so neither the
      // acknowledgment email nor the maintainer ping can fail the request. Run
      // them concurrently to keep the form response snappy.
      const resendApiKey = getEnvString("RESEND_API_KEY");
      const discordWebhookUrl = getEnvString("DISCORD_WEBHOOK_URL");
      const notifications: Promise<unknown>[] = [];

      if (resendApiKey) {
        const ack = buildListingLeadAckEmail({
          siteUrl: siteConfig.url,
          contactName: data.contactName,
          listingTitle: data.listingTitle,
          kind: data.kind,
        });
        notifications.push(
          sendResendEmail({
            apiKey: resendApiKey,
            from: getEnvString("RESEND_FROM") || DEFAULT_FROM,
            to: data.contactEmail,
            subject: ack.subject,
            html: ack.html,
            text: ack.text,
          }),
        );
      }

      if (discordWebhookUrl) {
        const tier = data.tierInterest ? ` (${data.tierInterest})` : "";
        const listingTitle = escapeDiscordMarkdown(data.listingTitle);
        const companyName = escapeDiscordMarkdown(data.companyName);
        const contactEmail = escapeDiscordMarkdown(data.contactEmail);
        notifications.push(
          sendDiscordMessage(
            discordWebhookUrl,
            `New ${data.kind} lead${tier}: **${listingTitle}** — ${companyName} <${contactEmail}>`,
          ),
        );
      }

      if (notifications.length) await Promise.allSettled(notifications);

      return apiJson({ ok: true }, { headers: { "cache-control": "no-store" } });
    } catch {
      logApiError(request, "listing_leads.insert_failed", {
        kind: data.kind,
        email: redactEmail(data.contactEmail),
      });
      return apiError("internal_error", 500, { requestId });
    }
  },
);

export const Route = createApiFileRoute("/api/listing-leads")({
  server: {
    handlers: {
      POST: async ({ request, params }) => POST(request, { params }),
    },
  },
});
