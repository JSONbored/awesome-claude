// Server-side AI-citation signal tap. Runs in the Worker `fetch` handler and writes
// two kinds of data points to a Cloudflare Workers Analytics Engine dataset:
//
//   • crawler — an AI bot fetched a page (leading indicator of being citable). The
//     `search`/`user` purposes are the high-signal "answering a live query" hits;
//     `train` is the slower, weaker signal.
//   • referral — a human landed from an AI assistant (server-side backstop for the
//     client-side umami event, so we still capture hits when JS is blocked).
//
// This is best-effort and fire-and-forget: writeDataPoint is synchronous and must
// never throw into the request path, so the whole thing is wrapped in try/catch and
// silently no-ops when the binding is absent (e.g. local dev without the dataset).

import { matchAiBot, matchAiReferrer } from "@/lib/ai-sources";
import {
  __aiSignalsTestHooks,
  consumeReferralQuota,
  getDataset,
  isPageLikeRequest,
  isVerifiedCloudflareBot,
  normalizePath,
} from "@/lib/ai-signals-lib";

export { __aiSignalsTestHooks };

/**
 * Record AI crawler + AI-referral signals for a request. Safe to call on every request;
 * only matched requests write a data point. Never throws.
 */
export function logAiSignals(request: Request, env: unknown): void {
  try {
    const dataset = getDataset(env);
    if (!dataset) return;

    const ua = request.headers.get("user-agent");
    const bot = isVerifiedCloudflareBot(request) ? matchAiBot(ua) : null;
    if (bot) {
      dataset.writeDataPoint({
        blobs: ["crawler", bot.operator, bot.token, bot.purpose, normalizePath(request.url)],
        doubles: [1],
        indexes: [bot.operator],
      });
      return;
    }

    if (!isPageLikeRequest(request)) return;

    const source = matchAiReferrer(request.headers.get("referer"));
    if (source && consumeReferralQuota(request, source)) {
      dataset.writeDataPoint({
        blobs: ["referral", source, normalizePath(request.url)],
        doubles: [1],
        indexes: ["referral"],
      });
    }
  } catch {
    // Measurement must never break a response.
  }
}
