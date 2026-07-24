import { getApiRouteDefinition } from "@/lib/api/contracts";
import { apiError, enforceApiRateLimit, getApiRequestId } from "@/lib/api/router";

/**
 * Shared crawlable-/api OG rate-limit gate (#5452).
 *
 * Both `/og` surfaces and `/api/og` (via `createApiHandler("og.render")`) must
 * share the `og.render` contract ceiling so scrapers cannot bypass the limit by
 * hitting the robots-allowed routes.
 *
 * Returns a 429 Response when limited; otherwise null so the caller can render.
 */
export async function maybeOgRateLimitedResponse(request: Request): Promise<Response | null> {
  const ogRoute = getApiRouteDefinition("og.render");
  if (await enforceApiRateLimit(ogRoute, request)) {
    return apiError("rate_limited", 429, { requestId: getApiRequestId(request) });
  }
  return null;
}
