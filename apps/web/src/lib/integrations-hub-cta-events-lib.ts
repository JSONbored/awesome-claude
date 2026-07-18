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

export type IntegrationsDetailActionRole = "primary" | "secondary";

export function integrationsDetailActionAnalyticsEvent(): string {
  return "integrations_detail_action_click";
}

export function integrationsDetailActionAnalyticsData(
  integrationSlug: string,
  action: IntegrationsDetailActionRole,
  status: string,
  kind: string,
) {
  return {
    surface: INTEGRATIONS_DETAIL_SURFACE,
    integrationSlug,
    action,
    status,
    kind,
  };
}

export function integrationsDetailInstallCopyAnalyticsEvent(): string {
  return "integrations_detail_install_copy_click";
}

export function integrationsDetailInstallCopyAnalyticsData(
  integrationSlug: string,
  installIndex: number,
  installCount: number,
  status: string,
  kind: string,
) {
  return {
    surface: INTEGRATIONS_DETAIL_SURFACE,
    integrationSlug,
    installIndex,
    installCount,
    status,
    kind,
  };
}

export type IntegrationsIndexCardDestination = {
  to: "/integrations/$slug";
  params: { slug: string };
};

/** Map an integrations index card slug to a detail destination. */
export function integrationsIndexCardDestination(
  slug: string,
): IntegrationsIndexCardDestination | null {
  const id = slug.trim();
  switch (id) {
    case "":
      return null;
    default:
      return { to: "/integrations/$slug", params: { slug: id } };
  }
}

export type IntegrationsIndexChromeDestination = {
  to: "/ecosystem" | "/api-docs";
};

/** Map an integrations index chrome CTA id to ecosystem or API docs. */
export function integrationsIndexChromeDestination(
  destination: string,
): IntegrationsIndexChromeDestination | null {
  switch (destination) {
    case "ecosystem":
      return { to: "/ecosystem" };
    case "api-docs":
      return { to: "/api-docs" };
    default:
      return null;
  }
}

export type IntegrationsDetailIndexDestination = {
  to: "/integrations";
};

/** Map an integrations detail index egress id to the integrations index. */
export function integrationsDetailIndexDestination(
  destination: string,
): IntegrationsDetailIndexDestination | null {
  switch (destination) {
    case "integrations":
      return { to: "/integrations" };
    default:
      return null;
  }
}

export type IntegrationsDetailRelatedDestination = {
  to: "/integrations/$slug";
  params: { slug: string };
};

/** Map a related integration slug to a detail destination. */
export function integrationsDetailRelatedDestination(
  slug: string,
): IntegrationsDetailRelatedDestination | null {
  const id = slug.trim();
  switch (id) {
    case "":
      return null;
    default:
      return { to: "/integrations/$slug", params: { slug: id } };
  }
}
