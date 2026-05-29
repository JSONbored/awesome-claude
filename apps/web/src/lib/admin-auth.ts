import { getEnvString } from "@/lib/cloudflare-env";

export function getAdminToken() {
  return getEnvString("ADMIN_API_TOKEN", "LEADS_ADMIN_TOKEN", "ADMIN_LEADS_TOKEN");
}

export function isAdminAuthorized(request: Request) {
  const token = getAdminToken();
  if (!token) return false;

  const bearer = request.headers
    .get("authorization")
    ?.replace(/^Bearer\s+/i, "")
    .trim();
  const headerToken = request.headers.get("x-admin-token")?.trim();
  return bearer === token || headerToken === token;
}
