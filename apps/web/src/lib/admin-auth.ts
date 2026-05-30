import { getCloudflareEnv, getEnvString } from "@/lib/cloudflare-env.server";

const ADMIN_TOKEN_NAMES = [
  "ADMIN_API_TOKEN",
  "JOBS_ADMIN_API_TOKEN",
  "LEADS_ADMIN_TOKEN",
  "ADMIN_LEADS_TOKEN",
] as const;

export function getAdminToken() {
  return getEnvString(...ADMIN_TOKEN_NAMES);
}

export function getAdminTokens() {
  const env = getCloudflareEnv();
  const tokens = new Set<string>();
  for (const name of ADMIN_TOKEN_NAMES) {
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

export function isAdminAuthorized(request: Request) {
  const tokens = getAdminTokens();
  if (tokens.length === 0) return false;

  const bearer = request.headers
    .get("authorization")
    ?.replace(/^Bearer\s+/i, "")
    .trim();
  const headerToken = request.headers.get("x-admin-token")?.trim();
  return tokens.some((token) => bearer === token || headerToken === token);
}
