import { definePlugin } from "nitro";

import { getEnvString, runWithCloudflareRuntime } from "@/lib/cloudflare-env.server";
import { getDirectoryEntries } from "@/lib/content.server";
import { siteConfig } from "@/lib/site";

// Daily 05:00 UTC. Must match the string in wrangler.jsonc triggers.crons
// exactly (Cloudflare passes it through as controller.cron). The cron hook fires
// for every trigger, so we gate on this exact string.
const DAILY_CRON = "0 5 * * *";

// IndexNow is a push-on-change protocol (Bing, Yandex, Seznam, Naver — Google
// ignores it and uses sitemap lastmod instead). We submit ONLY the URLs that
// changed recently, never the whole sitemap: resubmitting unchanged URLs gives
// no benefit and reads as spam. The key file is served from the site root.
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
const INDEXNOW_KEY = "48486ebc7ddc47af875118345161ae70";
const WINDOW_MS = 48 * 60 * 60 * 1000; // entries added/updated in the last 48h
const MAX_URLS = 1000; // IndexNow per-request cap

type CloudflareScheduledPayload = {
  controller?: { cron?: string };
  env: unknown;
  context: unknown;
};

/** Hostname of a URL, or null if it can't be parsed. */
function urlHost(value: string): string | null {
  try {
    return new URL(value).host;
  } catch {
    return null;
  }
}

/**
 * Daily IndexNow submission of recently changed entry URLs. Runs automatically
 * on the production host only (dev/preview never submit). Set INDEXNOW_DISABLED=1
 * to turn it off without a deploy. Best-effort — failures never throw.
 */
export default definePlugin((nitroApp) => {
  nitroApp.hooks?.hook(
    "cloudflare:scheduled",
    async ({ controller, env, context }: CloudflareScheduledPayload) => {
      if (controller?.cron !== DAILY_CRON) return;

      const request = new Request("https://heyclau.de/__scheduled/indexnow");
      await runWithCloudflareRuntime(request, env, context, async () => {
        try {
          const siteUrl = siteConfig.url.replace(/\/$/, "");
          const host = new URL(siteUrl).host;

          // IndexNow only makes sense for the live production host.
          if (host !== "heyclau.de") {
            console.log("[indexnow] skipped: non-production host", host);
            return;
          }
          if (getEnvString("INDEXNOW_DISABLED") === "1") {
            console.log("[indexnow] skipped: disabled via INDEXNOW_DISABLED");
            return;
          }

          const now = Date.now();
          const cutoff = now - WINDOW_MS;
          const entries = await getDirectoryEntries();

          const seen = new Set<string>();
          const urls: string[] = [];
          for (const entry of entries) {
            const stampSource = entry.contentUpdatedAt ?? entry.dateAdded ?? "";
            const stamp = Date.parse(stampSource);
            if (!Number.isFinite(stamp) || stamp < cutoff || stamp > now) continue;

            // IndexNow rejects a batch if any URL's host differs from the
            // submitted `host`, so only trust canonicalUrl when it's HTTPS AND
            // same-host; otherwise build a safe same-host URL.
            const canonical = entry.canonicalUrl ?? "";
            const canonicalHost = canonical.startsWith("https://") ? urlHost(canonical) : null;
            const url =
              canonicalHost === host
                ? canonical
                : `${siteUrl}/entry/${entry.category}/${entry.slug}`;
            if (seen.has(url)) continue;
            seen.add(url);
            urls.push(url);
          }

          if (!urls.length) {
            console.log("[indexnow] skipped: no URLs changed in the last 48h");
            return;
          }

          const batch = urls.slice(0, MAX_URLS);
          const response = await fetch(INDEXNOW_ENDPOINT, {
            method: "POST",
            headers: { "content-type": "application/json; charset=utf-8" },
            body: JSON.stringify({
              host,
              key: INDEXNOW_KEY,
              keyLocation: `${siteUrl}/${INDEXNOW_KEY}.txt`,
              urlList: batch,
            }),
            signal: AbortSignal.timeout(10_000),
          });

          console.log(
            `[indexnow] submitted ${batch.length} changed url(s)${
              urls.length > batch.length ? ` (capped from ${urls.length})` : ""
            } → HTTP ${response.status}`,
          );
        } catch (error) {
          console.error("[indexnow] submission failed", error);
        }
      });
    },
  );
});
