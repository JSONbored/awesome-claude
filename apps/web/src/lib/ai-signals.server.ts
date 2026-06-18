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

type CfRequest = Request & {
  cf?: {
    botManagement?: { verifiedBot?: boolean };
    verifiedBotCategory?: string;
  };
};

type SignalBucket = {
  count: number;
  resetAt: number;
};

const REFERRAL_WINDOW_MS = 60_000;
const MAX_REFERRALS_PER_WINDOW = 3;
const MAX_SIGNAL_BUCKETS = 5_000;
const signalBuckets = new Map<string, SignalBucket>();

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

function isVerifiedCloudflareBot(request: Request): boolean {
  const cf = (request as CfRequest).cf;
  return cf?.botManagement?.verifiedBot === true || Boolean(cf?.verifiedBotCategory);
}

function isPageLikeRequest(request: Request): boolean {
  if (request.method !== "GET") return false;

  const path = normalizePath(request.url);
  if (path.startsWith("/api/") || path === "/api") return false;
  if (path.startsWith("/assets/") || path.startsWith("/downloads/")) return false;
  if (path.includes(".")) return false;

  return true;
}

function getClientKey(request: Request): string {
  return request.headers.get("cf-connecting-ip") || "unknown";
}

function pruneExpiredSignalBuckets(now: number) {
  for (const [key, bucket] of signalBuckets) {
    if (bucket.resetAt <= now) signalBuckets.delete(key);
  }
}

function evictOldestSignalBuckets() {
  // Map insertion order gives us a deterministic oldest-bucket eviction policy.
  while (signalBuckets.size >= MAX_SIGNAL_BUCKETS) {
    const key = signalBuckets.keys().next().value;
    if (key === undefined) break;
    signalBuckets.delete(key);
  }
}

function consumeReferralQuota(request: Request, source: string): boolean {
  const now = Date.now();
  const key = `${source}:${getClientKey(request)}:${normalizePath(request.url)}`;
  const existing = signalBuckets.get(key);
  if (existing && existing.resetAt > now) {
    if (existing.count >= MAX_REFERRALS_PER_WINDOW) return false;
    existing.count += 1;
    return true;
  }

  pruneExpiredSignalBuckets(now);
  evictOldestSignalBuckets();
  signalBuckets.set(key, { count: 1, resetAt: now + REFERRAL_WINDOW_MS });
  return true;
}

export const __aiSignalsTestHooks = {
  reset() {
    signalBuckets.clear();
  },
};

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
      return; // a crawler is never also a human referral
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
