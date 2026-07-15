/**
 * Pure integrations hub navigation analytics helpers.
 *
 * Maps integration card, ecosystem egress, API docs, and detail cross-links
 * to privacy-light event names without embedding integration names or URLs.
 */

export const INTEGRATIONS_INDEX_SURFACE = "integrations-index";
export const INTEGRATIONS_DETAIL_SURFACE = "integrations-detail";

export function integrationsIndexCardAnalyticsEvent(): string {
  return "integrations_index_card_click";
}

export function integrationsIndexCardAnalyticsData(
  integrationSlug: string,
  rowIndex: number,
  integrationCount: number,
  status: string,
  kind: string,
) {
  return {
    surface: INTEGRATIONS_INDEX_SURFACE,
    integrationSlug,
    rowIndex,
    integrationCount,
    status,
    kind,
  };
}

export function integrationsIndexEcosystemAnalyticsEvent(): string {
  return "integrations_index_ecosystem_click";
}

export function integrationsIndexEcosystemAnalyticsData(integrationCount: number) {
  return {
    surface: INTEGRATIONS_INDEX_SURFACE,
    integrationCount,
  };
}

export function integrationsIndexApiDocsAnalyticsEvent(): string {
  return "integrations_index_api_docs_click";
}

export function integrationsIndexApiDocsAnalyticsData(integrationCount: number) {
  return {
    surface: INTEGRATIONS_INDEX_SURFACE,
    integrationCount,
  };
}

export function integrationsDetailIndexAnalyticsEvent(): string {
  return "integrations_detail_index_click";
}

export function integrationsDetailIndexAnalyticsData(
  integrationSlug: string,
  relatedCount: number,
) {
  return {
    surface: INTEGRATIONS_DETAIL_SURFACE,
    integrationSlug,
    relatedCount,
  };
}

export function integrationsDetailRelatedAnalyticsEvent(): string {
  return "integrations_detail_related_click";
}

export function integrationsDetailRelatedAnalyticsData(
  integrationSlug: string,
  relatedSlug: string,
  rowIndex: number,
  relatedCount: number,
) {
  return {
    surface: INTEGRATIONS_DETAIL_SURFACE,
    integrationSlug,
    relatedSlug,
    rowIndex,
    relatedCount,
  };
}
