/**
 * Pure API docs page navigation analytics helpers.
 *
 * Maps spec downloads, sidebar endpoint navigation, and integrity cross-links
 * to privacy-light event names without embedding paths, queries, or summaries.
 */

export const API_DOCS_PAGE_SURFACE = "api-docs-page";

export type ApiDocsSpecFormat = "json" | "yaml";

export function apiDocsSpecAnalyticsEvent(): string {
  return "api_docs_spec_click";
}

export function apiDocsSpecAnalyticsData(format: ApiDocsSpecFormat, endpointCount: number) {
  return {
    surface: API_DOCS_PAGE_SURFACE,
    format,
    endpointCount,
  };
}

export function apiDocsEndpointNavAnalyticsEvent(): string {
  return "api_docs_endpoint_nav_click";
}

export function apiDocsEndpointNavAnalyticsData(
  endpointId: string,
  tag: string,
  rowIndex: number,
  visibleCount: number,
) {
  return {
    surface: API_DOCS_PAGE_SURFACE,
    endpointId,
    tag,
    rowIndex,
    visibleCount,
  };
}

export function apiDocsIntegrityNavAnalyticsEvent(): string {
  return "api_docs_integrity_nav_click";
}

export function apiDocsIntegrityNavAnalyticsData(endpointId: string) {
  return {
    surface: API_DOCS_PAGE_SURFACE,
    endpointId,
  };
}

export type ApiDocsPageHashDestination = {
  to: "/api-docs";
  hash: string;
};

/** Map an API docs sidebar/integrity nav id to an in-page hash destination. */
export function apiDocsPageHashDestination(endpointId: string): ApiDocsPageHashDestination | null {
  const id = endpointId.trim();
  switch (id) {
    case "":
      return null;
    default:
      return { to: "/api-docs", hash: id };
  }
}
