import { ZodError } from "zod";

import {
  getApiRouteDefinition,
  type ApiRouteDefinition,
  type ApiRouteId,
} from "@/lib/api/contracts";
import { hasJsonContentType, isAllowedOrigin } from "@/lib/api-security";
import { BodyTooLargeError } from "@/lib/api-security";
import { logApiError, logApiWarn } from "@/lib/api-logs";
import {
  apiError,
  enforceRateLimit,
  getRequestId,
  normalizeZodIssues,
  parseRequest,
  withApiHeaders,
  type NextRouteContext,
} from "@/lib/api/router-lib";

type ParsedApiContext<TDefinition extends ApiRouteDefinition> = {
  request: Request;
  requestId: string;
  route: TDefinition;
  params: unknown;
  query: unknown;
  body: unknown;
  rawBody?: string;
};

export {
  apiError,
  apiJson,
  enforceApiRateLimit,
  getApiRequestId,
  withApiHeaders,
} from "@/lib/api/router-lib";

export type { InferApiBody, InferApiParams, InferApiQuery } from "@/lib/api/router-lib";

export function createApiHandler<TDefinition extends ApiRouteDefinition>(
  routeId: ApiRouteId,
  handler: (context: ParsedApiContext<TDefinition>) => Promise<Response>,
) {
  const route = getApiRouteDefinition(routeId) as TDefinition;

  return async (request: Request, context?: NextRouteContext) => {
    const requestId = getRequestId(request);

    if (route.originCheck && !isAllowedOrigin(request)) {
      logApiWarn(request, `${route.id}.forbidden_origin`);
      return apiError("forbidden_origin", 403, { requestId });
    }

    if ((route.bodySchema || route.requiresJsonBody) && !hasJsonContentType(request)) {
      logApiWarn(request, `${route.id}.invalid_content_type`);
      return apiError("invalid_content_type", 415, { requestId });
    }

    if (await enforceRateLimit(route, request)) {
      logApiWarn(request, `${route.id}.rate_limited`);
      return apiError("rate_limited", 429, { requestId });
    }

    let parsed: Awaited<ReturnType<typeof parseRequest>>;
    try {
      parsed = await parseRequest(route, request, context);
    } catch (error) {
      if (error instanceof BodyTooLargeError) {
        logApiWarn(request, `${route.id}.payload_too_large`);
        return apiError("payload_too_large", 413, { requestId });
      }
      if (error instanceof SyntaxError) {
        logApiWarn(request, `${route.id}.invalid_json`);
        return apiError("invalid_json", 400, { requestId });
      }
      if (error instanceof ZodError) {
        logApiWarn(request, `${route.id}.invalid_payload`, {
          issues: normalizeZodIssues(error),
        });
        return apiError("invalid_payload", 400, {
          requestId,
          details: normalizeZodIssues(error),
        });
      }
      throw error;
    }

    try {
      const response = await handler({
        request,
        requestId,
        route,
        ...parsed,
      });
      return withApiHeaders(response);
    } catch (error) {
      logApiError(request, `${route.id}.unhandled_error`, {
        error: error instanceof Error ? error.message : "unknown",
      });
      return apiError("internal_error", 500, { requestId });
    }
  };
}
