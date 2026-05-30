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

function hasAdminToken(request: Request, tokens: readonly string[]) {
  if (tokens.length === 0) return false;

  const bearer = request.headers
    .get("authorization")
    ?.replace(/^Bearer\s+/i, "")
    .trim();
  const headerToken = request.headers.get("x-admin-token")?.trim();
  return tokens.some((token) => bearer === token || headerToken === token);
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
