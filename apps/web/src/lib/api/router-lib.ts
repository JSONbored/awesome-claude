import { ZodError, type z } from "zod";

import { getCloudflareBinding } from "@/lib/cloudflare-env.server";
import type { ApiRouteDefinition } from "@/lib/api/contracts";
import {
  BodyTooLargeError,
  getClientIp,
  hasJsonContentType,
  isAllowedOrigin,
  isRateLimited,
  readRequestTextWithinLimit,
} from "@/lib/api-security";
import { applySecurityHeaders } from "@/lib/security-headers";

type NextRouteContext = {
  params?: Promise<Record<string, string>> | Record<string, string>;
};

type RateLimitBinding = {
  limit: (params: { key: string }) => Promise<{ success: boolean }>;
};

export function getRequestId(request: Request) {
  return (
    request.headers.get("cf-ray") || request.headers.get("x-request-id") || crypto.randomUUID()
  );
}

export function getQueryObject(request: Request) {
  const url = new URL(request.url);
  return Object.fromEntries(url.searchParams.entries());
}

export function normalizeZodIssues(error: ZodError) {
  return error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
    code: issue.code,
  }));
}

export function errorMessage(code: string) {
  return code.replaceAll("_", " ").replace(/^\w/, (char) => char.toUpperCase());
}

export function apiError(
  code: string,
  status: number,
  options: {
    details?: unknown;
    message?: string;
    requestId?: string;
    headers?: HeadersInit;
  } = {},
) {
  const headers = applySecurityHeaders(new Headers(options.headers));
  headers.set("content-type", "application/json; charset=utf-8");
  if (!headers.has("cache-control")) headers.set("cache-control", "no-store");

  return Response.json(
    {
      ok: false,
      error: {
        code,
        message: options.message ?? errorMessage(code),
        ...(options.details === undefined ? {} : { details: options.details }),
      },
      ...(options.requestId ? { requestId: options.requestId } : {}),
    },
    { status, headers },
  );
}

export function apiJson(payload: unknown, init: ResponseInit = {}) {
  const headers = applySecurityHeaders(new Headers(init.headers));
  if (!headers.has("cache-control")) headers.set("cache-control", "no-store");
  return Response.json(payload, { ...init, headers });
}

export function withApiHeaders(response: Response) {
  applySecurityHeaders(response.headers);
  return response;
}

export async function getCloudflareRateLimitBinding(
  definition: ApiRouteDefinition,
): Promise<RateLimitBinding | null> {
  const bindingName = definition.rateLimit?.binding;
  if (!bindingName) return null;

  const binding = getCloudflareBinding<RateLimitBinding>(bindingName);
  if (binding && typeof binding.limit === "function") {
    return binding;
  }

  return null;
}

export async function isCloudflareRateLimited(definition: ApiRouteDefinition, request: Request) {
  const binding = await getCloudflareRateLimitBinding(definition);
  if (!binding || !definition.rateLimit) return false;

  const key = `${definition.rateLimit.scope}:${getClientIp(request)}`;
  try {
    const result = await binding.limit({ key });
    return result.success === false;
  } catch {
    return false;
  }
}

export async function enforceRateLimit(definition: ApiRouteDefinition, request: Request) {
  const limit = definition.rateLimit;
  if (!limit) return false;

  if (await isCloudflareRateLimited(definition, request)) return true;

  return isRateLimited({
    request,
    scope: limit.scope,
    limit: limit.limit,
    windowMs: limit.windowMs,
  });
}

export function getApiRequestId(request: Request) {
  return getRequestId(request);
}

export async function enforceApiRateLimit(definition: ApiRouteDefinition, request: Request) {
  return enforceRateLimit(definition, request);
}

export async function parseRequest(
  definition: ApiRouteDefinition,
  request: Request,
  routeContext?: NextRouteContext,
) {
  const params = routeContext?.params ? await routeContext.params : {};
  const parsedParams = definition.paramsSchema ? definition.paramsSchema.parse(params) : params;
  const parsedQuery = definition.querySchema
    ? definition.querySchema.parse(getQueryObject(request))
    : {};

  let parsedBody: unknown = undefined;
  let rawBody: string | undefined = undefined;
  if (definition.bodySchema || definition.requiresJsonBody) {
    rawBody = definition.bodyLimitBytes
      ? await readRequestTextWithinLimit(request, definition.bodyLimitBytes)
      : await request.text();
    if (definition.bodySchema) {
      parsedBody = definition.bodySchema.parse(JSON.parse(rawBody));
    }
  }

  return {
    params: parsedParams,
    query: parsedQuery,
    body: parsedBody,
    rawBody,
  };
}

export type { NextRouteContext };

export type InferApiBody<T extends z.ZodTypeAny> = z.infer<T>;
export type InferApiQuery<T extends z.ZodTypeAny> = z.infer<T>;
export type InferApiParams<T extends z.ZodTypeAny> = z.infer<T>;
