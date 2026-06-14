import { getCloudflareEnv, getEnvString } from "@/lib/cloudflare-env.server";

const PRIMARY_ADMIN_TOKEN_NAMES = ["ADMIN_API_TOKEN"] as const;
const JOBS_ADMIN_TOKEN_NAMES = ["JOBS_ADMIN_API_TOKEN"] as const;
const LEADS_ADMIN_TOKEN_NAMES = ["LEADS_ADMIN_TOKEN", "ADMIN_LEADS_TOKEN"] as const;

type AdminTokenName =
  | (typeof PRIMARY_ADMIN_TOKEN_NAMES)[number]
  | (typeof JOBS_ADMIN_TOKEN_NAMES)[number]
  | (typeof LEADS_ADMIN_TOKEN_NAMES)[number];

export function getAdminToken() {
  return getEnvString(...PRIMARY_ADMIN_TOKEN_NAMES);
}

function getScopedAdminTokens(tokenNames: readonly AdminTokenName[]) {
  const env = getCloudflareEnv();
  const tokens = new Set<string>();
  for (const name of tokenNames) {
    const runtimeValue = env[name];
    if (typeof runtimeValue === "string" && runtimeValue.trim()) {
      tokens.add(runtimeValue.trim());
    }
    const processValue = process.env[name];
    if (typeof processValue === "string" && processValue.trim()) {
      tokens.add(processValue.trim());
    }
  }
  return [...tokens];
}

export function getAdminTokens() {
  return getScopedAdminTokens(PRIMARY_ADMIN_TOKEN_NAMES);
}

// Constant-time string compare so admin-token checks don't leak via early-exit timing
// (consistent with the timing-safe comparisons used elsewhere in the codebase).
function timingSafeEqual(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const aBytes = enc.encode(a);
  const bBytes = enc.encode(b);
  const len = Math.max(aBytes.length, bBytes.length);
  let mismatch = aBytes.length ^ bBytes.length;
  for (let i = 0; i < len; i++) mismatch |= (aBytes[i] ?? 0) ^ (bBytes[i] ?? 0);
  return mismatch === 0;
}

function hasAdminToken(request: Request, tokens: readonly string[]) {
  if (tokens.length === 0) return false;

  const bearer = request.headers
    .get("authorization")
    ?.replace(/^Bearer\s+/i, "")
    .trim();
  const headerToken = request.headers.get("x-admin-token")?.trim();
  return tokens.some(
    (token) =>
      (bearer !== undefined && timingSafeEqual(bearer, token)) ||
      (headerToken !== undefined && timingSafeEqual(headerToken, token)),
  );
}

export function isAdminAuthorized(request: Request) {
  return hasAdminToken(request, getAdminTokens());
}

export function isJobsAdminAuthorized(request: Request) {
  return hasAdminToken(
    request,
    getScopedAdminTokens([...PRIMARY_ADMIN_TOKEN_NAMES, ...JOBS_ADMIN_TOKEN_NAMES]),
  );
}

export function isLeadsAdminAuthorized(request: Request) {
  return hasAdminToken(
    request,
    getScopedAdminTokens([...PRIMARY_ADMIN_TOKEN_NAMES, ...LEADS_ADMIN_TOKEN_NAMES]),
  );
}
