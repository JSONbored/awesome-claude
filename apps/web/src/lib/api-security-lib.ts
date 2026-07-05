/**
 * Pure API request security helpers.
 *
 * Client IP extraction, origin allow-listing, bounded body reads, JSON content
 * type checks, and the in-memory fallback rate limiter. Nothing here touches
 * route handlers — given the same request fields the output is deterministic.
 *
 * The public surface (`api-security.ts` / `@/lib/api-security`) re-exports
 * everything below so existing imports stay unchanged.
 */

type RateBucket = {
  count: number;
  resetAt: number;
};

// The Cloudflare rate-limit binding is the primary protection. This in-memory
// map is only the fallback used in development, preview, and binding-miss
// paths. It must not grow without bound when many unique client keys appear,
// so expired buckets are pruned opportunistically and a conservative cap with
// oldest-first eviction guards against pathological key churn.
const MAX_RATE_BUCKETS = 10_000;

const rateBuckets = new Map<string, RateBucket>();

/**
 * Drop every fallback bucket whose window has already elapsed as of `now`.
 *
 * Runs opportunistically when a fresh or expired key is inserted so keys that
 * never return cannot accumulate for the lifetime of the process.
 *
 * @param now - Current time in epoch milliseconds (typically `Date.now()`).
 */
function pruneExpiredRateBuckets(now: number) {
  for (const [key, bucket] of rateBuckets) {
    if (bucket.resetAt <= now) {
      rateBuckets.delete(key);
    }
  }
}

/**
 * Enforce the {@link MAX_RATE_BUCKETS} cap by removing the oldest buckets until
 * there is room for one more insertion.
 *
 * `Map` iteration is insertion-ordered, so the leading entries are the oldest
 * and are evicted first. This bounds memory under pathological key churn even
 * when buckets have not yet expired.
 */
function evictOldestRateBuckets() {
  while (rateBuckets.size >= MAX_RATE_BUCKETS) {
    const oldestKey = rateBuckets.keys().next().value;
    if (oldestKey === undefined) break;
    rateBuckets.delete(oldestKey);
  }
}

/**
 * Test-only helpers for the in-memory fallback rate limiter. These are not part
 * of the production request path and exist so deterministic tests can reset and
 * inspect bucket state without widening the public API surface.
 */
export const __rateLimitTestHooks = {
  reset() {
    rateBuckets.clear();
  },
  size() {
    return rateBuckets.size;
  },
  maxBuckets: MAX_RATE_BUCKETS,
};

const ALLOWED_ORIGIN_PATTERNS = [
  /^https:\/\/heyclau\.de$/i,
  /^https:\/\/dev\.heyclau\.de$/i,
  /^https:\/\/[a-z0-9-]+\.zeronode\.workers\.dev$/i,
  /^http:\/\/localhost:\d+$/i,
  /^http:\/\/127\.0\.0\.1:\d+$/i,
];

export function getClientIp(request: Request) {
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

export function isAllowedOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  return ALLOWED_ORIGIN_PATTERNS.some((pattern) => pattern.test(origin));
}

export class BodyTooLargeError extends Error {
  constructor() {
    super("Request body exceeded configured byte limit");
    this.name = "BodyTooLargeError";
  }
}

function parseContentLength(request: Request) {
  const header = request.headers.get("content-length");
  if (!header) return null;
  const parsed = Number(header);
  if (!Number.isFinite(parsed) || parsed < 0) return Number.POSITIVE_INFINITY;
  return parsed;
}

export async function readRequestTextWithinLimit(request: Request, maxBytes: number) {
  const declaredLength = parseContentLength(request);
  if (declaredLength !== null && declaredLength > maxBytes) {
    throw new BodyTooLargeError();
  }

  if (!request.body) return "";

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let receivedBytes = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    receivedBytes += value.byteLength;
    if (receivedBytes > maxBytes) {
      await reader.cancel();
      throw new BodyTooLargeError();
    }
    chunks.push(value);
  }

  const buffer = new Uint8Array(receivedBytes);
  let offset = 0;
  for (const chunk of chunks) {
    buffer.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return new TextDecoder().decode(buffer);
}

export function hasJsonContentType(request: Request) {
  const header = request.headers.get("content-type");
  if (!header) return false;
  return header.toLowerCase().startsWith("application/json");
}

/**
 * In-memory fallback rate-limit check used when the Cloudflare rate-limit
 * binding is unavailable (development, preview, and binding-miss/failure paths).
 *
 * Counts requests per `scope`/client-IP bucket within a sliding `windowMs`.
 * On each fresh or expired bucket it prunes aged-out buckets and enforces the
 * {@link MAX_RATE_BUCKETS} cap so the backing map cannot grow unbounded.
 *
 * @param params.request - Incoming request; the client IP forms part of the key.
 * @param params.scope - Logical bucket namespace (for example a route name).
 * @param params.limit - Maximum allowed requests within the window.
 * @param params.windowMs - Window length in milliseconds.
 * @returns `true` when the request should be blocked, `false` otherwise.
 */
export function isRateLimited(params: {
  request: Request;
  scope: string;
  limit: number;
  windowMs: number;
}) {
  const { request, scope, limit, windowMs } = params;
  const now = Date.now();
  const bucketKey = `${scope}:${getClientIp(request)}`;
  const current = rateBuckets.get(bucketKey);

  if (!current || current.resetAt <= now) {
    // A fresh or expired key means we are about to grow (or refresh) the map.
    // Reclaim everything that has aged out, then enforce the hard cap before
    // inserting so old keys that never return cannot accumulate forever.
    pruneExpiredRateBuckets(now);
    rateBuckets.delete(bucketKey);
    evictOldestRateBuckets();
    rateBuckets.set(bucketKey, { count: 1, resetAt: now + windowMs });
    return false;
  }

  if (current.count >= limit) return true;

  current.count += 1;
  rateBuckets.set(bucketKey, current);
  return false;
}
