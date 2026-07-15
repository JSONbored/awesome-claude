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

export type EcosystemMatrixSupport = "native" | "adapter" | "manual" | "none";

export function ecosystemMatrixCellAnalyticsEvent(): string {
  return "ecosystem_matrix_cell_click";
}

export function ecosystemMatrixCellAnalyticsData(
  clientId: string,
  support: EcosystemMatrixSupport,
  rowIndex: number,
  columnIndex: number,
  capabilityCount: number,
  clientCount: number,
) {
  return {
    surface: ECOSYSTEM_PAGE_SURFACE,
    clientId,
    support,
    rowIndex,
    columnIndex,
    capabilityCount,
    clientCount,
  };
}

export function ecosystemMatrixClientFocusAnalyticsEvent(): string {
  return "ecosystem_matrix_client_focus_click";
}

export function ecosystemMatrixClientFocusAnalyticsData(
  clientId: string,
  active: boolean,
  clientCount: number,
) {
  return {
    surface: ECOSYSTEM_PAGE_SURFACE,
    clientId,
    active,
    clientCount,
  };
}

export function ecosystemMatrixSupportFocusAnalyticsEvent(): string {
  return "ecosystem_matrix_support_focus_click";
}

export function ecosystemMatrixSupportFocusAnalyticsData(
  support: EcosystemMatrixSupport,
  active: boolean,
  clientCount: number,
) {
  return {
    surface: ECOSYSTEM_PAGE_SURFACE,
    support,
    active,
    clientCount,
  };
}

export function ecosystemMatrixFocusClearAnalyticsEvent(): string {
  return "ecosystem_matrix_focus_clear_click";
}

export function ecosystemMatrixFocusClearAnalyticsData(
  hadClientFocus: boolean,
  hadSupportFocus: boolean,
) {
  return {
    surface: ECOSYSTEM_PAGE_SURFACE,
    hadClientFocus,
    hadSupportFocus,
  };
}

export function ecosystemMatrixCsvAnalyticsEvent(): string {
  return "ecosystem_matrix_csv_click";
}

export function ecosystemMatrixCsvAnalyticsData(capabilityCount: number, clientCount: number) {
  return {
    surface: ECOSYSTEM_PAGE_SURFACE,
    capabilityCount,
    clientCount,
  };
}

export function ecosystemMatrixDocAnalyticsEvent(): string {
  return "ecosystem_matrix_doc_click";
}

export function ecosystemMatrixDocAnalyticsData(
  clientId: string,
  support: EcosystemMatrixSupport,
  rowIndex: number,
  columnIndex: number,
) {
  return {
    surface: ECOSYSTEM_PAGE_SURFACE,
    clientId,
    support,
    rowIndex,
    columnIndex,
  };
}

export type EcosystemSetupSurface = "mcp-host" | "adapter" | "extension" | "web";
export type EcosystemSetupDocDestination = "external" | "internal";

export function ecosystemFeedKey(path: string): string {
  const parts = path.split("/").filter(Boolean);
  return parts[parts.length - 1] ?? path;
}

export function ecosystemSetupClientAnalyticsEvent(): string {
  return "ecosystem_setup_client_click";
}

export function ecosystemSetupClientAnalyticsData(
  clientId: string,
  surfaceType: EcosystemSetupSurface,
  rowIndex: number,
  clientCount: number,
) {
  return {
    surface: ECOSYSTEM_PAGE_SURFACE,
    clientId,
    surfaceType,
    rowIndex,
    clientCount,
  };
}

export function ecosystemSetupDocAnalyticsEvent(): string {
  return "ecosystem_setup_doc_click";
}

export function ecosystemSetupDocAnalyticsData(
  clientId: string,
  surfaceType: EcosystemSetupSurface,
  destination: EcosystemSetupDocDestination,
) {
  return {
    surface: ECOSYSTEM_PAGE_SURFACE,
    clientId,
    surfaceType,
    destination,
  };
}

export function ecosystemFeedPathAnalyticsEvent(): string {
  return "ecosystem_feed_path_click";
}

export function ecosystemFeedPathAnalyticsData(
  feedKey: string,
  contentType: string,
  rowIndex: number,
  feedCount: number,
) {
  return {
    surface: ECOSYSTEM_PAGE_SURFACE,
    feedKey,
    contentType,
    rowIndex,
    feedCount,
  };
}

export type EcosystemQuickStartAction = "manifest-pin" | "mcp-run" | "raycast-install";

export function ecosystemQuickStartCopyAnalyticsEvent(): string {
  return "ecosystem_quick_start_copy_click";
}

export function ecosystemQuickStartCopyAnalyticsData(
  action: EcosystemQuickStartAction,
  rowIndex: number,
  quickStartCount: number,
) {
  return {
    surface: ECOSYSTEM_PAGE_SURFACE,
    action,
    rowIndex,
    quickStartCount,
  };
}
