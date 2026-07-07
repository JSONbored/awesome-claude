export const REFERRAL_WINDOW_MS = 60_000;
export const MAX_REFERRALS_PER_WINDOW = 3;
export const MAX_SIGNAL_BUCKETS = 5_000;

type SignalBucket = {
  count: number;
  resetAt: number;
};

const signalBuckets = new Map<string, SignalBucket>();

/** Minimal shape of the Analytics Engine binding (avoids a hard dep on the CF types). */
export interface AnalyticsEngineDataset {
  writeDataPoint(event: {
    blobs?: (string | null)[];
    doubles?: number[];
    indexes?: string[];
  }): void;
}

type CfRequest = Request & {
  cf?: {
    botManagement?: { verifiedBot?: boolean };
    verifiedBotCategory?: string;
  };
};

export function getDataset(env: unknown): AnalyticsEngineDataset | null {
  const dataset = (env as Record<string, unknown> | null | undefined)?.AI_SIGNALS;
  return dataset && typeof (dataset as AnalyticsEngineDataset).writeDataPoint === "function"
    ? (dataset as AnalyticsEngineDataset)
    : null;
}

export function normalizePath(url: string): string {
  try {
    return new URL(url).pathname.slice(0, 256);
  } catch {
    return "/";
  }
}

export function isVerifiedCloudflareBot(request: Request): boolean {
  const cf = (request as CfRequest).cf;
  return cf?.botManagement?.verifiedBot === true || Boolean(cf?.verifiedBotCategory);
}

export function isPageLikeRequest(request: Request): boolean {
  if (request.method !== "GET") return false;

  const path = normalizePath(request.url);
  if (path.startsWith("/api/") || path === "/api") return false;
  if (path.startsWith("/assets/") || path.startsWith("/downloads/")) return false;
  if (path.includes(".")) return false;

  return true;
}

export function getClientKey(request: Request): string {
  return request.headers.get("cf-connecting-ip") || "unknown";
}

export function pruneExpiredSignalBuckets(now: number) {
  for (const [key, bucket] of signalBuckets) {
    if (bucket.resetAt <= now) signalBuckets.delete(key);
  }
}

export function evictOldestSignalBuckets() {
  while (signalBuckets.size >= MAX_SIGNAL_BUCKETS) {
    const key = signalBuckets.keys().next().value;
    if (key === undefined) break;
    signalBuckets.delete(key);
  }
}

export function consumeReferralQuota(request: Request, source: string): boolean {
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
