/**
 * Pure OpenAPI docs playground navigation analytics helpers.
 *
 * Maps curl copy, send/sample, response copy, and client-example toggles to
 * privacy-light event names without embedding request bodies or response text.
 */

export const OPENAPI_SURFACE = "openapi";

export type OpenApiCopyKind = "curl" | "response";

export function openApiCopyAnalyticsEvent(): string {
  return "openapi_copy_click";
}

export function openApiCopyAnalyticsData(
  endpointId: string,
  method: string,
  copyKind: OpenApiCopyKind,
) {
  return {
    surface: OPENAPI_SURFACE,
    endpointId,
    method,
    copyKind,
  };
}

export function openApiSendAnalyticsEvent(): string {
  return "openapi_send_click";
}

export function openApiSendAnalyticsData(endpointId: string, method: string, liveRequest: boolean) {
  return {
    surface: OPENAPI_SURFACE,
    endpointId,
    method,
    liveRequest,
  };
}

export function openApiAdvancedToggleAnalyticsEvent(): string {
  return "openapi_advanced_toggle_click";
}

export function openApiAdvancedToggleAnalyticsData(
  endpointId: string,
  method: string,
  open: boolean,
  exampleCount: number,
) {
  return {
    surface: OPENAPI_SURFACE,
    endpointId,
    method,
    open,
    exampleCount,
  };
}
