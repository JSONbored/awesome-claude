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
//
// Query the dataset via the Analytics Engine SQL API, e.g. crawler activity this week:
//   SELECT blob2 AS operator, blob3 AS bot, blob4 AS purpose,
//          SUM(_sample_interval * double1) AS hits
//   FROM ai_signals
//   WHERE blob1 = 'crawler' AND timestamp > NOW() - INTERVAL '7' DAY
//   GROUP BY operator, bot, purpose ORDER BY hits DESC

import { matchAiBot, matchAiReferrer } from "@/lib/ai-sources";

/** Minimal shape of the Analytics Engine binding (avoids a hard dep on the CF types). */
interface AnalyticsEngineDataset {
  writeDataPoint(event: {
    blobs?: (string | null)[];
    doubles?: number[];
    indexes?: string[];
  }): void;
}

function getDataset(env: unknown): AnalyticsEngineDataset | null {
  const dataset = (env as Record<string, unknown> | null | undefined)?.AI_SIGNALS;
  return dataset && typeof (dataset as AnalyticsEngineDataset).writeDataPoint === "function"
    ? (dataset as AnalyticsEngineDataset)
    : null;
}

// AE blobs cap at 5120 bytes each; bound the path so a pathological URL can't bloat a
// data point (and trim the query string, which adds cardinality without value here).
function normalizePath(url: string): string {
  try {
    return new URL(url).pathname.slice(0, 256);
  } catch {
    return "/";
  }
}

/**
 * Record AI crawler + AI-referral signals for a request. Safe to call on every request;
 * only matched requests write a data point. Never throws.
 */
export function logAiSignals(request: Request, env: unknown): void {
  try {
    const dataset = getDataset(env);
    if (!dataset) return;

    const ua = request.headers.get("user-agent");
    const bot = matchAiBot(ua);
    if (bot) {
      dataset.writeDataPoint({
        blobs: ["crawler", bot.operator, bot.token, bot.purpose, normalizePath(request.url)],
        doubles: [1],
        indexes: [bot.operator],
      });
      return; // a crawler is never also a human referral
    }

    const source = matchAiReferrer(request.headers.get("referer"));
    if (source) {
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
