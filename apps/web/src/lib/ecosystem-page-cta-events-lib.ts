/**
 * Pure ecosystem page navigation analytics helpers.
 *
 * Maps API docs egress, section sub-nav, integration cards, kind filters,
 * and harness browse links to privacy-light event names without URLs or titles.
 */

export const ECOSYSTEM_PAGE_SURFACE = "ecosystem-page";

export function ecosystemApiDocsAnalyticsEvent(): string {
  return "ecosystem_api_docs_click";
}

export function ecosystemApiDocsAnalyticsData(
  integrationCount: number,
  liveIntegrationCount: number,
) {
  return {
    surface: ECOSYSTEM_PAGE_SURFACE,
    integrationCount,
    liveIntegrationCount,
  };
}

export function ecosystemSectionAnalyticsEvent(): string {
  return "ecosystem_section_click";
}

export function ecosystemSectionAnalyticsData(
  sectionId: string,
  rowIndex: number,
  sectionCount: number,
) {
  return {
    surface: ECOSYSTEM_PAGE_SURFACE,
    sectionId,
    rowIndex,
    sectionCount,
  };
}

export function ecosystemKindFilterAnalyticsEvent(): string {
  return "ecosystem_kind_filter_click";
}

export function ecosystemKindFilterAnalyticsData(kindFilter: string, matchCount: number) {
  return {
    surface: ECOSYSTEM_PAGE_SURFACE,
    kindFilter,
    matchCount,
  };
}

export function ecosystemIntegrationCardAnalyticsEvent(): string {
  return "ecosystem_integration_card_click";
}

export function ecosystemIntegrationCardAnalyticsData(
  integrationSlug: string,
  rowIndex: number,
  visibleCount: number,
  kindFilter: string,
  status: string,
  kind: string,
) {
  return {
    surface: ECOSYSTEM_PAGE_SURFACE,
    integrationSlug,
    rowIndex,
    visibleCount,
    kindFilter,
    status,
    kind,
  };
}

export function ecosystemHarnessBrowseAnalyticsEvent(): string {
  return "ecosystem_harness_browse_click";
}

export function ecosystemHarnessBrowseAnalyticsData(
  platformId: string,
  entryCount: number,
  coveragePct: number,
  rowIndex: number,
  harnessCount: number,
) {
  return {
    surface: ECOSYSTEM_PAGE_SURFACE,
    platformId,
    entryCount,
    coveragePct,
    rowIndex,
    harnessCount,
  };
}
